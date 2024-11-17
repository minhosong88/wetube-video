import express from "express";
import {getEdit, postEdit, logout, see, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword} from "../controllers/userController.js";
import { protectionMiddleware, publicOnlyMiddleware, avatarUpload, handleImageSizeError } from "../middlewares.js";


const userRouter = express.Router();

userRouter.get("/logout", protectionMiddleware, logout);
userRouter.route("/edit")
    .all(protectionMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"),handleImageSizeError, postEdit);
userRouter.route("/change-password")
    .all(protectionMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

userRouter.get("/:id", see);

export default userRouter;