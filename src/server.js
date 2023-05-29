import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res)=>{
    return res.send("<h1>Welcome to HomePage</h1>");
}
const handleLogin = (req, res)=>{
    return res.send("login here");
}

app.get("/", handleHome);
app.get("/login", handleLogin);


const handleListening = () => 
    console.log(`✅Server is listening on port http://localhost:${PORT}`);

app.listen(PORT,handleListening);