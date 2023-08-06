const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const videoPlayBtn = document.getElementById("videoPlayBtn");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime  = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline")
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const form = document.getElementById("commentForm");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const volumeIconsChange = () => {
    if(video.volume > 0 && video.volume < 0.4 ){
        return muteBtnIcon.classList = "fas fa-volume-off";
    } else if(video.volume  >= 0.4 && video.volume < 0.7){
        return muteBtnIcon.classList = "fas fa-volume-down";    
    } else if(video.volume >= 0.7 && video.volume <= 1.0){
        return muteBtnIcon.classList = "fas fa-volume-up";
    }
};

const handlePlayClick = () =>{
     if(video.paused) {
        video.play();
        videoPlayBtn.classList.remove("hidden")
    } else {
        video.pause();
        videoPauseBtn.classList.remove("hidden")

    }
    playBtnIcon.classList = video.paused ? "fas fa-play":"fas fa-pause";
};

const handleVideoClick = () =>{
   handlePlayClick();
}

const handleMuteClick = () =>{
    if(video.muted){
        video.muted = false;
    } else{
        video.muted = true;
    }
    if(video.volume === 0){
        video.volume = volumeValue;
    }
    if(video.muted){
        muteBtnIcon.classList =  "fas fa-volume-mute"
    } else volumeIconsChange()

    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeInput = (event) =>{
    const {
        target:{value},
    } = event;
    video.volume = value;
    if(Number(value) === 0){
        video.muted = true;
        muteBtnIcon.classList = "fas fa-volume-mute";
    }
    if(video.muted){
        video.muted = false;
        volumeIconsChange()
    }

    volumeIconsChange()
    
};

const formatTime = (seconds) => {
    if(seconds >= 3600){
        return new Date(seconds*1000).toISOString().substring(11,19);
    } else {
        return new Date(seconds*1000).toISOString().substring(14,19);
    }
}

const handleVolumeChange = (event) =>{
    const {
        target:{value},
    } = event;
    if(Number(value) !== 0){
        volumeValue = value;
    }
};

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () =>{
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineInput = (event) =>{
    const {
        target : {value},
    } = event;
    if(!video.paused){
        video.pause();
    }
    video.currentTime = value;
};

const handleTimelineChange = (event) =>{
    const {
        target : {value},
    } = event;
    if(video.paused){
        video.play();
    }
    video.currentTime = value;
};

const handleKeyboardControl = (event) =>{
        event.preventDefault();
        if(event.keyCode === 32){
            handlePlayClick();
        }
        if(event.keyCode === 37){
            video.currentTime -= 5;
        }
        if(event.keyCode === 39){
            video.currentTime += 5;
        }
        if(event.keyCode === 38){
           volumeRange.value = video.volume += 0.1;
            if(video.muted){
                video.muted = false;
                volumeIconsChange()
            }
            volumeIconsChange()
        }
        if(event.keyCode === 40){
            volumeRange.value = video.volume -= 0.1;
            volumeIconsChange()
            if(video.muted){
                video.muted = false;
                volumeIconsChange()
            }
            if( Math.floor(video.volume*10) === 0){
                video.muted = true;
                muteBtnIcon.classList = "fas fa-volume-mute";
            } 
        }
};

const handleFullScreenBtn = () =>{
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
    }else {
        videoContainer.requestFullscreen();
    }
};

const handleFullScreenChange = () =>{
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        fullScreenIcon.classList = "fas fa-compress";
    }else {
        fullScreenIcon.classList = "fas fa-expand";
    }
};

const hideControls = () =>  videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);

};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = async () => {
    const { id } = videoContainer.dataset;
    await fetch(`/api/videos/${id}/view`,{
    method: "POST",
    });
};

const handleFormFocusIn = () =>{
    window.removeEventListener("keydown", handleKeyboardControl);
    console.log("comment section focused in");
};
const handleFormFocusOut = () =>{
    window.addEventListener("keydown", handleKeyboardControl);
    console.log("comment section focused out");
};

if(form){
    form.addEventListener("focusin", handleFormFocusIn);
    form.addEventListener("focusout", handleFormFocusOut);
};

playBtn.addEventListener("click", handlePlayClick);
volumeRange.addEventListener("input", handleVolumeInput);
volumeRange.addEventListener("change", handleVolumeChange);
muteBtn.addEventListener("click", handleMuteClick);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handleVideoClick);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineInput);
timeline.addEventListener("change", handleTimelineChange);
document.addEventListener("fullscreenchange", handleFullScreenChange);
window.addEventListener("keydown", handleKeyboardControl);
fullScreenBtn.addEventListener("click", handleFullScreenBtn);