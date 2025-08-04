// 📁 handlers/paymentHandler.js
const Reservation = require('../models/Reservation');
const moment = require('moment');

module.exports = {
  start: async (bot, chatId, sessions, userSessions) => {
    sessions[chatId] = {
      type: 'odeme',
      step: 'roomNo',
      data: {},
      userId: userSessions[chatId]?.userId || null,
      companyId: userSessions[chatId]?.companyId || null
    };

    return bot.sendMessage(chatId, '💰 Hangi oda numarasının ödemesini almak istiyorsun?');
  },

  process: async (bot, chatId, text, sessions) => {
    const session = sessions[chatId];
    if (!session) {
      return bot.sendMessage(chatId, '❌ Oturum bulunamadı. Lütfen /start komutunu kullanın.');
    }

    switch (session.step) {
      case 'roomNo':
        session.data.roomNo = text.trim();
        session.step = 'checkIn';
        return bot.sendMessage(chatId, '📅 Giriş tarihi nedir? (GG.AA.YYYY)');

      case 'checkIn':
        if (!moment(text, 'DD.MM.YYYY', true).isValid()) {
          return bot.sendMessage(chatId, '⚠️ Lütfen tarihi GG.AA.YYYY formatında girin.');
        }

        const startDate = moment(text, 'DD.MM.YYYY').startOf('day').toDate();
        const endDate = moment(text, 'DD.MM.YYYY').endOf('day').toDate();
        session.data.checkIn = startDate;

        try {
          const reservation = await Reservation.findOne({
            roomNo: session.data.roomNo,
            checkIn: { $gte: startDate, $lte: endDate },
            companyId: session.companyId
          });

          if (!reservation) {
            return bot.sendMessage(chatId, '❌ Bu rezervasyon bulunamadı. Oda numarası ve tarihi kontrol edin.');
          }

          session.data.reservation = reservation;
          session.step = 'amount';

          return bot.sendMessage(chatId, 
            `💸 Tahsil edilecek miktarı girin (₺):\n` +
            `• Toplam: ${reservation.total || 0}₺\n` +
            `• Kapora: ${reservation.deposit || 0}₺\n` +
            `• Kalan: ${Math.max(0, reservation.total - reservation.deposit)}₺`
          );
        } catch (err) {
          console.error('🔴 Rezervasyon sorgu hatası:', err.message);
          return bot.sendMessage(chatId, '❌ Rezervasyon kontrolü sırasında hata oluştu.');
        }

      case 'amount': {
        const amount = parseFloat(text.replace(',', '.'));
        if (isNaN(amount) || amount <= 0) {
          return bot.sendMessage(chatId, '⚠️ Lütfen geçerli bir miktar girin.');
        }

        session.data.amount = amount;
        session.step = 'method';

        return bot.sendMessage(chatId, '💳 Ödeme türünü seçin:', {
          reply_markup: {
            keyboard: [['💵 Nakit', '🏦 Havale', '💳 Kredi Kartı']],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        });
      }

      case 'method': {
        const methods = ['💵 Nakit', '🏦 Havale', '💳 Kredi Kartı'];
        if (!methods.includes(text)) {
          return bot.sendMessage(chatId, '⚠️ Lütfen listeden bir ödeme türü seçin.');
        }

        const { reservation, amount } = session.data;

        reservation.deposit = (reservation.deposit || 0) + amount;
        reservation.remaining = Math.max(0, (reservation.total || 0) - reservation.deposit);

        try {
          await reservation.save();
          delete sessions[chatId];

          return bot.sendMessage(chatId,
            `✅ ${reservation.customer} için ${amount}₺ (${text}) tahsil edildi.\n` +
            `💰 Yeni Kapora: ${reservation.deposit}₺\n` +
            `🧾 Kalan Tutar: ${reservation.remaining}₺`
          );
        } catch (err) {
          console.error('🔴 Ödeme kayıt hatası:', err.message);
          return bot.sendMessage(chatId, '❌ Ödeme kaydedilirken hata oluştu.');
        }
      }

      default:
        return bot.sendMessage(chatId, '❌ Geçersiz işlem adımı.');
    }
  }
};
