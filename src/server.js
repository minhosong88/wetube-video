import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import { localsMiddleware } from "./middlewares.js";
import apiRouter from "./routers/apiRouter.js";

const app = express();
const logger= morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "credentialless");
    res.header("Access-Control-Allow-Headers");
    res.header("Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/upload", express.static("upload"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;