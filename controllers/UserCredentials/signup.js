const { firebase } = require("../../utils/firebase");
const {  db } = require("../../utils/admin");
exports.SignUp = async ( req, res ) => {
    console.log("hello");
    const password = req.body.password;
    const newUser = {
        email : req.body.email,
		username : req.body.username,
        type : req.body.type,
        dob : req.body.dob,
        imageUrl : "",
    };
    try {
        let snap = await db.doc(`/users/${newUser.username}`).get();
        if( snap.exists ) {
            return res.json({error : "Username Already Taken "});
        }
        const document = await firebase.auth().createUserWithEmailAndPassword(newUser.email,password);
        await document.user.sendEmailVerification();
        newUser.user_id = document.user.uid;
        newUser.createdAt = new Date().toISOString();
        await db.doc(`/users/${newUser.username}`).set(newUser);
        const token = await document.user.getIdToken();
        return res.json({token});

    } catch (err) {
        if(err.code === 'auth/email-already-in-use' ) return res.json({error:'Already have an account,please login'});
        else
            return res.json({error:err.code});
    }
}
