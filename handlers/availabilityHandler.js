const moment = require('moment');
const Reservation = require('../models/Reservation');

module.exports = {
  start: (bot, chatId, user, userSessions) => {
    userSessions[chatId] = {
      step: 'askRoomNo',
      data: {},
      userId: user._id,
      companyId: user.companyId,
      type: 'availability'
    };
    return bot.sendMessage(chatId, '🏨 Oda numarası? (örn: 101)');
  },

  process: async (bot, chatId, input, userSessions) => {
    const session = userSessions[chatId];
    if (!session) return bot.sendMessage(chatId, '❌ Oturum bulunamadı. Lütfen /start ile başlayınız.');

    const text = input.trim();

    switch (session.step) {
      case 'askRoomNo':
        session.data.roomNo = text;
        session.step = 'askMonthYear';
        return bot.sendMessage(chatId, '📅 Ay ve yıl? (örn: 08.2025)');

      case 'askMonthYear':
        if (!moment(text, 'MM.YYYY', true).isValid()) {
          return bot.sendMessage(chatId, '⚠️ Lütfen tarihi "AA.YYYY" formatında girin (örn: 08.2025)');
        }

        const startOfMonth = moment(text, 'MM.YYYY').startOf('month').toDate();
        const endOfMonth = moment(text, 'MM.YYYY').endOf('month').toDate();

        const reservations = await Reservation.find({
          roomNo: session.data.roomNo,
          companyId: session.companyId,
          $or: [
            {
              checkIn: { $lt: endOfMonth },
              checkOut: { $gt: startOfMonth }
            }
          ]
        });

        if (reservations.length === 0) {
          return bot.sendMessage(chatId, `✅ ${session.data.roomNo} numaralı oda için ${text} ayında rezervasyon bulunmuyor.`);
        }

        const list = reservations.map(r =>
          `• ${r.customer}: ${moment(r.checkIn).format('DD.MM')} → ${moment(r.checkOut).format('DD.MM')}`
        ).join('\n');

        return bot.sendMessage(chatId, `📅 ${session.data.roomNo} numaralı oda için ${text} ayındaki rezervasyonlar:\n${list}`);
    }
  }
};
