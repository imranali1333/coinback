import redis from "./redisClient";

export async function getCoinsBalance(userId: number): Promise<number | null> {
  try {
    const key = `user:${userId}:coins`;

    // Check the type of the key before getting the value
    const type = await redis.type(key);
    if (type !== 'string') {
      console.error(`Error: Expected key type 'string' but got '${type}'`);
      return null;
    }

    const balance = await redis.get(key);
    return balance ? parseFloat(balance) : null;
  } catch (error:any) {
    console.error('Failed to fetch coins balance:', error);
    throw new Error(`Failed to fetch coins balance: ${error.message}`);
  }
}

export async function setCoinsBalance(userId: number, balance: number): Promise<void> {
    try {
      const key = `user:${userId}:coins`;
  
      // Set the balance as a string
      await redis.set(key, balance.toString());
    } catch (error:any) {
      console.error('Failed to set coins balance:', error);
      throw new Error(`Failed to set coins balance: ${error.message}`);
    }
  }
  