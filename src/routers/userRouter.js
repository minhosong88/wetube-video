import express from "express";
import {getEdit, postEdit, logout, see, startGithubLogin, finishGithubLogin} from "../controllers/userController.js";
import { protectionMiddleware, publicOnlyMiddleware } from "../middlewares.js";


const userRouter = express.Router();

userRouter.get("/logout", protectionMiddleware, logout);
userRouter.route("/edit").all(protectionMiddleware).get(getEdit).post(postEdit);
userRouter.get(":id", see);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin)
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin)
export default userRouter;