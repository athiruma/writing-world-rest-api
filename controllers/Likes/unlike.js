const { db } = require("../../utils/admin");
exports.UnLike = async ( req, res ) =>{
    const username = req.user.username;
    const postId=req.params.postId;
    const likedDocument = db.collection("likes")
    .where("postId",'==',postId)
    .where("username",'==',username).limit(1);

    let data;
    const postDocument = db.doc(`/posts/${postId}`);
    try {
        let snap = await postDocument.get();
        if( snap.exists ){
            data = snap.data();
            data.id = snap.id;
            snap = await likedDocument.get();
        }
        else{
            return res.status(404).json({error:"post Not Found with id = "+postId});
        }
        if( snap.docs[0] ) {
            await db.doc(`/likes/${snap.docs[0].id}`).delete();
        }
        else{
            return res.status(400).json({error:"Not Liked"});
        }
        let likeCount = data.likes-1 <= 0 ? 0 : data.likes-1;
        data.likes = likeCount;
        await db.doc(`/posts/${postId}`).update({likes:likeCount});
        return res.json({likes : data.likes})
    } catch (e) {
        res.json({error:err.code});
        }
}
