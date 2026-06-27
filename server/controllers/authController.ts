import { Request, Response } from "express";
import { User } from "../models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { localDb } from "../localDb.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-insecure-jwt-secret";

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

    if (mongoose.connection.readyState !== 1) {
      console.warn("MongoDB offline: registering user to local file-based database");
      const existingLocalUser = localDb.findUserByEmail(email);
      if (existingLocalUser) {
        return res.status(400).json({ error: "هذا البريد مسجل مسبقاً (محاكاة)" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newId = "local-user-" + Math.floor(100000 + Math.random() * 900000);
      localDb.saveUser({
        id: newId,
        email: email,
        passwordHash: hashedPassword,
      });
      return res.json({ message: "تم التسجيل بنجاح، يمكنك الآن تسجيل الدخول (وضع محاكاة)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "هذا البريد مسجل مسبقاً" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Also replicate to local file db
    localDb.saveUser({
      id: user._id.toString(),
      email: email,
      passwordHash: hashedPassword
    });

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

    if (mongoose.connection.readyState !== 1) {
      console.warn("MongoDB offline: logging in user from local file-based database");
      const savedUser = localDb.findUserByEmail(email);
      if (!savedUser) {
        // Quick bypass or register demo user
        if (email.toLowerCase() === "demo@demo.com") {
          const hashedPassword = await bcrypt.hash("123456", 10);
          localDb.saveUser({ id: "local-user-demo", email: "demo@demo.com", passwordHash: hashedPassword });
          const token = jwt.sign({ userId: "local-user-demo", email: "demo@demo.com" }, JWT_SECRET, { expiresIn: "1d" });
          return res.json({ token, message: "تم تسجيل الدخول بنجاح بحساب ديمو" });
        }
        return res.status(400).json({ error: "البريد الإلكتروني غير مسجل بعد" });
      }

      const isMatch = await bcrypt.compare(password, savedUser.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      const token = jwt.sign({ userId: savedUser.id, email: savedUser.email }, JWT_SECRET, { expiresIn: "1d" });
      return res.json({ token, message: "تم تسجيل الدخول بنجاح" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" }); // 1 day expiration
    
    res.json({ token, message: "تم تسجيل الدخول بنجاح" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم أثناء تسجيل الدخول" });
  }
};
