import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { handleTelegramCommand } from './Users/handleTelegramCommand/telegramHandlers';
import { AuthData, userAuthentication } from './Users/Service/UserService';
import axios from 'axios';
// Load environment variables
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const AUTH_URL = process.env.AUTH_URL;

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is not defined in the environment variables');
  process.exit(1);
}

if (!AUTH_URL) {
  console.error('AUTH_URL is not defined in the environment variables');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const prisma = new PrismaClient();

console.log('Bot initialized with token:', BOT_TOKEN);

// Handle /start command
bot.start(async (ctx: Context) => {
  if (!ctx.from) {
    console.error('ctx.from is undefined');
    await ctx.reply('An error occurred while processing your request.');
    return;
  }

  try {
    console.log('Received /start command from user:', ctx.from);

    const authData: AuthData = {
      id: ctx.from.id.toString(),
      first_name: ctx.from.first_name ?? 'Unknown',
      last_name: ctx.from.last_name ?? '',
      username: ctx.from.username ?? '',
      photo_url: '',
      auth_date: new Date().toISOString(),
      hash: '',
      phone_number:'',
      telegramId:''

    };
    const response = await axios.post(`${AUTH_URL}/api/auth`, authData);
    console.log('Response from response const response  /api/auth:', response.data);
  // Save authData to database using userAuthentication function
    await userAuthentication(authData);

    console.log('User authenticated and saved:', authData);
    await ctx.reply(`Welcome! Authentication status: ${response.data.message}`);

    // Generate authentication URL
    const encodeParam = (param: string | undefined): string => encodeURIComponent(param ?? '');
    const url = `${AUTH_URL}?id=${encodeParam(authData.id)}&first_name=${encodeParam(authData.first_name)}&last_name=${encodeParam(authData.last_name)}&username=${encodeParam(authData.username)}&photo_url=${encodeParam(authData.photo_url)}&auth_date=${encodeParam(authData.auth_date)}&hash=${encodeParam(authData.hash)}`;

    console.log('Generated URL of Bot:', url);

    await ctx.reply(`Welcome! Please authenticate by visiting the following link: ${url}`);
  } catch (error) {
    console.error('Error in bot.start handler:', error);
    await ctx.reply('An error occurred while processing your request.');
  }
});

// Handle text messages
bot.on('text', (ctx: Context) => {
  const { chat, message } = ctx;
  const chatId = chat?.id;
  // @ts-ignore
  const text = message?.text ?? '';

  if (chatId) {
    handleTelegramCommand(chatId, text);
  }
});

// Error handling middleware
bot.catch(async (err: unknown, ctx: Context) => {
  console.error(`Error in bot: ${err instanceof Error ? err.message : 'Unknown error'}`);
  await ctx.reply('Oops! Something went wrong.');
});

// Launch the bot
async function main() {
  try {
    await bot.launch();
    console.log('Bot is running');
  } catch (error) {
    console.error('Failed to launch the bot:', error);
    process.exit(1);
  }
}

main();

// Graceful stop
process.once('SIGINT', async () => {
  await prisma.$disconnect();
  bot.stop('SIGINT');
});

process.once('SIGTERM', async () => {
  await prisma.$disconnect();
  bot.stop('SIGTERM');
});
