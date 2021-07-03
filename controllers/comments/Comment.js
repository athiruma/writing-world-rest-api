const {db} = require("../../utils/admin");

exports.AddComment = (req, res)=>{
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
        return db.collection("comments").add(newComment);
    })
    .then( () =>{
        postData.comments++;
        postDocument.update({comments:postData.comments});
        return res.json({newComment})
     })
    .catch(err => res.status(500).json({error:err.message}));
};
