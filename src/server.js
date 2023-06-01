import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";


const PORT = 4000; // backend convention is 4000.

const app = express();
const logger= morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
 

const handleListening = () => 
    console.log(`✅Server is listeni6ng on port http://localhost:${PORT}`);

app.listen(PORT,handleListening);