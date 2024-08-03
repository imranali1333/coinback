import { Queue } from 'bullmq';
import redis from './redisClient';

const updateQueue = new Queue('updateQueue', { connection: redis });

/**
 * Queue the update balance request.
 * 
 * @param userId - The ID of the user.
 * @param incrementAmount - The amount to increment or decrement.
 */
export async function queueUpdate(userId: number, incrementAmount: number): Promise<void> {
  try {
    await updateQueue.add('balanceUpdate', { userId, incrementAmount });
  } catch (error: any) {
    console.error('Error adding job to queue:', error);
    throw new Error(`Failed to queue balance update: ${error.message}`);
  }
}
