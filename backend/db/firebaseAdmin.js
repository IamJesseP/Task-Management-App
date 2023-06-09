import admin, { initializeApp, credential as _credential } from 'firebase-admin';
import serviceAccount from '../key.json';

<<<<<<< HEAD
initializeApp({
    credential: _credential.cert(serviceAccount),
=======
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
>>>>>>> f2acea0fa02fd87f7c5cbd38e0044579fb91a26a
});

export default admin;
