// 📁 Tam dosya yolu: hotel-management-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// 🔐 JWT doğrulama middleware’i
function authenticate(req, res, next) {
  // Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '🚫 Erişim reddedildi. Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tatillen-secret');

    // JWT içinden kullanıcı ID’sini al
    req.user = {
      id: decoded.id
    };

    next();
  } catch (err) {
    console.error('❌ JWT doğrulama hatası:', err.message);
    return res.status(403).json({ error: '🚫 Geçersiz veya süresi dolmuş token.' });
  }
}

module.exports = authenticate;
