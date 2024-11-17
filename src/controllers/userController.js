import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getJoin = (req, res) =>res.render("user/join",{ pageTitle: "Join"});
export const postJoin =async(req, res) => {
    const {name, email, username, password, password2,  location} = req.body;
    const pageTitle = "join";

    //password confirmation
    if(password !== password2){
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage: "Password confirmation does not match."
        })
    }
    //password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,20}/;
    if (!passwordRegex.test(password)) {
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage: "Password must be between 10 and 20 characters long, contain at least one uppercase and one special character."
        });
    }
    //username validation
    const usernameRegex = /^[a-zA-Z0-9_-]{5,20}$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage:
                "Username must be 5-20 characters long and can only contain letters, numbers, underscores, and hyphens.",
        });
    }
    // Name validation
    const namePattern = /^[a-zA-Z\s]{2,30}$/;
    if (!namePattern.test(name)) {
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage: "Name must be 2-50 characters long and can only contain letters and spaces.",
        });
    }
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage: "Please enter a valid email address.",
        });
    }

    // Check if email or username is already taken
    const exists = await User.exists({$or: [{username}, {email}]});
    if(exists){
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage: "This username or email is already taken.",
        });
    }
    try{
        await User.create({
            name,
            email,
            username, 
            password,
            location,
        });
    return res.redirect("/login");
    }catch(error){
        return res.render("user/join", {
            pageTitle:"Upload Video", 
            errorMessage:error._message,
        });
    }
};
export const getLogin = (req, res) => {
    const infoMessage = req.flash("info");
    res.render("user/login", { pageTitle: "Login" , infoMessage})

};
export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly:false});
    const pageTitle = "Login";
    if(!user){
        return res.status(400).render("user/login",{
            pageTitle,
            errorMessage: "An account with this username does not exist."
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("user/login",{
            pageTitle,
            errorMessage: "Wrong password."
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) =>{
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async(req, res) =>{
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config ={
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl,{
            method:"POST",
            headers: {
                Accept: "application/json",
            },  
        })
    ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await(
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await( 
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true  
        );
        if(!emailObj){
            //set notification
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});
        if(!user){
            user = await User.create({
                avatarUrl:userData.avatar_url,
                name: userData.name,
                email: emailObj.email,
                username: userData.login, 
                password:"",
                socialOnly: true, 
                location: userData.location,
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;  
        return res.redirect("/");
        
    } else {
        return res.redirect("/login");
    }
};   
export const getEdit = (req, res) => {
    return res.render("user/edit-profile", {pageTitle:"Edit Profile"});
};
export const postEdit = async(req, res) => {
    const {
        session:{
            user: {_id, username: sessionUsername, email: sessionEmail, avatarUrl },
        },
        body: { name, email, username, location, },
        file,
    } = req;

    const pageTitle = "Edit Profile"

    if (req.fileSizeError) {
        return res.status(400).render("user/edit-profile", {
            pageTitle,
            errorMessage: "File size should not exceed 3MB.",
        });
    }
    if (req.fileValidationError) { 
        return res.status(400).render("user/edit-profile", {
            pageTitle,
            errorMessage: req.fileValidationError,
        })
    }

    if(sessionUsername !== username){
        const exists = await User.exists({username});
        if(exists){
            return res.status(400).render("user/edit-profile", {
                pageTitle,
                errorMessage: "This username is already taken.",
            });
        }
    }
    if(sessionEmail!== email){
        const exists = await User.exists({email});
        if(exists){
            return res.status(400).render("user/edit-profile", {
                pageTitle,
                errorMessage: "This email is already taken.",
            });
        }
    }
//    const isHeroku = process.env.NODE_ENV === "production";
    const updatedUser = await User.findByIdAndUpdate(_id,{
        // avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email, 
        username, 
        location, 
    },{new:true}); 
    req.session.user = updatedUser;
    res.redirect("/users/edit");
};

export const logout = (req, res) => {
    req.session.user = null;
    res.locals.loggedInUser = req.session.user;
    req.session.loggedIn = false;
    req.flash("info", "Bye Bye");
    res.redirect("/");
};

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true){
        req.flash("info", "Can't change password.");
        return res.redirect("/");
    }
    return res.render("user/change-password", {pageTitle:"Change password"});
};
export const postChangePassword =  async(req, res) => {
    const {
        session:{
            user: {_id},
        },
        body: { oldPassword, newPassword, newPasswordConfirm, },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(oldPassword===newPassword){
        return res.status(400).render("/users/change-password",
        {pageTitle:"Change password", 
        errorMessage:"The current password equals new password"
    });
    }
    if(!ok){
        return res.status(400).render("user/change-password", {
            pageTitle:"Change password", 
            errorMessage:"The current password is incorrect"
        }) 
    }
    if(newPassword !== newPasswordConfirm){
        return res.status(400).render("user/change-password", {
            pageTitle:"Change password", 
            errorMessage:"The password does not match the confirmation"
        });
    }
    user.password = newPassword;
    await user.save();
    
        // there was code error here. reason: session was destroyed before the flash message. and crash the application. failure observed.
    req.session.user = null;
    res.locals.loggedInUser = req.session.user; // Instead of destroying session, I changed the code to logout smoothely with info message
    req.session.loggedIn = false;
    req.flash("info", "Password updated. Please log in again");
    res.redirect("/")
 
};

export const see = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path:"owner",
            model: "User",
        },
    }
    );
    if(!user){
        return res.status(404).render("404",{pageTitle: "User Not Found"});
    }
    return res.render("user/profile", {
        pageTitle: `${user.name}'s Profile`,
        user,
    });

};
