const { db, storage } = require("../../utils/admin");
exports.deletePost = async (req,res)=>{
    let title;
    let extension;
    const postId = req.params.postId;
    const username = req.user.username;
    try {
        let snap = await db.collection("posts").where("username",'==',username).get()
        let document ;
        snap.forEach(doc =>{
            if( doc.id === postId ){
                document =doc;
            }
        });
        if( document ){
            title = document.data().title;
            let image = document.data().postImage.split(".");
            extension = image[image.length-1].split("?")[0];
            await document.ref.delete();
        }
        else return res.status(404).json({Error:"Post Not Found with id "+postId});
        snap = await db.collection("likes").where("postId",'==',postId).get();
        if(snap)
            snap.forEach(doc=>{
                doc.ref.delete();
        })
        snap = await db.collection("comments").where("postId",'==',postId).get();
        if(snap)
            snap.forEach(doc=>{
                doc.ref.delete();
            })
        const defaultBucket = storage.bucket();
        const file = defaultBucket.file(`posts/${req.user.username}/${req.user.username}${title}.${extension}`);
        await file.delete();
        return res.json({success:"Deleted Successfully"});
    } catch (e) {
        return res.json({error : e.message});
    }
}
