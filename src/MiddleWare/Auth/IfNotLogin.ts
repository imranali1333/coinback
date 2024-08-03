import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.authToken as string | undefined;

  if (!token) {
    return res.redirect("/admin/admin/login/page");
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded as { /* define your decoded token structure here */ };
    next(); 
  });
}

export default authenticateToken;
