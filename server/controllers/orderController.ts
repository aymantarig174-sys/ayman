import { Response } from "express";
import { Product, Order } from "../models.js";
import { AuthRequest } from "../middleware/auth.js";
import mongoose from "mongoose";
import { localDb, LocalOrder, LocalOrderProduct } from "../localDb.js";
import { SEED_PRODUCTS } from "../seedData.js";
import { sendInvoiceEmail } from "../utils/emailService.js";

export const buyProducts = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId || "local-user-demo";
  const { 
    items, 
    customerName, 
    customerPhone, 
    customerEmail, 
    nationalAddress, 
    shortCode, 
    isSubscription 
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "السلة فارغة" });
  }

  // 1. OFFLINE FALLBACK MODE (MongoDB is offline)
  if (mongoose.connection.readyState !== 1) {
    console.warn("MongoDB is not connected. Processing purchase through persistent local database.");
    
    let totalAmount = 0;
    const orderItems: LocalOrderProduct[] = [];

    for (const item of items) {
      // Find product details in seed data
      const seedProduct = SEED_PRODUCTS.find(p => (p as any).id === item.productId || (p as any)._id === item.productId);
      const name = seedProduct ? seedProduct.arabicName : "منتج غير معروف";
      const image = seedProduct ? seedProduct.image : "";
      const price = seedProduct ? seedProduct.price : item.price || 0;

      totalAmount += price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        name: name,
        image: image
      });
    }

    const shippingFee = isSubscription ? 0 : 30;
    const finalTotal = totalAmount + shippingFee;

    const orderId = "local-ord-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder: LocalOrder = {
      id: orderId,
      userId: userId,
      products: orderItems,
      totalAmount: finalTotal,
      status: "completed",
      createdAt: new Date().toISOString()
    };

    localDb.saveOrder(newOrder);

    // Send invoice email asynchronously (don't block the client)
    sendInvoiceEmail({
      orderId: orderId,
      customerName: customerName || "عميل متجر خطفة",
      customerPhone: customerPhone || "غير متوفر",
      customerEmail: customerEmail || "customer@example.com",
      deliveryDetails: {
        nationalAddress: nationalAddress || "غير متوفر",
        shortCode: shortCode || ""
      },
      items: orderItems.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price
      })),
      shippingFee,
      totalAmount: finalTotal,
      isSubscription: !!isSubscription
    }).catch(err => console.error("Error sending invoice email in offline mode:", err));

    return res.json({ message: "تمت عملية الشراء بنجاح وتم حفظ الطلب في الخادم", orderId: orderId });
  }

  // 2. ONLINE MODE (MongoDB is online)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const orderItemsForMongo = [];
    const orderItemsForLocal: LocalOrderProduct[] = [];

    for (const item of items) {
      // Use findOneAndUpdate with $inc for atomic stock deduction
      const product = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );

      if (!product) {
        const checkProduct = await Product.findById(item.productId);
        await session.abortTransaction();
        if (checkProduct) {
          return res.status(400).json({ error: `الكمية غير كافية للمنتج: ${checkProduct.name}` });
        }
        return res.status(400).json({ error: "المنتج غير موجود" });
      }

      totalAmount += product.price * item.quantity;
      orderItemsForMongo.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });

      orderItemsForLocal.push({
        productId: product._id.toString(),
        quantity: item.quantity,
        price: product.price,
        name: product.arabicName || product.name,
        image: product.image
      });
    }

    const shippingFee = isSubscription ? 0 : 30;
    const finalTotal = totalAmount + shippingFee;

    // Create the order in MongoDB
    const order = new Order({
      userId: userId,
      products: orderItemsForMongo,
      totalAmount: finalTotal,
      status: "completed"
    });

    await order.save({ session });
    await session.commitTransaction();

    // Also save in localDb to guarantee persistent caching on the store's server
    const newOrder: LocalOrder = {
      id: order._id.toString(),
      userId: userId,
      products: orderItemsForLocal,
      totalAmount: finalTotal,
      status: "completed",
      createdAt: order.createdAt || new Date().toISOString()
    };
    localDb.saveOrder(newOrder);

    // Send invoice email asynchronously
    sendInvoiceEmail({
      orderId: order._id.toString(),
      customerName: customerName || "عميل متجر خطفة",
      customerPhone: customerPhone || "غير متوفر",
      customerEmail: customerEmail || "customer@example.com",
      deliveryDetails: {
        nationalAddress: nationalAddress || "غير متوفر",
        shortCode: shortCode || ""
      },
      items: orderItemsForLocal.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price
      })),
      shippingFee,
      totalAmount: finalTotal,
      isSubscription: !!isSubscription
    }).catch(err => console.error("Error sending invoice email in online mode:", err));

    res.json({ message: "تمت عملية الشراء بنجاح", orderId: order._id });
  } catch (error) {
    await session.abortTransaction();
    console.error("Buy error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إتمام الطلب" });
  } finally {
    session.endSession();
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "الرجاء تسجيل الدخول أولاً لعرض طلباتك" });
    }

    // Always fetch from local database which stores all orders permanently on the server
    const orders = localDb.getOrdersByUserId(userId);
    
    // Sort by newest first
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(sortedOrders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب طلباتك" });
  }
};
