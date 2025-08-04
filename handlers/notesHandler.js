// 📁 handlers/notesHandler.js
const Reservation = require('../models/Reservation');
const moment = require('moment');

module.exports = {
  start: async (bot, chatId, userSessions) => {
    userSessions[chatId] = {
      step: 'note_oda',
      type: 'notlar',
      data: {},
      userId: userSessions[chatId]?.userId || null,
      companyId: userSessions[chatId]?.companyId || null
    };

    return bot.sendMessage(chatId, '📝 Hangi oda numarasına not eklemek istiyorsun?');
  },

  process: async (bot, chatId, text, userSessions) => {
    const session = userSessions[chatId];
    if (!session || session.type !== 'notlar') {
      return bot.sendMessage(chatId, '❌ Oturum bulunamadı. Lütfen tekrar başlatın.');
    }

    switch (session.step) {
      case 'note_oda':
        session.data.roomNo = text;
        session.step = 'note_tarih';
        return bot.sendMessage(chatId, '📅 Giriş tarihi nedir? (GG.AA.YYYY)');

      case 'note_tarih': {
        const date = moment(text, 'DD.MM.YYYY', true);
        if (!date.isValid()) {
          return bot.sendMessage(chatId, '⚠️ Tarih formatı hatalı. Lütfen GG.AA.YYYY şeklinde yaz.');
        }

        try {
          const reservation = await Reservation.findOne({
            roomNo: session.data.roomNo,
            checkIn: date.toDate(),
            companyId: session.companyId
          });

          if (!reservation) {
            delete userSessions[chatId];
            return bot.sendMessage(chatId, '❌ Bu tarihte ve odada bir rezervasyon bulunamadı.');
          }

          session.reservation = reservation;
          session.step = 'note_action';

          const notes = reservation.notes || [];
          const noteList = notes.length > 0
            ? notes.map((n, i) => `📝 ${i + 1}. ${n}`).join('\n')
            : '📭 Bu rezervasyona ait henüz not bulunmuyor.';

          return bot.sendMessage(chatId, `📋 Mevcut Notlar:\n${noteList}\n\n✍️ Yeni not eklemek için mesaj yaz.`);
        } catch (err) {
          console.error('🔴 Not sorgulama hatası:', err.message);
          return bot.sendMessage(chatId, '❌ Rezervasyon kontrolü sırasında hata oluştu.');
        }
      }

      case 'note_action':
        try {
          const noteText = text.trim();
          if (!noteText) {
            return bot.sendMessage(chatId, '⚠️ Boş not eklenemez.');
          }

          session.reservation.notes.push(noteText);
          await session.reservation.save();

          delete userSessions[chatId];
          return bot.sendMessage(chatId, '✅ Not başarıyla eklendi.');
        } catch (err) {
          console.error('❌ Not ekleme hatası:', err.message);
          return bot.sendMessage(chatId, '❌ Not kaydedilirken bir hata oluştu.');
        }
    }
  }
};
