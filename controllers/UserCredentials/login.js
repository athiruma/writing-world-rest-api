const { firebase } = require("../../utils/firebase");
const { admin } = require("../../utils/admin");


exports.Login =  ( req, res ) => {
    let token ;
    let userDoc;
    const email = req.body.email;
    const password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email,password)
   .then(function(firebaseUser) {
       userDoc = firebaseUser;
       user = firebaseUser;

       return firebaseUser.user.getIdToken();
   })
   .then( token =>{
       res.json({token});
       return admin.auth().verifyIdToken(token);
   })
   .then(decode =>{
       if(!decode.email_verified){
           userDoc.user.sendEmailVerification();
       }
       return;
   })
  .catch(function(error) {
       // Error Handling
       if(error.code === "auth/user-not-found"){
           return res.json({error: "Email was incorrect"});
       }
       if(error.code === "auth/wrong-password"){
           return res.json({error:"Incorrect Password"});
       }
       return res.json({error:error.code});
  });
}
