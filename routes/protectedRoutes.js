// 📁 hotel-management-backend/routes/protectedRoutes.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const User = require('../models/User'); // 🔄 Kullanıcı modelini çekiyoruz

// 🔐 Korunan profil route
router.get('/profile', authenticate, async (req, res) => {
  try {
    // 🔍 Kullanıcı bilgilerini veritabanından al
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json({
      message: 'JWT doğrulaması başarılı 🎉',
      user
    });
  } catch (error) {
    console.error('Profil çekme hatası:', error.message);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
