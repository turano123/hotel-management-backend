// 📁 api/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Kullanıcı modelini alıyoruz

// 🔐 JWT doğrulama middleware’i
async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '🚫 Erişim reddedildi. Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tatillen-secret');

    console.log('✅ JWT doğrulandı:', decoded);

    // Kullanıcıyı veritabanından çekiyoruz
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: '❌ Kullanıcı bulunamadı.' });
    }

    // 🔁 Kullanıcı bilgilerini req.user içine ekliyoruz
    req.user = {
      id: user._id,
      companyId: user.companyId || null,
      role: user.role || null
    };

    next(); // Her şey yolundaysa devam et
  } catch (err) {
    console.error('❌ JWT doğrulama hatası:', err.message);
    return res.status(403).json({ error: '🚫 Geçersiz veya süresi dolmuş token.' });
  }
}

module.exports = authenticate;
