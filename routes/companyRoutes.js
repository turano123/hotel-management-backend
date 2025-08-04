// 📁 hotel-management-backend/routes/companyRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Telegram Chat ID güncelle (sadece giriş yapan kullanıcı kendi ID'sini günceller)
router.post('/updateTelegramId', authMiddleware, async (req, res) => {
  try {
    const { telegramChatId } = req.body;

    if (!telegramChatId) {
      return res.status(400).json({ error: 'Telegram Chat ID zorunludur.' });
    }

    // Giriş yapan kullanıcının ID'sine göre güncelle
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { telegramChatId },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    console.log('✅ Telegram Chat ID güncellendi:', updatedUser.telegramChatId);

    res.status(200).json({
      message: 'Telegram bağlantısı başarıyla güncellendi.',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        companyId: updatedUser.companyId,
        telegramChatId: updatedUser.telegramChatId
      }
    });
  } catch (error) {
    console.error('❌ Telegram ID güncelleme hatası:', error.message);
    res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
  }
});

module.exports = router;
