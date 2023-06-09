const admin = require('firebase-admin');
const { StatusCodes } = require('http-status-codes');

// to be used in front of routes that require a user
async function requireFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    [, token] = authHeader.split(' ');
  }
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // returns an object with uid, email, name
    req.user = decodedToken;
    next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(StatusCodes.FORBIDDEN).send('Forbidden');
  }
}

module.exports = requireFirebaseToken;
