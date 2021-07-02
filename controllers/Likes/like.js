const {db } = require("../../utils/admin");
exports.Like =  async( req , res ) => {
    const like = {
        username : req.user.username,
        postId : req.params.postId,
    }
    const likeDoc = db.collection("likes").where("postId",'==',like.postId).where("username",'==',like.username);
    const postDoc = db.doc(`/posts/${like.postId}`);
    try {
        let postData ;

        const document = await postDoc.get();
        let likeData ;
        if( document.exists ) {
            postData = document.data();
            postData.id = document.id;
            likeData = await likeDoc.get();
        }
        else return res.status(404).json({Error:'Post Not Found'});
        if( likeData.empty ){
            await  db.collection("likes").add(like)
            postData.likes++;
            await postDoc.update({likes:postData.likes});
            res.json({likes:postData.likes});
        }
        else return res.status(400).json({error:'post already liked'});
    } catch (e) {
        res.json({error: e.message});
    }


}
