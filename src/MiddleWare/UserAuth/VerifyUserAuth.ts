import { Request, Response, NextFunction } from 'express';
import prisma from '../../Admin/utilities/prismaclient';

interface User {
  id: number;
  firstName: string;
  lastName: string | null;
  telegramId: string;
  telegramUsername: string | null;
  profilePicture: string | null;
  authDate: string | null; // Make authDate nullable
  added: Date;
  updatedAt: Date; // Ensure this matches the Prisma schema
}



declare module 'express-session' {
  interface SessionData {
    loggedIn: boolean;
    userId?: number;
    user?: User;
  }
}


export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session.loggedIn && req.session.userId) {
    try {
      const user = await prisma.userTeleGram.findUnique({
        where: { id: req.session.userId },
        select: { 
          id: true,
          firstName: true,
          lastName: true,
          telegramId: true,
          telegramUsername: true,
          profilePicture: true,
          authDate: true, // Assuming you want to handle null values later
          added: true,
          updatedAt: true // Use updatedAt instead of updated
        }
      });      
      if (user) {
        req.session.user = user;
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized: User not found' });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: User not logged in' });
  }
}

