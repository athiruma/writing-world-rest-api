const path = require('path');
const express = require('express');
const cors = require('cors')({origin: true});
const busboyBodyParser = require('busboy-body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

/*
    *************************************************
*/
app.use(express.json());
app.use(cors);
app.use(busboyBodyParser());

/*
    *************************************************
*/

const { Auth } = require("./utils/Auth");

app.get("/", ( req, res ) => {
    res.sendFile( path.join(__dirname+"/public/index.html"));
});

const { Login } = require("./controllers/UserCredentials/login");
const { SignUp } = require("./controllers/UserCredentials/signup");
const { ForgotPassword } = require("./controllers/UserCredentials/ForgotPassword");
const { SendVerification } = require("./controllers/UserCredentials/SendVerificationMail");
app.post( "/login", Login);
app.post( "/signup", SignUp);
app.post("/forgotpassword", ForgotPassword);
app.post("/sendverification", Auth, SendVerification);



const { GetAllPosts } = require("./controllers/posts/GetAllPosts");
const { PostData } = require("./controllers/posts/PostData");
const { MyPosts } = require("./controllers/posts/MyPosts");
app.get("/posts", Auth, GetAllPosts );
app.get("/post/:postId", Auth, PostData);
app.get("/myposts/:username", Auth , MyPosts);


const {createPost}  = require("./controllers/posts/create.post");
const { deletePost } = require("./controllers/posts/delete.post");
app.post( "/createpost", Auth, createPost);
app.delete( "/deletepost/:postId", Auth, deletePost);


const { Like } = require("./controllers/Likes/like");
const { UnLike } = require("./controllers/Likes/unlike");
app.post('/like/:postId' , Auth, Like );
app.delete("/like/:postId", Auth, UnLike );


const { AddComment } = require("./controllers/comments/Comment");
const { DeleteComment } = require("./controllers/comments/DeleteComment");

app.put( "/post/:postId/comment",Auth , AddComment );
app.delete("/post/:postId/comment/:commentId", Auth, DeleteComment );


const { MyProfile, Profile } = require("./controllers/profile/MyProfile");
const { UpdateProfile } = require("./controllers/profile/UpdateProfile");


app.get("/profile/:username", Auth , MyProfile);
app.get("/profile", Auth, Profile);
app.put("/UpdateProfile", Auth , UpdateProfile );



app.listen( process.env.PORT , ()=> console.log("http://localhost:"+process.env.PORT));
