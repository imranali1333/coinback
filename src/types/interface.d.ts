import { Request } from 'express';

interface Admin {
  id: string;
  enabled: boolean;
  email: string;
  name: string;
  surname: string;
}

export interface CustomRequest extends Request {
  admin?: Admin;
}
