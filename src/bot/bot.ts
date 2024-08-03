// bot.ts
import { Telegraf } from 'telegraf'
import { config } from 'dotenv'
import { MyContext, createContext } from './context'

config()

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!)

bot.use((ctx, next) => {
  ctx.prisma = createContext()
  return next()
})

bot.command('start', async (ctx) => {
  const user = await ctx.prisma.userTeleGram.upsert({
    where: { telegramId: ctx.message.from.id.toString() },
    update: {},
    create: {
      firstName: ctx.message.from.first_name || 'Unknown',
      lastName: ctx.message.from.last_name || '',
      telegramId: ctx.message.from.id.toString(),
      telegramUsername: ctx.message.from.username || '',
      authDate: new Date().toISOString(), // Example, update as needed
    },
  })
  ctx.reply(`Hello, ${user.firstName}! Welcome to the bot.`)
})

bot.command('quit', async (ctx) => {
  await ctx.telegram.leaveChat(ctx.message.chat.id)
  await ctx.leaveChat()
})

bot.on('text', async (ctx) => {
  ctx.reply(`You said: ${ctx.message.text}`)
})

bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}`, err)
  ctx.reply('An error occurred while processing your request.')
})

export { bot }
