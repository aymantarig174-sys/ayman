import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-insecure-jwt-secret";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "غير مصرح لك بالوصول، يرجى تسجيل الدخول أولاً" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "الجلسة منتهية، يرجى تسجيل الدخول مجدداً" });
    }
    req.user = user as { userId: string };
    next();
  });
};
