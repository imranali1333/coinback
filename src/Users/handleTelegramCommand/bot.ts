import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { sendMessage } from './messageSender';
import { handleTelegramCommand } from './telegramHandlers';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN as string, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';

  await handleTelegramCommand(chatId, text);
});

console.log('Bot is running...');
