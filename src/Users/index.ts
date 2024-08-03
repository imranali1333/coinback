import express, { Request, Response } from 'express';
import { handleTelegramCommand } from './handleTelegramCommand/telegramHandlers';
import { sendMessage } from './handleTelegramCommand/messageSender';

const app = express();


app.post('/webhook', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const text = message.text;

  try {
    await handleTelegramCommand(chatId, text);
  } catch (error) {
    console.error('Error handling webhook:', error);
    await sendMessage(chatId, 'An error occurred');
  }

  res.sendStatus(200);
});

export default app;
