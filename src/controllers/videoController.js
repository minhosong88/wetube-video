import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js"

export const home = async(req, res) => {
    const videos = await Video.find({})
    .sort({createdAt:"desc"})
    .populate("owner");
    return res.render("home",{pageTitle:"Home", videos});
};
export const watch =async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }
    return res.render("video/watch", {pageTitle:video.title,video,});
};

export const getEdit = async(req, res) => {
    const {id} = req.params;
    const {
        user:{_id},
    } = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }
    if(String(video.owner) !== _id){
        return res.status(403).redirect("/");
    }
    return res.render("video/edit", {pageTitle:`Edit: ${video.title}`, video});
};

export const postEdit =async(req, res) => {
    const {id} = req.params;
    const {
        user:{_id},
    } = req.session;
    const {title, description, hashtags} = req.body;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }
    if(String(video.owner) !== _id){
        req.flash("error", "You are not the owner of the video.");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title, 
        description, 
        hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("success", "Changes saved");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) =>{
    return res.render("video/upload", {pageTitle:"Upload Video"});
};

export const postUpload = async(req, res) =>{ 
    const {
        session:{
            user:{_id},
        },
    } = req;
    const isHeroku = process.env.NODE_ENV === "production";
    const { video, thumb } = req.files;
    const {title, description, hashtags} = req.body;
    try{
        const newVideo = await Video.create({
            title,
            description,
            createdAt: Date.now(),
            fileUrl: Video.changePath(isHeroku ? video[0].location : video[0].path),
            thumbUrl: Video.changePath(isHeroku ? thumb[0].location : thumb[0].path),
            owner:_id,
            hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.status(400).redirect("/");
    } catch(error){
        return res.render("video/upload", {
            pageTitle:"Upload Video", 
            errorMessage:error._message,
        });
    }
};

export const deleteVideo =async(req, res) =>{
    const {id} = req.params;
    const {
        user:{_id},
    } = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }
    if(String(video.owner) !== _id){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async(req, res) =>{
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
       videos = await Video.find({
          title:{ 
            $regex: new RegExp(`${keyword}$`, "i"),
        },
        }).populate("owner");
    }
    return res.render("video/search",{pageTitle:"Search", videos});
};

export const registerView = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.view = video.meta.view + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async(req, res) => {
    const {
        session:{ user },
        body:{ text },
        params:{ id },
    } = req;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    const commentUser = await User.findById({_id:user._id}).populate("comments");
    if(!commentUser){
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    });
    video.comments.push(comment._id);
    video.save();
    commentUser.comments.push(comment._id);
    commentUser.save();
    return res.status(201).json({newCommentId: comment._id});
}

export const deleteComment = async(req,res) =>{
    const {
        params:{ id },
    } = req;
    const comment = await Comment.findById(id);
    if(!comment){
        return res.sendStatus(404);
    }
    const video = await Video.findById(comment.video._id);
    const commentUser = await User.findById({_id:comment.owner._id});
    if(!commentUser){
        return res.sendStatus(404);
    }
    const videoCommentIdx = video.comments.indexOf(comment._id);
    const userCommentIdx = commentUser.comments.indexOf(comment._id);
    await Comment.findByIdAndDelete(id);
    video.comments.splice(videoCommentIdx, 1);
    commentUser.comments.splice(userCommentIdx,1);
    video.save();
    commentUser.save();
    return res.sendStatus(200);
}