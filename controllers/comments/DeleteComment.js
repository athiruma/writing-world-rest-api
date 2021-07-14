const {db} = require("../../utils/admin");

exports.DeleteComment = async ( req, res )=>{
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const username = req.user.username;
    console.log(username);
    const postDoc = db.doc(`/posts/${postId}`);
    const comment = db.doc(`/comments/${commentId}`);
    let data;
    try {
        let snap = await postDoc.get();
        if(snap.data()){
            data = snap.data();
            snap = await comment.get();
            if(snap.data()){
                if( snap.data().username === username || username === data.username ){
                    await comment.delete();
                    let commentNums = data.comments - 1 <= 0 ? 0 : data.comments -1 ;
                    data.comments= commentNums;
                    await db.doc(`/posts/${postId}`).update({comments:commentNums});
                    return res.json({success:"Comment Deleted Succesfully"});
                }
                else{
                    return res.json({error:"Your are authorized to delete comment"});
                }
            }
            else{
                return res.json({error:"Comment Not Found"});
            }
        }
        else return res.json({error:"Post Not FOund"});

    } catch (err) {
        res.json({error:err.message})
    }

    // const comment = db.collection("comments");
    // let data;
    // // const postDoc = db.doc(`/posts/${postId}`);
    // postDoc.get()
    // .then( snap => {
    //     if( snap.exists ){
    //         data = snap.data();
    //         return db.doc(`comments/${commentId}`).get()
    //     }
    //     return res.json({error:`Post not Found with id = ${postId}`})
    // })
    // .then(snap=>{
    //     if(snap.exists){
    //         return where("username","==",username).get();
    //     }
    //     return res.status(404).json({Error:"Comment Not FOund1"});
    // })
    // .then(snap => {
    //     if(snap.exists){
    //         return db.doc(`comments/${commentId}`).delete();
    //     }
    //     return res.status(404).json({Error:"Comment Not FOund"});
    // })
    // .then(()=>{
    //     let comments = data.comments - 1 <= 0 ? 0 : data.comments -1 ;
    //     data.comments= comments;
    //     return postDoc.update({comments:comments});
    // })
    // .then(()=> res.json({success:"Comment Deleted"}))
    // .catch(err => res.json({error:err.message}));
}
