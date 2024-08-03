// src/MiddleWare/Token/validateToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Admin } from '@prisma/client'; // Import your Prisma client and Admin type

const prisma = new PrismaClient();
const JWT_Key = process.env.JWT_SECRET || 'JWT_SECRET';

declare global {
  namespace Express {
    interface Request {
      adminId?: number;
      admin?: Admin;
    }
  }
}

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check cookies first, then authorization header
  token = req.cookies?.token;
  if (!token) {
    token = req.headers.authorization?.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_Key) as { userId: number };
    req.adminId = decoded.userId;

    // Fetch admin details from the database using Prisma
    const admin = await prisma.admin.findUnique({
      where: { id: req.adminId },
    });

    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
