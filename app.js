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
app.post( "/login", Login);
app.post( "/signup", SignUp);


const { GetAllPosts } = require("./controllers/posts/GetAllPosts");
const { PostData } = require("./controllers/posts/PostData");
const { MyPosts } = require("./controllers/posts/MyPosts");
app.get("/posts", GetAllPosts );
app.get("/post/:postId", Auth, PostData);
app.get("/myposts", Auth , MyPosts);


const {createPost}  = require("./controllers/posts/create.post");
const { deletePost } = require("./controllers/posts/delete.post");
app.post( "/createpost", Auth, createPost);
app.delete( "/deletepost/:postId", Auth, deletePost);


const { Like } = require("./controllers/Likes/like");
const { UnLike } = require("./controllers/Likes/unlike");
app.post('/like/:postId' , Auth, Like );
app.delete("/like/:postId", Auth, UnLike );


const { Comment } = require("./controllers/comments/Comment");
const { DeleteComment } = require("./controllers/comments/DeleteComment");
app.post("/post/:postId/comment", Auth, Comment );
app.delete("/post/:postId/comment/:commentId", Auth, DeleteComment );


const { MyProfile } = require("./controllers/profile/MyProfile");
const { UpdateProfile } = require("./controllers/profile/UpdateProfile");
app.get("/profile", Auth , MyProfile);
app.post("/UpdateProfile", Auth , UpdateProfile );



app.listen( process.env.PORT , ()=> console.log("http://localhost:"+process.env.PORT));
