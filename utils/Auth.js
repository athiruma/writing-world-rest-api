const {db, admin} = require("./admin");
let idToken;
exports.Auth = ( req, res, next ) => {
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ){
		idToken = req.headers.authorization.split('Bearer ')[1];
	}
    else{
		return res.status(403).json({error:'Unauthorizes'});
	}
    admin.auth().verifyIdToken(idToken)
    .then( decodedToken => {
        req.user = decodedToken;
        
        return db.collection('users')
        .where('user_id','==',req.user.uid).get();
    })
    .then( snap =>{

        req.user.username = snap.docs[0].data().username;
        req.user.type = snap.docs[0].data().type;
        req.user.imageUrl = snap.docs[0].data().imageUrl;
        req.user.email = snap.docs[0].data().email;
        req.user.dob = snap.docs[0].data().dob;
        req.user.userId = snap.docs[0].data().user_id;
        return next();
    })
    .catch( (err) => {res.json({error:err.message})});
}
