const {verifyToken} = require('../utils/jwtUtil');

const authMiddleware = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Not Authorized' });
  }
  token = token.replace('Bearer ', '');
  try {
    const tokenPayload = verifyToken(token);
    req.user = tokenPayload;
    next();
  } catch (err) {
    return res.status(401).send({ error: 'Not Authorized' });
  }
}

module.exports = {authMiddleware};