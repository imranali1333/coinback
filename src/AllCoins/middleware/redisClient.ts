import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // Ensure maxRetriesPerRequest is not set or explicitly set to null
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});
export async function getCoinsBalance(userId: number): Promise<number | null> {
    try {
      const key = `user:${userId}:coins`;
  
      // Check the type of the key before getting the value
      const type = await redis.type(key);
      if (type !== 'string') {
        throw new Error(`Expected key type 'string' but got '${type}'`);
      }
  
      const balance = await redis.get(key);
      return balance ? parseFloat(balance) : null;
    } catch (error) {
      console.error('Failed to fetch coins balance:', error);
      throw error;
    }
  }
export default redis;
