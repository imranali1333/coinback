import { Admin } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    admin?: Admin;
  }
}
declare module 'express-serve-static-core' {
    interface Request {
      user?: User;
    }
  }

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      admin?: Admin;
    }
  }
}

