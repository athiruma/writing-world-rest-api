const { db } = require("../../utils/admin");

exports.MyProfile = async ( req , res ) => {
    const username = req.user.username;
    try {
        let data;
        let snap = await db.doc(`/users/${username}`).get();
        data = snap.data();
        data.id = snap.id;
        snap = await db.collection("posts").where("username",'==',username).get()
        data.posts=snap.size
        return res.json({data});
    } catch (e) {
        res.json({error:err.code})
    }


}
