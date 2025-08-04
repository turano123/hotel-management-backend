// 📁 handlers/callbackHandler.js
const Reservation = require('../models/Reservation');

module.exports = async function callbackHandler(bot, query, userSessions) {
  const chatId = query.message.chat.id;
  const data = query.data;
  const session = userSessions[chatId];

  if (!session || session.step !== 'confirm' || session.type !== 'reservation') {
    return bot.sendMessage(chatId, '⚠️ Geçersiz işlem. Lütfen işlemi baştan başlatın.');
  }

  if (data === 'confirm_yes') {
    try {
      const reservation = new Reservation({
        ...session.data,
        userId: session.userId,
        companyId: session.companyId,
        notes: [],
        expenses: []
      });

      await reservation.save();
      delete userSessions[chatId];

      return bot.sendMessage(chatId, '✅ Rezervasyon başarıyla kaydedildi.');
    } catch (err) {
      console.error('💥 Rezervasyon kayıt hatası:', err.message);
      return bot.sendMessage(chatId, '❌ Rezervasyon kaydedilemedi. Lütfen tekrar deneyin.');
    }

  } else if (data === 'confirm_no') {
    delete userSessions[chatId];
    return bot.sendMessage(chatId, '❌ Rezervasyon iptal edildi.');
  } else {
    return bot.sendMessage(chatId, '⚠️ Tanımsız işlem. Lütfen tekrar deneyiniz.');
  }
};
