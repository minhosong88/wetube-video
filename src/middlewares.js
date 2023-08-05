import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials:{
        accessKeyId:process.env.AWS_ID,
        secretAccessKey:process.env.AWS_SECRET,
     }
});

const s3ImageUploader = multerS3({
    s3:s3,
    bucket: "wetubenomad/images",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE
});

const s3VideoUploader = multerS3({
    s3:s3,
    bucket: "wetubenomad/videos",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE
});

export const localsMiddleware = (req, res, next) => {
    
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    console.log(res.locals);
    next();
}

export const protectionMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        next();
    } else{
        req.flash("error", "Log in first");
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware =(req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
} 

export const avatarUpload = multer({
    dest:"upload/avatars/",
    limits:{
        fileSize:3000000
    },
    storage:s3ImageUploader,
});
export const videoUpload = multer({
    dest:"upload/videos/",
    limits:{
        fileSize:10000000
    },
    storage:s3VideoUploader,
});