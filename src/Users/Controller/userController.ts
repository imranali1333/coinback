import { Request, Response } from 'express';
import { checkTelegramAuthorization, AuthData } from '../utils/authUtils';
import { userAuthentication } from '../Service/UserService';
import prisma from '../../Admin/utilities/prismaclient';

declare module 'express-session' {
    interface SessionData {
      loggedIn: boolean;
      telegramId: string;
    }
  }
  declare module 'express-session' {
      interface Session {
        loggedIn: boolean;
        telegramId: string;
      }
    }
    export async function authUser(req: Request, res: Response): Promise<void> {
      try {
        const authData = checkTelegramAuthorization(req.query as any);
        await userAuthentication(authData);
        req.session.loggedIn = true;
        req.session.telegramId = authData.id;
        res.status(200).json({ message: 'Authentication successful' });
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  
export async function getUser(req: Request, res: Response): Promise<Response> {
  if (!req.session.loggedIn) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userData = await prisma.userTeleGram.findUnique({
    where: { telegramId: req.session.telegramId }
  });

  if (!userData) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(userData);
}

export function loginUser(req: Request, res: Response): void {
  if (req.session.loggedIn) {
    res.status(200).json({ message: 'Already logged in' });
  } else {
    res.status(200).json({ message: 'Login required', telegramBotUsername: process.env.BOT_USERNAME });
  }
}


export function logoutUser(req: Request, res: Response): void {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
}

// https://api.telegram.org/bot6874242710:AAGxnJ1R00JeRcTWF_9I7sjUvPYZ-Tns4hM/setWebhook?url=https://7188-223-123-9-157.ngrok-free.app/api/auth