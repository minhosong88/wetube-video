import multer from "multer";
import multerS3 from "multer-s3";
// import aws from "aws-sdk";

/* const s3 = new aws.S3({
    credentials:{
        accessKeyId:process.env.AWS_ID,
        secretAccessKey:process.env.AWS_SECRET,
     }
}); 

const s3ImageUploader = multerS3({
    s3:s3,
    bucket: "wetubenomad/images",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE
});

const s3VideoUploader = multerS3({
    s3:s3,
    bucket: "wetubenomad/videos",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE

const isHeroku = process.env.NODE_ENV === "production";
});*/

export const localsMiddleware = (req, res, next) => {

    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    //res.locals.isHeroku = isHeroku;
    next();
};

export const protectionMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        req.flash("error", "Log in first");
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
};

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        req.fileValidationError = "Only Images are allowed.";
        cb(null, false);
    }
};

const videoFilter = (req, file, cb) => {
    console.log(file)
    console.log(file.mimetype.startsWith("video/"))
    if (file.fieldname === "video") {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            req.fileValidationError = "Only videos are allowed.";
            cb(null, false);
        }
    } else if (file.fieldname === "thumb") {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            req.fileValidationError = "Only image files are allowed for thumbnails.";
            cb(null, false);
        }
    }
};
// Video filter error occurred because the file has two field names(video, and thumb) but the initial filter only looked for mimetype of the file in general. 
export const videoUpload = multer({
    dest: "upload/videos/",
    limits: {
        fileSize: 10000000,
    },
    fileFilter: videoFilter,
    //storage:isHeroku ? s3VideoUploader : undefined,
});


export const handleImageSizeError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            req.fileSizeError = "File size should not exceed the limit: 3MB(image)";
        }
    }
    next();
};

export const handleVideoSizeError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            req.fileSizeError = "File size should not exceed the limit: 10MB for video or 3MB for thumbnails.";
            return res.status(400).render("video/upload", { // Render the upload page with an error message
                pageTitle: "Upload Video",
                errorMessage: req.fileSizeError
            });
        }
    }
    next();
};

export const avatarUpload = multer({
    dest: "upload/avatars/",
    limits: {
        fileSize: 3000000,
    },
    fileFilter: imageFilter,
    // storage:isHeroku ? s3ImageUploader : undefined,
});
