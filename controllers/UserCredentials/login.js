const { firebase } = require("../../utils/firebase");
const { admin, db } = require("../../utils/admin");

exports.Login = async  ( req, res ) =>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(email,password);
    try {
        const snap =  await firebase.auth().signInWithEmailAndPassword( email, password );
        let token = await snap.user.getIdToken();
        const decodeToken = await admin.auth().verifyIdToken(token);
        if( !decodeToken.email_verified )
                await snap.user.sendEmailVerification();
        return res.json({token});

    } catch (e) {
        if( e.code === "auth/wrong-password" )
            return res.json({password:"wrong Password"});
    }
}
