// 📁 Tam dosya yolu: hotel-management-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '🚫 Erişim reddedildi. Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tatillen-secret');

    // decoded: { id: user._id, iat: ..., exp: ... }
    req.user = {
      id: decoded.id
    };

    next();
  } catch (err) {
    console.error('❌ JWT doğrulama hatası:', err);
    return res.status(403).json({ error: '🚫 Geçersiz token.' });
  }
}

module.exports = authenticate;
