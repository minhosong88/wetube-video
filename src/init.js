import "./db.js";
import "./models/Video.js"
import app from "./server.js"

const PORT = 4000; // backend convention is 4000.


const handleListening = () => 
    console.log(`✅Server is listeni6ng on port http://localhost:${PORT}`);

app.listen(PORT,handleListening);