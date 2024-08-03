// src/types/express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}

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
// src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Adjust the type according to your actual `user` object structure
        // Add other properties if necessary
      };
    }
  }
}

// Extend the SessionData type
declare module 'express-session' {
  interface SessionData {
    userId?: string; // Adjust according to your session data
  }
}

// Extend the Request type from Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Adjust according to your user data
        // Add other properties if needed
      };
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: string; // Adjust according to your session data
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Adjust according to your user data
        // Add other properties if needed
      };
    }
  }
}