const { db } = require("../../utils/admin");
exports.PostData = async ( req, res ) => {
    const postId = req.params.postId;
    const post = db.doc(`/posts/${postId}`);
    const likes = db.collection("likes").where("postId","==",postId);
    const comments = db.collection("comments").where("postId","==",postId);
    try {
        const postData = {};
        let snap = await post.get();

        postData.data = snap.data();
        let likesData = [];
        snap = await likes.get();
        snap.forEach( doc =>{
            let likeData = doc.data();
            likeData.id = doc.id;
            likesData.push(likeData);
        });
        postData.likes = likesData;

        let commentsData = [];
        snap = await comments.get();

        snap.forEach( doc =>{
            let commentData = doc.data();
            commentData.id = doc.id;
            commentsData.push(commentData);
        });
        postData.comments = commentsData;
        console.log(postData);
        return res.json({data:postData});
    } catch (e) {
            return res.json({error:e.code});
    }
}
