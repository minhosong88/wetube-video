const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll("#deleteBtn");

const addComment = (text, id) =>{
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id; 
    newComment.className = "video__comment"
    const icon = document.createElement("i");
    icon.className = "fa-regular fa-comment";
    const span = document.createElement("span");
    span.innerText = `${text}`
    const spanIcon = document.createElement("span");
    spanIcon.innerText="❌";
    spanIcon.dataset.id = id;
    spanIcon.id = "deleteBtn";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(spanIcon);
    videoComments.prepend(newComment);

    const instantDeleteBtn = document.getElementById("deleteBtn");
    if(instantDeleteBtn){
        instantDeleteBtn.addEventListener("click", handleDeleteClick);
    }
};

const handleSubmit = async(event) =>{
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text ===""){
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });
    if(response.status ===201){
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
        textarea.value = "";
    }
};

const handleFormFocusIn = () =>{
    removeEventListener(handleKeyboardControl);
}
const handleFormFocusOut = () =>{
    addEventListener(handleKeyboardControl);
}

const handleDeleteClick = async(event) =>{
    const commentId = event.target.dataset.id;
    const response = await fetch(`/api/videos/${commentId}/delete`,{
        method: "Delete",
    });
    if(response.status === 200){
        event.target.parentElement.remove();
    }
};


if(form){
    form.addEventListener("submit", handleSubmit);
    form.addEventListener("focusin", handleFormFocusIn);
    form.addEventListener("focusout", handleFormFocusOut);
};

if(deleteBtn){
    deleteBtn.forEach((btn) =>{
        btn.addEventListener("click", handleDeleteClick);
    });
};
