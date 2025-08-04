const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // 🛡️ Token kontrolü

// ✅ Telegram Chat ID güncelleme - sadece oturum açmış kullanıcı kendi hesabını güncelleyebilir
router.post('/save-chat-id', authMiddleware, async (req, res) => {
  const { chatId } = req.body;

  try {
    const user = await User.findById(req.user.id); // 👤 Sadece token ile gelen kullanıcıyı güncelle
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    user.telegramChatId = chatId;
    await user.save();

    res.json({
      success: true,
      message: 'Telegram Chat ID başarıyla kaydedildi.',
      chatId: user.telegramChatId
    });
  } catch (err) {
    console.error('💥 Telegram Chat ID kaydetme hatası:', err.message);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

module.exports = router;
