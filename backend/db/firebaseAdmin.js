import admin, { initializeApp, credential as _credential } from 'firebase-admin';
import serviceAccount from '../key.json';

initializeApp({
    credential: _credential.cert(serviceAccount),
});

export default admin;
