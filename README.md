# WeTube Video Repository

Welcome to the WeTube video repository! This is a clone project inspired by YouTube, providing features such as user authentication, video upload, comments, and more. The project is built using Node.js, Express, MongoDB, and Pug for server-side rendering.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Contact Information](#contact_information)
## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/minhosong88/wetube-video.git
    cd wetube-video
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```plaintext
    DB_URL=your_mongodb_url
    COOKIE_SECRET=your_cookie_secret
    GH_CLIENT=your_github_client_id
    GH_SECRET=your_github_client_secret
    AWS_ID=your_aws_access_key_id
    AWS_SECRET=your_aws_secret_access_key
    NODE_ENV=development
    ```

4. **Run the application:**
    ```bash
    npm run dev
    ```

## Usage

- Open your browser and go to `http://localhost:4000`
- Register a new user or log in with an existing account
- Upload videos, edit your profile, and explore other features

## Project Structure

```plaintext
wetube-video/
├── .gitignore
├── README.md
├── babel.config.json
├── nodemon.json
├── package-lock.json
├── package.json
├── webpack.config.cjs
├── src/
│   ├── client/
│   │   ├── js/
│   │   │   ├── commentSection.js
│   │   │   ├── main.js
│   │   │   ├── recorder.js
│   │   │   └── videoPlayer.js
│   │   └── scss/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── videoController.js
│   ├── models/
│   │   ├── Comment.js
│   │   ├── User.js
│   │   └── Video.js
│   ├── routers/
│   │   ├── apiRouter.js
│   │   ├── rootRouter.js
│   │   ├── userRouter.js
│   │   └── videoRouter.js
│   ├── views/
│   │   ├── mixins/
│   │   │   ├── message.pug
│   │   │   └── video.pug
│   │   ├── partials/
│   │   │   ├── footer.pug
│   │   │   ├── header.pug
│   │   │   └── social-login.pug
│   │   ├── user/
│   │   │   ├── change-password.pug
│   │   │   ├── edit-profile.pug
│   │   │   ├── join.pug
│   │   │   ├── login.pug
│   │   │   └── profile.pug
│   │   ├── video/
│   │   │   ├── edit.pug
│   │   │   ├── search.pug
│   │   │   ├── upload.pug
│   │   │   └── watch.pug
│   │   ├── base.pug
│   │   ├── home.pug
│   │   └── 404.pug
│   ├── db.js
│   ├── init.js
│   ├── middlewares.js
│   └── server.js

## Features

- **User Authentication:**
  - Sign up, log in, and log out functionality
  - GitHub login integration

- **User Profile:**
  - Edit profile
  - Change password

- **Video Management:**
  - Upload videos
  - Edit and delete videos
  - View video details and comments
  - Video search functionality

- **Comments:**
  - Add and delete comments on videos

- **Responsive Design:**
  - Mobile-friendly interface

## API Endpoints

### User Routes

- `GET /join`: Display the sign-up page
- `POST /join`: Handle sign-up form submission
- `GET /login`: Display the login page
- `POST /login`: Handle login form submission
- `GET /users/logout`: Log out the current user
- `GET /users/edit`: Display the edit profile page
- `POST /users/edit`: Handle profile edit form submission
- `GET /users/change-password`: Display the change password page
- `POST /users/change-password`: Handle change password form submission
- `GET /users/github/start`: Start GitHub login process
- `GET /users/github/finish`: Complete GitHub login process
- `GET /users/:id`: Display a user's profile

### Video Routes

- `GET /`: Display the home page with all videos
- `GET /videos/upload`: Display the video upload page
- `POST /videos/upload`: Handle video upload form submission
- `GET /videos/:id`: Watch a video
- `GET /videos/:id/edit`: Display the edit video page
- `POST /videos/:id/edit`: Handle video edit form submission
- `GET /videos/:id/delete`: Delete a video
- `GET /search`: Search for videos

### Root Endpoints
- **GET /** - Home page.
- **GET /join** - Get the sign-up page.
- **POST /join** - Register a new user.
- **GET /login** - Get the login page.
- **POST /login** - Log in a user.
- **GET /search** - Search for videos.

### API Routes

- `POST /api/videos/:id/view`: Register a video view
- `POST /api/videos/:id/comment`: Add a comment to a video
- `DELETE /api/videos/:id/delete`: Delete a comment from a video

## Contact Information

For any inquiries or feedback, please feel free to contact me:

- **Email:** hominsong@naver.com
- **GitHub:** [WeTube Repository](https://github.com/minhosong88/wetube)

