const {firebase} = require("../../utils/firebase");

exports.ForgotPassword = ( req, res ) =>{
    const email = req.body.email;
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      return res.end("Send Password Reset Link");
    })
    .catch((err) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return res.json({error:err.message})
    });
}
