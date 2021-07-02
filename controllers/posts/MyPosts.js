const {db} = require("../../utils/admin");

exports.MyPosts = ( req, res ) =>{
    const username = req.user.username ;
    db.collection("posts").where("username",'==',username).get()
    .then(snap=>{
        let posts=[];
        snap.forEach(doc=>{
            let post = doc.data();
            post.postId = doc.id;
            posts.push(post);
        })
        return res.json({posts});
    })
    .catch(err => res.json({error:err.message}));
}
