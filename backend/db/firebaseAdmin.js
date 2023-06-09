import admin, { initializeApp, credential as _credential } from 'firebase-admin';
import serviceAccount from '../key.json';

<<<<<<< HEAD
initializeApp({
    credential: _credential.cert(serviceAccount),
=======
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
<<<<<<< HEAD
=======
>>>>>>> f2acea0fa02fd87f7c5cbd38e0044579fb91a26a
>>>>>>> 83570572f73e653cad93d9855ec393e71654277e
});

export default admin;
