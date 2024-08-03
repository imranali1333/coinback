import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN || '';

export interface AuthData {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
  phone_number: string;
  telegramId: string;
}
export interface Hashing {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
  phone_number: string;
  telegramId: string;
}
export function checkTelegramAuthorization(authData: AuthData): AuthData {
  const checkHash = authData.hash;
  const dataCheckArr = [];
  for (const key in authData) {
    if (key !== 'hash') {
      dataCheckArr.push(`${key}=${authData[key as keyof AuthData]}`);
    }
  }
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const hash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  
  if (hash !== checkHash) {
    throw new Error('Data is NOT from Telegram');
  }
  if ((Date.now() / 1000) - parseInt(authData.auth_date) > 86400) {
    throw new Error('Data is outdated');
  }
  return authData;
}

function generateAuthData(): AuthData {
  // @ts-ignore
  return {
    id: '+7330561512099',
    first_name: 'imranali',
    last_name: '44444hfwhf',
    username: '@aaliiajaii.dev',
    photo_url: 'http://example.com/photo.jpg',
    phone_number:  "03056151224",
    auth_date: Math.floor(Date.now() / 1000).toString(),
    telegramId:"1234556"
  };
}

export function generateHash(authData: Hashing): string {
  const dataCheckArr = [];
  for (const key in authData) {
    dataCheckArr.push(`${key}=${authData[key as keyof AuthData]}`);
  }
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  return crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
}

function generateAuthUrl(authData: AuthData): string {
  const hash = generateHash(authData);
  const params = new URLSearchParams({
    ...authData,
    hash
  }).toString();
  return `http://localhost:8080/api/auth?${params}`;
}

const authData = generateAuthData();
const url = generateAuthUrl(authData);

console.log('Generated URL for Test:', url);
