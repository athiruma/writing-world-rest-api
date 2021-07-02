const admin = require("firebase-admin");
serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 storageBucket:"writingworld-9ba1f.appspot.com"
});
const db = admin.firestore();
const storage = admin.storage();
module.exports= {admin, db, storage};
