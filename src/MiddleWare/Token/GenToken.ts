import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface Options {
  expiresIn: string; // Use a string for expiration time
}

async function generateTokens(email: string): Promise<string> {
  try {
    const payload = { email };
    const token = await jwt.sign(payload, process.env.JWT_SECRET!, options);
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
}

const options: Options = {
  expiresIn: "1h",
};

export { generateTokens };
