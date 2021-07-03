const { db } = require("../../utils/admin");
exports.GetAllPosts = async ( req, res ) =>{
    let posts = [] ;
    try {
        const snapshot = await db.collection("posts").orderBy("createdAt","desc").get();
        await snapshot.forEach(documnet =>{
            const data = documnet.data();

            data.postId = documnet.id;
            posts.push(data);
        });
        res.json({posts});
    } catch (e) {
        return res.json({error:e.code});
    }
}
