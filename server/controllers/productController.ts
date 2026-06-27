import { Request, Response } from "express";
import { Product } from "../models.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ error: "حدث خطأ في جلب المنتجات" });
  }
};
