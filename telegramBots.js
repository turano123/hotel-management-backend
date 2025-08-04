const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const startHandler = require('./handlers/startHandler');
const messageHandler = require('./handlers/messageHandler');
const callbackHandler = require('./handlers/callbackHandler');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const userSessions = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id.toString();
  try {
    await startHandler.start(bot, chatId, userSessions);
  } catch (err) {
    console.error('❗️ Start hatası:', err.message);
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id.toString();
  if (msg.text === '/start') return;

  try {
    await messageHandler.handle(bot, msg, userSessions);
  } catch (err) {
    console.error('❗️ Mesaj hatası:', err.message);
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id.toString();
  try {
    await callbackHandler.handle(bot, query, userSessions);
  } catch (err) {
    console.error('❗️ Callback hatası:', err.message);
  }
});

console.log('🤖 Telegram bot aktif.');

module.exports = bot;
