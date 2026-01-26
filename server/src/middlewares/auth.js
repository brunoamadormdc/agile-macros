const jwt = require('jsonwebtoken');
const env = require('../config/env');

const JWT_SECRET = env.jwtSecret;

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Invalid token' } });
  }
}

module.exports = { requireAuth, JWT_SECRET };
