import express from "express";
import {watch, 
    getEdit, 
    postEdit, 
    postUpload, 
    getUpload, 
    deleteVideo} from "../controllers/videoController.js";
import { protectionMiddleware, videoUpload } from "../middlewares.js";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
.route("/:id([0-9a-f]{24})/edit")
.all(protectionMiddleware)
.get(getEdit)
.post(postEdit);
videoRouter
.route("/:id([0-9a-f]{24})/delete")
.all(protectionMiddleware)
.get(deleteVideo);
videoRouter
.route("/upload")
.all(protectionMiddleware)
.get(getUpload)
.post(videoUpload.fields([
    {name: "video", maxcount: 1},
    {name: "thumb", maxcount: 1},
]), postUpload);

export default videoRouter;
