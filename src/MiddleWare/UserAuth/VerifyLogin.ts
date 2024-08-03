// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
