const { db } = require("../../utils/admin");

exports.MyProfile = async ( req , res ) => {
    const username = req.params.username;
    try {
        let data ={};
        let snap = await db.doc(`/users/${username}`).get();
        data = await snap.data();
        snap = await db.collection("posts").where("username",'==',username).get()
        data.posts=snap.size;
        return res.json({data});
    } catch (e) {
        res.json({error:e.message})
    }
}

exports.Profile = async ( req, res) => {
    const userId = req.user.userId;
    try{
        let data;
        let snap = await db.collection("users").where("user_id", "==", userId).get();
        data = snap.docs[0].data();

        res.json({data});
    }
    catch(e){
        res.json({error:e.message});
    }
}
