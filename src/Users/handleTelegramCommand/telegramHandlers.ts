
import { AuthData, checkTelegramAuthorization } from '../utils/authUtils';
import { Request, Response } from 'express';
import { userAuthentication } from '../Service/UserService';
import { sendMessage } from './messageSender';
import prisma from '../../Admin/utilities/prismaclient';

declare module 'express-session' {
  interface SessionData {
      loggedIn: boolean;
      telegramId: string;
      
  }
}

declare module 'express-session' {
      interface Session {
        loggedIn: boolean;
        telegramId: string;
        userId?: any;

      }
    }
export async function handleTelegramCommand(chatId: number, text: string): Promise<void> {
  if (text.startsWith('/start')) {
    await handleStartCommand(chatId);
  } else if (text.startsWith('/login')) {
    await handleLoginCommand(chatId);
  } else if (text.startsWith('/logout')) {
    await handleLogoutCommand(chatId);
  } else if (text.startsWith('/user')) {
    await handleUserCommand(chatId);
  } else {
    await sendMessage(chatId, 'Unknown command');
  }
}

async function handleStartCommand(chatId: number): Promise<void> {
  const NGROK_URL = '9b09-182-255-48-55.ngrok-free.app'; // Replace this with your actual ngrok URL
  await sendMessage(chatId, 'Welcome! Use /login to log in.');
}
async function handleLoginCommand(chatId: number): Promise<void> {
  const loginUrl = `http://localhost:3000/api/auth?telegramId=${chatId}`;
  await sendMessage(chatId, `Please log in using the following link: ${loginUrl}`);
}

async function handleLogoutCommand(chatId: number): Promise<void> {
  // Mocking the request and response objects
  const req = { session: { telegramId: chatId, destroy: (cb: Function) => cb(null) } } as unknown as Request;
  const res = {
    status: (code: number) => ({ json: (data: any) => ({ code, data }) })
  } as unknown as Response;

  const response = await new Promise((resolve) => {
    req.session.destroy((err: any) => {
      if (err) {
        resolve(res.status(500).json({ message: 'Failed to logout' }));
      } else {
        resolve(res.status(200).json({ message: 'Logout successful' }));
      }
    });
  });
// @ts-ignore
  await sendMessage(chatId, response.data.message);
}

async function handleUserCommand(chatId: number): Promise<void> {
  // Mocking the request and response objects
  const req = { session: { loggedIn: true, telegramId: chatId.toString() } } as unknown as Request;
  const res = {
    status: (code: number) => ({
      json: (data: any) => ({ code, data })
    })
  } as unknown as Response;

  const userData = await prisma.userTeleGram.findUnique({
    where: { telegramId: chatId.toString() }
  });

  const response = !req.session.loggedIn
    ? res.status(401).json({ message: 'Unauthorized' })
    : userData
    ? res.status(200).json(userData)
    : res.status(404).json({ message: 'User not found' });
// @ts-ignore
  await sendMessage(chatId, JSON.stringify(response.data));
}
// src/handleTelegramCommand/telegramHandlers.ts
// src/handleTelegramCommand/telegramHandlers.ts
export async function authUser(req: Request, res: Response): Promise<void> {
  try {
    const id = req.query.id as string || '';
    const telegramId = req.query.telegramId as string || '';
    if (!id || !telegramId) {
      res.status(400).json({ message: 'Missing required fields: id and telegramId' });
      return;
    }
    const { first_name, last_name, username, photo_url, auth_date, hash,phone_number } = req.query;

    console.log('Received POST request to /api/autsjsdhfsfsjdh:', req.body); // Log the entire request body for inspection
    const { from } = req.body.message;
    if (!from) {
      res.status(400).json({ message: 'Invalid request: missing from field' });
      return;
    }
    const authData: AuthData = {
      id: id, 
      first_name: first_name as string,
      last_name: last_name as string,
      username: username as string,
      photo_url: photo_url as string,
      auth_date: auth_date as string,
      hash: hash as string,
      phone_number: phone_number as string,
      telegramId: telegramId, // Assuming telegramId is in query string (or any relevant source)
    };
    console.log(req.query.id)
    console.log(req.query.telegramId)

    // Verify Telegram authorization
    checkTelegramAuthorization(authData);
    try {
      checkTelegramAuthorization(authData);
    } catch (error:any) {
      res.status(400).json({ message: error.message });
      return;
    }
    // Perform user authentication or creation
    await userAuthentication(authData);

    // Fetch the user from the database
    const user = await prisma.userTeleGram.findUnique({
      where: { telegramId: authData.id }
    });

    if (user) {
      req.session.loggedIn = true;
      req.session.userId = user.id; 
      req.session.telegramId = authData.id; 
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      res.status(400).json({ message: 'Authentication failed' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
export async function getUser(req: Request, res: Response): Promise<Response> {
  if (!req.session.loggedIn || !req.session.telegramId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userData = await prisma.userTeleGram.findUnique({
      where: { telegramId: req.session.telegramId },
      include: {
        wallet: true, // Include related wallet
        allCoins: true, // Include related allCoins
        transactions: true, // Include transactions where this user is involved
        fromTransactions: true, // Include transactions where this user is the sender
        toTransactions: true // Include transactions where this user is the receiver
      }
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function searchUsers(req: Request, res: Response): Promise<Response> {
  const query = req.query.q as string;
  const fieldsString = req.query.fields as string;

  if (!query || !fieldsString || query.trim() === '') {
    return res.status(202).json({
      success: false,
      result: [],
      message: "No document found by this request",
    });
  }

  const fieldsArray = fieldsString.split(',');

  // Construct the search criteria
  const searchCriteria = {
    OR: fieldsArray.map(field => ({
      [field]: {
        contains: query,
        mode: 'insensitive',
      }
    }))
  };

  try {
    const users = await prisma.userTeleGram.findMany({
      where: searchCriteria,
      include: {
        wallet: true,
        allCoins: true,
        transactions: {
          include: {
            fromUser: true,
            toUser: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
      take: 10,
    });

    if (users.length > 0) {
      return res.status(200).json({
        success: true,
        result: users,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: "No document found by this request",
      });
    }
  } catch (error) {
    console.error('Error searching for users:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
}
export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  // Retrieve pagination parameters
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;

  try {
    // Query users with pagination and include all related data
    const users = await prisma.userTeleGram.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        telegramId: true,
        phoneNumber:true,
        telegramUsername: true,
        profilePicture: true,
        authDate: true,
        createdAt: true,
        updatedAt: true,
        added: true,
        allCoins: {
          select: {
            id: true,
            balance: true,
          },
        },
        invitationsSent: {
          select: {
            id: true,
            invitedUserId: true,
            code: true,
            acceptedById: true,
            createdAt: true,
          },
        },
        invitationsReceived: {
          select: {
            id: true,
            invitedById: true,
            code: true,
            acceptedById: true,
            createdAt: true,
          },
        },
        eventsAttending: {
          select: {
            id: true,
            name: true,
            date: true,
          },
        },
        tasksAssigned: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        wallet: {
          select: {
            id: true,
            walletId: true,
            balance: true,
            transactions: {
              select: {
                id: true,
                amount: true,
                transactionType: true,
                createdAt: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            transactionType: true,
            createdAt: true,
          },
        },
        fromTransactions: {
          select: {
            id: true,
            amount: true,
            transactionType: true,
            createdAt: true,
          },
        },
        toTransactions: {
          select: {
            id: true,
            amount: true,
            transactionType: true,
            createdAt: true,
          },
        },
      },
    });

    // Count total users
    const count = await prisma.userTeleGram.count();

    // Calculate total pages
    const pages = Math.ceil(count / limit);

    // Construct pagination object
    const pagination = { page, pages, count };

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        result: [],
        pagination,
        message: 'No users found',
      });
    }

    return res.status(200).json({
      success: true,
      result: users,
      pagination,
      message: 'Successfully found all users',
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Internal Server Error',
    });
  }
}

export function loginUser(req: Request, res: Response): void {
  if (req.session.loggedIn) {
    res.status(200).json({ message: 'Already logged in' });
  } else {
    res.status(200).json({ message: 'Login required', telegramBotUsername: process.env.BOT_USERNAME });
  }
}
export function logoutUser(req: Request, res: Response): void {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
}
const NGROK_URL = '9b09-182-255-48-55.ngrok-free.app'; // Replace this with your actual ngrok URL

export async function handleTelegramWebhook(req: Request, res: Response): Promise<void> {
  const { message } = req.body;
  console.log('Incoming request:', req.body)

  if (!message || !message.text || !message.chat || !message.chat.id) {
      res.status(400).send('Invalid message format');
      return;
  }

  const chatId = message.chat.id;
  const text = message.text;

  if (text.startsWith('/start')) {
      await sendMessage(chatId, 'Welcome! Use /login to log in.');
  } else if (text.startsWith('/login')) {
      const loginUrl = `https://${NGROK_URL}/api/auth?telegramId=${chatId}`;
      await sendMessage(chatId, `Please log in using the following link: ${loginUrl}`);
  } else if (text.startsWith('/logout')) {
      // Mocking the request and response objects
      const req = { session: { telegramId: chatId, destroy: (cb: Function) => cb(null) } } as unknown as Request;
      const res = {
          status: (code: number) => ({ json: (data: any) => ({ code, data }) })
      } as unknown as Response;

      const response = await new Promise((resolve) => {
          req.session.destroy((err: any) => {
              if (err) {
                  resolve(res.status(500).json({ message: 'Failed to logout' }));
              } else {
                  resolve(res.status(200).json({ message: 'Logout successful' }));
              }
          });
      });
// @ts-ignore
      await sendMessage(chatId, response.data.message);
  } else if (text.startsWith('/user')) {
      const userData = await prisma.userTeleGram.findUnique({
          where: { telegramId: chatId.toString() }
      });

      if (userData) {
          await sendMessage(chatId, JSON.stringify(userData));
      } else {
          await sendMessage(chatId, 'User not found');
      }
  } else {
      await sendMessage(chatId, 'Unknown command');
  }

  res.status(200).send('OK');
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: "Invalid ID format",
    });
  }

  try {
    // Find the user by id and delete it
    const result = await prisma.userTeleGram.delete({
      where: { id: userId },
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + userId,
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: "Successfully Deleted the document by id: " + userId,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};







