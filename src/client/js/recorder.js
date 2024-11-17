import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files ={
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg"
}

const downloadFile = (fileUrl, fileName) =>{
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}
// ffmpeg version change - code modification needed. recoding not working due to permissin on the webbrowser. Download was not working due to version incompatibility. 
const handleDownload = async() =>{
    actionBtn.removeEventListener("click", handleDownload);

    actionBtn.innerText = "Transcoding..";

    actionBtn.disabled = true;

    const ffmpeg = new FFmpeg();
    await ffmpeg.load(); 

    await ffmpeg.writeFile(files.input, await fetchFile(videoFile));

    await ffmpeg.exec(["-i", files.input, "-r", "60", files.output]);
    
    await ffmpeg.exec([
        "-i",
        files.input,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb,
    ]);

    const mp4File = await ffmpeg.readFile(files.output);
    const thumbFile = await ffmpeg.readFile(files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], { type:"video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer], { type:"image/jpg"});
    
    const mp4URL = URL.createObjectURL(mp4Blob);
    const thumbURL = URL.createObjectURL(thumbBlob);

    downloadFile(mp4URL,"MyRecording.mp4");
    downloadFile(thumbURL, "MyThumbnail.jpg");

    await ffmpeg.deleteFile(files.input);
    await ffmpeg.deleteFile(files.output);
    await ffmpeg.deleteFile(files.thumb);
    
    URL.revokeObjectURL(mp4URL);
    URL.revokeObjectURL(thumbURL);
    URL.revokeObjectURL(videoFile);

    stream.getTracks().forEach(track => track.stop());
    actionBtn.disabled = false;
    actionBtn.innerText = "Record again";
    actionBtn.addEventListener("click", handleStart);
    init();
};


const handleStart = () =>{
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    };
    recorder.start();
    setTimeout(()=>{
        recorder.stop();
    }, 5000);
};

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: 1024,
            height: 576,
        },
    });
    video.srcObject = stream;
    video.play();
}

init();

actionBtn.addEventListener("click", handleStart);