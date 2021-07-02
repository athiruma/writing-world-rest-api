const {db} = require("../../utils/admin");

exports.Comment = (req,res)=>{
    const newComment = {
        comment : req.body.comment,
        createdAt: new Date().toLocaleString(),
        postId : req.params.postId,
        username:req.user.username,
        imageUrl : req.user.imageUrl
    };
    const postDocument = db.doc(`/posts/${newComment.postId}`);
    let postData;

    db.doc(`/posts/${req.params.postId}`).get()
    .then(doc => {
        if( !doc.exists )
            return res.status(400).json({Error:"Post Not Found"});
        else
            return  postDocument.get();
    })
    .then( doc => {
        postData = doc.data();
        postData.comments++;
        console.log("1");
        postDocument.update({comments:postData.comments});
        console.log("1");
        return db.collection("comments").add(newComment);
    })
    .then( () => res.json({newComment}))
    .catch(err => res.status(500).json({error:err.message}));
};



exports.MyComments = ( req, res ) =>{
    const username = req.user.username;
    db.collection("comments").where("username",'==',username).get()
    .then(snap => {
        let comments = [];
        snap.forEach(doc => {
            comments.push(doc.data());
        });
        return res.json({comments});
    })
    .catch(err => res.json({error:err.message}));
}
