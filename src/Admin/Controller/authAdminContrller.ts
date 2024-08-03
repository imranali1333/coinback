// register, login, isValidToken, and logout functions in 


import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../utilities/prismaclient';
dotenv.config({ path: '.variables.env' });
declare module 'express' {
  interface Request {
    adminId?: number;
  }
}
export const register = async (req: Request, res: Response) => {
  try {
    let { email, password, passwordCheck, name, surname } = req.body;

    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: 'Not all fields have been entered.' });
    if (password.length < 5)
      return res.status(400).json({ msg: 'The password needs to be at least 5 characters long.' });
    if (password !== passwordCheck)
      return res.status(400).json({ msg: 'Enter the same password twice for verification.' });

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin)
      return res.status(400).json({ msg: 'An account with this email already exists.' });

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: passwordHash,
        name,
        surname,
      },
    });

    res.status(200).send({
      success: true,
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        surname: newAdmin.surname,
      },
    });
  } catch (err:any) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: 'Not all fields have been entered.' });

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'No account with this email has been registered.',
      });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        id: admin.id,
      },
      process.env.JWT_SECRET as string
    );

    const result = await prisma.admin.update({
      where: { id: admin.id },
      data: { isLoggedIn: true },
    });

    res.json({
      success: true,
      result: {
        token,
        admin: {
          id: result.id,
          name: result.name,
          isLoggedIn: result.isLoggedIn,
        },
      },
      message: 'Successfully logged in admin',
    });
  } catch (err:any) {
    res.status(500).json({ success: false, result: null, message: err.message });
  }
};

export const isValidToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('x-auth-token');
    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Wrong or No authentication token, authorization denied.',
        jwtExpired: true,
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied.',
        jwtExpired: true,
      });

    const admin = await prisma.admin.findUnique({ where: { id: (verified as any).id } });
    if (!admin)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin doesn't exist, authorization denied.",
        jwtExpired: true,
      });

    if (!admin.isLoggedIn)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Admin is already logged out, try to login, authorization denied.',
        jwtExpired: true,
      });
 // @ts-ignore
    req.admin = admin;
    next();
  } catch (err:any) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
      jwtExpired: true,
    });
  }
};



export const isValidTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Wrong or No authentication token, authorization denied.',
        jwtExpired: true,
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!verified) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied.',
        jwtExpired: true,
      });
    }

    const admin = await prisma.admin.findUnique({ where: { id: (verified as any).id } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin doesn't exist, authorization denied.",
        jwtExpired: true,
      });
    }

    if (!admin.isLoggedIn) {
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Admin is already logged out, try to login, authorization denied.',
        jwtExpired: true,
      });
    }

    // @ts-ignore
    req.adminId = admin.id;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
      jwtExpired: true,
    });
  }
};







export const logout = async (req: Request, res: Response) => {
  try {
    const result = await prisma.admin.update({
      // @ts-ignore
      where: { id: req.admin.id },
      data: { isLoggedIn: false },
    });

    res.status(200).json({ isLoggedIn: result.isLoggedIn });
  } catch (err:any) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
    });
  }
};
