const { db,storage } = require("../../utils/admin");
const os = require('os');
const path = require('path');
const fs = require('fs');
exports.createPost = async ( req, res ) => {
    const post = {
            username : req.user.username,
            createdAt:new Date().toISOString(),
            title: req.body.title,
            body : req.body.body,
            comments:0,
            userId: req.user.userId,
            likes:0,
            authorImage : req.user.imageUrl
    }
    const mimetype = req.files["image"].mimetype;
    if(  mimetype === "image/png" || mimetype === "image/jpg" || mimetype === "image/jpeg" ){
        const imageName =  req.files["image"].name;
        const data = req.files["image"].data;
        const imageExtension = imageName.split('.')[imageName.split('.').length - 1];
        const imageFileName = `${post.username}${post.title}.${imageExtension}`;
        const filePath = path.join( os.tmpdir() , imageFileName);
        const imageToBeUploaded ={filePath,mimetype};
        fs.writeFileSync(filePath,data);
        try {
            await storage.bucket().upload(imageToBeUploaded.filePath,{
                resumable:false,
                destination :`posts/${post.username}/${imageFileName}`,
                metadata :{
                    metadata:{
                        contentType : imageToBeUploaded.mimetype
                    }
                }
            });
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/writingworld-9ba1f.appspot.com/o/posts%2F${post.username}%2F${imageFileName}?alt=media`;
            post.postImage = imageUrl;
            await db.collection("posts").add(post);
            return res.json({success:"Post Created Succesfully"})
        } catch (e) {
            res.status(500).json({error:e.code})
        }
    }
    else{
        return res.status(406).json({Error:"Upload only png/jpg/jpeg"});
    }
}

