import { Request, Response } from "express";
import { User } from "../models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "khatfa_super_secret_key_123";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" });
    }
    
    // Validate email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "صيغة البريد الإلكتروني غير صحيحة" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "كلمة المرور يجب أن تتكون من 6 خانات على الأقل" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "هذا البريد مسجل مسبقاً" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: "تم التسجيل بنجاح، يمكنك الآن تسجيل الدخول" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم أثناء التسجيل" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" }); // 1 day expiration
    
    res.json({ token, message: "تم تسجيل الدخول بنجاح" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم أثناء تسجيل الدخول" });
  }
};
