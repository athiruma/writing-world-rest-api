const {db,admin} = require("../../utils/admin");
const {firebase} = require("../../utils/firebase");
const Busboy = require("busboy");
const os = require('os');
const path = require('path');
const fs = require('fs');

exports.UpdateProfile = (req,res) => {
    const imageName = req.files["photo"].name;
    const mimetype = req.files["photo"].mimetype;
    const data = req.files["photo"].data;
    let imageToBeUploaded = {};
    const imageExtension = imageName.split('.')[imageName.split('.').length - 1];
    const imageFileName = `${req.user.username}.${imageExtension}`;
    const filePath = path.join(os.tmpdir() , imageFileName);
    imageToBeUploaded ={filePath,mimetype};
    fs.writeFileSync(filePath,data);
    console.log(imageToBeUploaded);
    admin.storage().bucket().upload(imageToBeUploaded.filePath,{
            resumable:false,
            destination :`profileImages/${imageFileName}`,
            metadata :{
                metadata:{
                    contentType : imageToBeUploaded.mimetype
                }
            }
    })
    .then(()=>{
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/writingworld-9ba1f.appspot.com/o/profileImages%2F${imageFileName}?alt=media`;
        db.collection("posts").where("username",'==',req.user.username).update({authorImage:imageUrl});
        db.collection("comments").where("username",'==',req.user.username).update({imageUrl});
        return db.doc(`/users/${req.user.username}`).update({imageUrl:imageUrl})
    })
    .then(()=>{
        return res.json({Success:"Image Uploaded Succesfully"})
    })
    .catch(err => res.status(500).json({Error:err.code}));
}
