import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.variables.env' });

export const loginDemo = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        id: "60b4e282eb314b0015faf2a9",
      },
      process.env.JWT_SECRET as string
    );

    res.json({
      success: true,
      result: {
        token,
        admin: {
          id: "60b4e282eb314b0015faf2a9",
          name: "admin",
          isLoggedIn: true,
        },
      },
      message: "Successfully logged in admin",
    });
  } catch (err:any) {
    res
      .status(500)
      .json({ success: false, result: null, message: err.message });
  }
};
