// 📁 handlers/startHandler.js
const User = require('../models/User');

module.exports = async function startHandler(bot, msg, userSessions) {
  const chatId = msg.chat.id;
  const name = msg.chat.first_name || 'Misafir';

  try {
    const replyMarkup = {
      reply_markup: {
        keyboard: [
          ['📅 Rezervasyon Yap'],
          ['✅ Bugünün Girişleri', '⛔ Bugünün Çıkışları'],
          ['📆 Müsaitlik Sorgula'],
          ['📝 Notlar', '💸 Ödeme Al'],
        ],
        resize_keyboard: true
      }
    };

    let user = await User.findOne({ telegramChatId: chatId });

    if (user) {
      userSessions[chatId] = {
        userId: user._id,
        companyId: user.companyId || null
      };

      return bot.sendMessage(
        chatId,
        `✅ Zaten sisteme bağlısın, ${user.firstName || name}!`,
        replyMarkup
      );
    }

    user = await User.findOne({
      telegramChatId: { $in: [null, ''] },
      isActive: true
    });

    if (user) {
      user.telegramChatId = chatId;
      await user.save();

      userSessions[chatId] = {
        userId: user._id,
        companyId: user.companyId || null
      };

      return bot.sendMessage(
        chatId,
        `👋 Merhaba ${name}, Tatillen HMS botuna hoş geldin!`,
        replyMarkup
      );
    }

    return bot.sendMessage(
      chatId,
      '⚠️ Sistemde bu Telegram hesabına bağlanacak uygun bir kullanıcı bulunamadı.\nLütfen panelden bağlantı izni verin.'
    );
  } catch (error) {
    console.error('❌ /start hatası:', error);
    return bot.sendMessage(chatId, '❌ Bir hata oluştu. Lütfen tekrar deneyin.');
  }
};
