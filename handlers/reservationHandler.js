// 📁 handlers/reservationHandler.js
const moment = require('moment');

module.exports = {
  start: (bot, chatId, user, userSessions) => {
    userSessions[chatId] = {
      step: 'roomNo',
      data: {},
      userId: user._id,
      companyId: user.companyId,
      type: 'reservation'
    };
    return bot.sendMessage(chatId, '🏠 Oda numarası giriniz:');
  },

  process: (bot, chatId, input, userSessions) => {
    const session = userSessions[chatId];
    if (!session) return bot.sendMessage(chatId, '❌ Oturum bulunamadı. Lütfen /start ile başlayınız.');

    const text = input.trim();

    switch (session.step) {
      case 'roomNo':
        session.data.roomNo = text;
        session.step = 'customer';
        return bot.sendMessage(chatId, '👤 Müşteri adı:');

      case 'customer':
        session.data.customer = text;
        session.step = 'checkIn';
        return bot.sendMessage(chatId, '📅 Giriş tarihi? (GG.AA.YYYY)');

      case 'checkIn':
        if (!moment(text, 'DD.MM.YYYY', true).isValid()) {
          return bot.sendMessage(chatId, '⚠️ Lütfen tarihi GG.AA.YYYY formatında girin.');
        }
        session.data.checkIn = moment(text, 'DD.MM.YYYY').add(3, 'hours').toDate(); // ✅ saat farkı
        session.step = 'checkOut';
        return bot.sendMessage(chatId, '📅 Çıkış tarihi? (GG.AA.YYYY)');

      case 'checkOut':
        if (!moment(text, 'DD.MM.YYYY', true).isValid()) {
          return bot.sendMessage(chatId, '⚠️ Lütfen tarihi GG.AA.YYYY formatında girin.');
        }
        const checkOut = moment(text, 'DD.MM.YYYY');
        if (checkOut.isSameOrBefore(moment(session.data.checkIn))) {
          return bot.sendMessage(chatId, '⚠️ Çıkış tarihi girişten sonra olmalı.');
        }
        session.data.checkOut = checkOut.add(3, 'hours').toDate();
        session.step = 'adults';
        return bot.sendMessage(chatId, '👥 Yetişkin sayısı?');

      case 'adults':
        session.data.adults = parseInt(text);
        session.step = 'children';
        return bot.sendMessage(chatId, '🧒 Çocuk sayısı?');

      case 'children':
        session.data.children = parseInt(text);
        session.step = 'phone';
        return bot.sendMessage(chatId, '📞 Telefon numarası?');

      case 'phone':
        session.data.phone = text;
        session.step = 'total';
        return bot.sendMessage(chatId, '💰 Toplam tutar (₺)?');

      case 'total':
        session.data.total = parseFloat(text.replace(',', '.'));
        session.step = 'deposit';
        return bot.sendMessage(chatId, '💸 Kapora tutarı (₺)?');

      case 'deposit':
        session.data.deposit = parseFloat(text.replace(',', '.'));
        session.data.remaining = session.data.total - session.data.deposit;
        session.step = 'confirm';

        const r = session.data;
        const summary = 
          `✅ *Rezervasyon Özeti:*\n\n` +
          `🏠 Oda No: *${r.roomNo}*\n` +
          `👤 Müşteri: *${r.customer}*\n` +
          `📅 Tarih: *${moment(r.checkIn).format('DD.MM.YYYY')}* → *${moment(r.checkOut).format('DD.MM.YYYY')}*\n` +
          `👥 Kişi: *${r.adults} yetişkin*, *${r.children} çocuk*\n` +
          `📞 Telefon: *${r.phone}*\n` +
          `💰 Toplam: *${r.total}₺*\n` +
          `💸 Kapora: *${r.deposit}₺*\n` +
          `🧾 Kalan: *${r.remaining}₺*`;

        return bot.sendMessage(chatId, summary, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Kaydet', callback_data: 'confirm_yes' },
                { text: '❌ İptal', callback_data: 'confirm_no' }
              ]
            ]
          }
        });
    }
  }
};
