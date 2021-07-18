const {db,admin} = require("../../utils/admin");
const {firebase} = require("../../utils/firebase");
const Busboy = require("busboy");
const os = require('os');
const path = require('path');
const fs = require('fs');

exports.UpdateProfile = async (req,res) => {
    const imageName = req.files["photo"].name;
    const mimetype = req.files["photo"].mimetype;
    const data = req.files["photo"].data;
    let imageToBeUploaded = {};
    const imageExtension = imageName.split('.')[imageName.split('.').length - 1];
    const imageFileName = `${req.user.username}.${imageExtension}`;
    const filePath = path.join(os.tmpdir() , imageFileName);
    let imageUrl, snap ;
    imageToBeUploaded ={filePath,mimetype};
    fs.writeFileSync(filePath,data);
    try {
        await admin.storage().bucket().upload(imageToBeUploaded.filePath,{
                resumable:false,
                destination :`profileImages/${imageFileName}`,
                metadata :{
                    metadata:{
                        contentType : imageToBeUploaded.mimetype
                    }
                }
        });
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/writingworld-9ba1f.appspot.com/o/profileImages%2F${imageFileName}?alt=media`;

        db.doc(`/users/${req.user.username}`).update({imageUrl:imageUrl});

        if(req.user.type == 1){
            snap = await db.collection("posts").where("username",'==',req.user.username).get();
            if(snap.docs[0].exists)
                snap.forEach(doc=>{
                    doc.ref.update({authorImage:imageUrl});
                })
        }
        snap = await db.collection("comments").where("username",'==',req.user.username).get();
        if(snap)
            snap.forEach(doc=>{
                doc.ref.update({imageUrl});
            })
        return res.json({Success:"Image Uploaded Succesfully"})
    } catch (e) {
        res.status(500).json({error:e.message})
    }

}
