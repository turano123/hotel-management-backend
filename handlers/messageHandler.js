// 📁 handlers/messageHandler.js
const moment = require('moment');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const availabilityHandler = require('./availabilityHandler');
const reservationHandler = require('./reservationHandler');
const notesHandler = require('./notesHandler');
const paymentHandler = require('./paymentHandler');

module.exports = async function messageHandler(bot, msg, userSessions) {
  const chatId = msg.chat.id.toString();
  const text = msg.text?.trim();

  if (!text || text.startsWith('/start')) return;

  try {
    const user = await User.findOne({ telegramChatId: chatId });
    if (!user) {
      return bot.sendMessage(chatId, '❌ Bu Telegram hesabı sisteme kayıtlı değil. Lütfen panelden bağlayın.');
    }

    const session = userSessions[chatId] || {};

    // 🔎 Müsaitlik
    if (text === '📆 Müsaitlik Sorgula') {
      userSessions[chatId] = {
        type: 'availability',
        userId: user._id,
        companyId: user.companyId,
        step: 'availability_room',
        data: {}
      };
      return availabilityHandler.start(bot, chatId, userSessions);
    }
    if (session.type === 'availability') {
      return availabilityHandler.process(bot, chatId, text, userSessions);
    }

    // ➕ Rezervasyon
    if (text === '➕ Rezervasyon Yap' || text === '📅 Rezervasyon Yap') {
      return reservationHandler.start(bot, chatId, user, userSessions);
    }
    if (session.step && session.type === 'reservation') {
      return reservationHandler.process(bot, chatId, text, userSessions);
    }

    // 📝 Notlar
    if (text === '📝 Notlar') {
      userSessions[chatId] = {
        type: 'notlar',
        step: 'note_oda',
        userId: user._id,
        companyId: user.companyId,
        data: {}
      };
      return notesHandler.start(bot, chatId, userSessions);
    }
    if (session.type === 'notlar') {
      return notesHandler.process(bot, chatId, text, userSessions);
    }

    // 💸 Ödeme Al
    if (text === '💸 Ödeme Al') {
      userSessions[chatId] = {
        type: 'odeme',
        step: 'roomNo',
        userId: user._id,
        companyId: user.companyId,
        data: {}
      };
      return paymentHandler.start(bot, chatId, userSessions);
    }
    if (session.type === 'odeme') {
      return paymentHandler.process(bot, chatId, text, userSessions);
    }

    // ✅ Bugünün Girişleri
    if (text === '✅ Bugünün Girişleri') {
      const today = moment().startOf('day');
      const tomorrow = moment(today).add(1, 'days');

      const entries = await Reservation.find({
        companyId: user.companyId,
        checkIn: { $gte: today.toDate(), $lt: tomorrow.toDate() }
      });

      if (entries.length === 0) {
        return bot.sendMessage(chatId, '📥 Bugün giriş yapan yok.');
      }

      const list = entries.map(r =>
        `• ${r.customer} (${moment(r.checkIn).format('DD.MM')} - ${moment(r.checkOut).format('DD.MM')})`
      ).join('\n');

      return bot.sendMessage(chatId, `📥 Bugün giriş yapacaklar:\n${list}`);
    }

    // ⛔ Bugünün Çıkışları
    if (text === '⛔ Bugünün Çıkışları') {
      const today = moment().startOf('day');
      const tomorrow = moment(today).add(1, 'days');

      const exits = await Reservation.find({
        companyId: user.companyId,
        checkOut: { $gte: today.toDate(), $lt: tomorrow.toDate() }
      });

      if (exits.length === 0) {
        return bot.sendMessage(chatId, '📤 Bugün çıkış yapan yok.');
      }

      const list = exits.map(r =>
        `• ${r.customer} (${moment(r.checkIn).format('DD.MM')} - ${moment(r.checkOut).format('DD.MM')})`
      ).join('\n');

      return bot.sendMessage(chatId, `📤 Bugün çıkış yapacaklar:\n${list}`);
    }

    // 🚫 Tanımsız mesaj
    return bot.sendMessage(chatId, `✅ Merhaba ${user.firstName || 'Misafir'}!\nKullanabileceğiniz komutlar:\n📅 Rezervasyon Yap\n📆 Müsaitlik Sorgula\n📝 Notlar\n💸 Ödeme Al\n✅ Bugünün Girişleri\n⛔ Bugünün Çıkışları`);
  } catch (err) {
    console.error('❗️ Hata:', err.message);
    return bot.sendMessage(chatId, '❌ Sistemsel bir hata oluştu. Lütfen tekrar deneyiniz.');
  }
};
