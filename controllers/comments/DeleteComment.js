const {db} = require("../../utils/admin");

exports.DeleteComment = ( req, res )=>{
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const username = req.user.username;
    const comment = db.collection("comments").where("username",'==',username)
    .where("postId",'==',postId);
    let data;
    const postDoc = db.doc(`/posts/${postId}`);
    postDoc.get()
    .then( snap => {
        if( snap.exists ){
            data = snap.data();
            return db.doc(`comments/${commentId}`).get()
        }
        return res.json({error:`Post not Found with id = ${postId}`})
    })
    .then(snap=>{
        if(snap.exists){
            return db.doc(`comments/${commentId}`).delete();
        }
        return res.status(404).json({Error:"Comment Not FOund"});
    })
    .then(()=>{
        let comments = data.comments - 1 <= 0 ? 0 : data.comments -1 ;
        data.comments= comments;
        return postDoc.update({comments:comments});
    })
    .then(()=> res.json({success:"Comment Deleted"}))
    .catch(err => res.json({error:err.code}));
}
