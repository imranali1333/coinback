import { Telegraf } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || '');
const prisma = new PrismaClient();

// Send message function
async function sendMessage(chatId: number, text: string) {
  await bot.telegram.sendMessage(chatId, text);
}

// Start command
bot.start(async (ctx) => {
  const { id, first_name, last_name, username } = ctx.from!;

  // Upsert user
  await prisma.userTeleGram.upsert({
    where: { telegramId: id.toString() },
    update: {
      firstName: first_name,
      lastName: last_name || '',
      telegramUsername: username || '',
      updated: new Date(), // Ensure the updated field is also updated
    },
    create: {
      firstName: first_name,
      lastName: last_name || '',
      telegramId: id.toString(),
      telegramUsername: username || '',
      profilePicture: '', // You might want to set a default or null value here
      authDate: new Date().toISOString(), // Set a default value for authDate
      added: new Date(),
      updated: new Date(),
      createdAt: new Date(),
    }
  });

  await sendMessage(id, 'Welcome! Use /login to log in.');
});

// Login command
bot.command('login', async (ctx) => {
  const chatId = ctx.from!.id;
  const loginUrl = `https://${process.env.NGROK_URL}/auth?telegramId=${chatId}`;
  await sendMessage(chatId, `Please log in using the following link: ${loginUrl}`);
});

// Logout command
bot.command('logout', async (ctx) => {
  const chatId = ctx.from!.id;
  await sendMessage(chatId, 'Logout functionality is simulated.');
});

// User command
bot.command('user', async (ctx) => {
  const chatId = ctx.from!.id;
  const userData = await prisma.userTeleGram.findUnique({
    where: { telegramId: chatId.toString() }
  });
  if (userData) {
    await sendMessage(chatId, JSON.stringify(userData));
  } else {
    await sendMessage(chatId, 'User not found');
  }
});

// Launch bot
bot.launch().then(() => console.log('Bot is running...'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
