import { Response } from "express";
import { Product, Order } from "../models.js";
import { AuthRequest } from "../middleware/auth.js";
import mongoose from "mongoose";

export const buyProducts = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body; // Array of { productId, quantity, price }
    
    if (!items || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: "السلة فارغة" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      // Use findOneAndUpdate with $inc for atomic stock deduction
      // We require stock to be >= item.quantity
      const product = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );

      if (!product) {
        // If product is not found or stock is insufficient
        const checkProduct = await Product.findById(item.productId);
        await session.abortTransaction();
        if (checkProduct) {
          return res.status(400).json({ error: `الكمية غير كافية للمنتج: ${checkProduct.name}` });
        }
        return res.status(400).json({ error: "المنتج غير موجود" });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create the order
    const order = new Order({
      userId: req.user?.userId,
      products: orderItems,
      totalAmount,
      status: "completed"
    });

    await order.save({ session });

    await session.commitTransaction();
    res.json({ message: "تمت عملية الشراء بنجاح", orderId: order._id });
  } catch (error) {
    await session.abortTransaction();
    console.error("Buy error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إتمام الطلب" });
  } finally {
    session.endSession();
  }
};
