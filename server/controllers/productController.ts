import { Request, Response } from "express";
import { Product } from "../models.js";
import { SEED_PRODUCTS } from "../seedData.js";
import mongoose from "mongoose";

// Create static fallback products with mock IDs
const FALLBACK_PRODUCTS = SEED_PRODUCTS.map((p, index) => ({
  ...p,
  _id: `64a7c8e9b0d1e2f3a4b5c6d${index}`,
  id: `64a7c8e9b0d1e2f3a4b5c6d${index}`,
}));

export const getProducts = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("MongoDB is not connected. Serving fallback seed products.");
      return res.json(FALLBACK_PRODUCTS);
    }
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.json(FALLBACK_PRODUCTS);
  }
};
