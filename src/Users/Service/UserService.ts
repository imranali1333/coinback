import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function userAuthentication(authData: AuthData): Promise<void> {
  const user = await prisma.userTeleGram.upsert({
    where: { telegramId: authData.telegramId },
    update: {
      firstName: authData.first_name,
      lastName: authData.last_name ?? '', // Handle missing last_name
      telegramUsername: authData.username ?? '', // Handle missing username
      profilePicture: authData.photo_url ?? '', // Handle missing photo_url
      authDate: authData.auth_date,
      phoneNumber: authData.phone_number,
      updatedAt: new Date()
    },
    create: {
      firstName: authData.first_name,
      lastName: authData.last_name ?? '',
      telegramId: authData.telegramId,
      telegramUsername: authData.username ?? '',
      profilePicture: authData.photo_url ?? '',
      authDate: authData.auth_date,
      phoneNumber: authData.phone_number,
      added: new Date(),
      updatedAt: new Date()
    }
  });
  console.log(user.telegramId);
  console.log(user.id);
}
