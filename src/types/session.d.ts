// types/session.d.ts
import session from 'express-session';

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
    }
  }
