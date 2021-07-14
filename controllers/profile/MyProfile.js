const { db } = require("../../utils/admin");

exports.MyProfile = async ( req , res ) => {
    const userId = req.params.userId;
    try {
        let data;
        let snap = await db.collection("users").where("user_id", "==", userId).get();
        data = snap.docs[0].data();
        data.id = snap.docs[0].id;
        snap = await db.collection("posts").where("username",'==',data.username).get()
        data.posts=snap.size;
        return res.json({data});
    } catch (e) {
        res.json({error:e.message})
    }


}
