import { Request, Response } from 'express';
import { updateCoinsBalance, getCoinsBalance } from '../services/allCoinsService';
import { emitCoinsUpdated } from '../../sockets/socketManager';

export async function handleUpdateBalance(req: Request, res: Response): Promise<void> {
  if (!req.session.loggedIn || !req.session.userId) {
    res.status(401).json({ message: 'Unauthorized: User not logged in' });
    return;
  }

  const { incrementAmount } = req.body;

  try {
    const updatedCoins = await updateCoinsBalance(req.session.userId, incrementAmount);
    res.json(updatedCoins);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
export async function handleGetBalance(req: Request, res: Response): Promise<void> {
  if (!req.session.loggedIn || !req.session.userId) {
    res.status(401).json({ message: 'Unauthorized: User not logged in' });
    return;
  }

  try {
    const coins = await getCoinsBalance(req.session.userId);
    res.json(coins);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
