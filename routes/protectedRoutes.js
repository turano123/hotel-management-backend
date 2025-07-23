// 📁 hotel-management-backend/routes/protectedRoutes.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); // ✅ token kontrolü yapan middleware

// 🔐 Korunan örnek route – Kullanıcı profili
router.get('/profile', authenticate, (req, res) => {
  try {
    res.status(200).json({
      message: 'JWT doğrulaması başarılı 🎉',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Yetkisiz erişim' });
  }
});

module.exports = router;
