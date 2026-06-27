import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { Product } from "./server/models.js";
import { SEED_PRODUCTS } from "./server/seedData.js";
import { register, login } from "./server/controllers/authController.js";
import { getProducts } from "./server/controllers/productController.js";
import { buyProducts } from "./server/controllers/orderController.js";
import { authenticateToken } from "./server/middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Rate Limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "طلبات كثيرة جداً من هذا الحساب، يرجى المحاولة بعد 15 دقيقة" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all API routes
app.use("/api", limiter);

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is missing.");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB successfully");
    await seedDatabase();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Lazy initialize Gemini client to avoid crashes if API key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
      }
    }
  }
  return aiClient;
}

// Simple internal list of products for the chatbot to refer to
const STORE_PRODUCTS = [
  {
    name: "إضاءة النجوم والمجرات",
    price: 156,
    originalPrice: 456,
    category: "lighting",
    description: "بروجكتر إضاءة النجوم والمجرات الذكي يعطي غرفتك جو سينمائي خيالي مع تحكم بالهاتف ومزامنة صوتية."
  },
  {
    name: "الإنارة التفاعلية",
    price: 159,
    category: "lighting",
    description: "إنارة شريطية ذكية خلف التلفزيون أو شاشة الكمبيوتر تتفاعل مع الألوان المعروضة والصوت."
  },
  {
    name: "يوتيوب بريميوم - سنة كاملة",
    price: 49,
    originalPrice: 120,
    category: "subscriptions",
    description: "اشتراك يوتيوب بريميوم رسمي ومضمون على حسابك الشخصي لمدة سنة كاملة بدون إعلانات."
  },
  {
    name: "نيتفليكس Ultra HD - شهر",
    price: 25,
    originalPrice: 65,
    category: "subscriptions",
    description: "اشتراك نيتفليكس شاشة خاصة بجودة Ultra HD 4K على حساب رسمي ومفعل بالكامل."
  },
  {
    name: "ChatGPT Plus - شهر",
    price: 69,
    originalPrice: 99,
    category: "subscriptions",
    description: "اشتراك ChatGPT Plus للوصول إلى أقوى النماذج GPT-4o وتوليد الصور."
  },
  {
    name: "كانفا برو - سنة كاملة",
    price: 19,
    originalPrice: 80,
    category: "subscriptions",
    description: "اشتراك كانفا برو رسمي ومفعل على حسابك الخاص للوصول لجميع الميزات والقوالب."
  }
];

// Seed Database
async function seedDatabase() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(SEED_PRODUCTS);
    console.log("Database seeded with initial products.");
  }
}

// API Routes
app.post("/api/register", register);
app.post("/api/login", login);
app.get("/api/products", getProducts);

// Protected routes
app.post("/api/buy", authenticateToken, buyProducts);

// API Route for Gemini Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    const ai = getAiClient();

    // System prompt in Arabic to instruct the model to behave as Khatfa Store assistant
    const systemInstruction = `
أنت المساعد الذكي لمتجر "خطفة" (Khatfa Store) وهو متجر سعودي متميز يبيع منتجات الإضاءة التفاعلية الذكية والاشتراكات الرقمية الذكية (مثل يوتيوب بريميوم، نيتفليكس، ChatGPT Plus، كانفا برو).
تحدث دائماً بلهجة سعودية ترحيبية، لطيفة، وودودة جداً. استخدم كلمات ترحيبية مثل: "يا هلا والله"، "أبشر من عيوني"، "تأمر أمر".
معلومات المتجر والمنتجات المتوفرة لديك:
${JSON.stringify(STORE_PRODUCTS, null, 2)}

قواعد الردود:
1. ساعد العميل في العثور على المنتج المناسب لغرفته أو احتياجه.
2. إذا سألك عن الأسعار، اذكر السعر بالريال السعودي (ر.س) واذكر نسبة التوفير أو السعر الأصلي إذا وجد.
3. شجع العميل على الشراء وإضافة المنتجات للسلة.
4. حافظ على ردود مختصرة، سهلة القراءة، ومبهجة. لا تكتب جدران طويلة من النصوص. استخدم القوائم النقطية والرموز التعبيرية المناسبة لزيادة التفاعل والمرح!
5. لا تخترع منتجات غير موجودة في القائمة أعلاه.
`;

    if (!ai) {
      // Elegant heuristic fallbacks in Arabic if GEMINI_API_KEY is not configured
      const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let reply = "يا هلا والله بك في متجر خطفة! يسعدني جداً خدمتك اليوم. ";

      if (lastUserMessage.includes("سعر") || lastUserMessage.includes("بكم") || lastUserMessage.includes("اشتراك")) {
        reply += "عندنا عروض رهيبة حالياً! يوتيوب بريميوم سنة كاملة بـ 49 ريال بس، ونيتفليكس بـ 25 ريال لشهر كامل، وبروجكتر إضاءة النجوم والمجرات الفخم بـ 156 ريال (بدل 456 ريال). وش اللي ودك فيه عشان أساعدك تضيفه للسلة؟ 😍";
      } else if (lastUserMessage.includes("إضاءة") || lastUserMessage.includes("الإنارة") || lastUserMessage.includes("نجوم")) {
        reply += "الإنارة التفاعلية عندنا مميزة جداً! بروجكتر النجوم والمجرات يخلي غرفتك سينما واقعية بـ 156 ريال بس، والإنارة التفاعلية للتلفزيون بـ 159 ريال تتزامن مع ألعابك وصوتك. حاب تعرف تفاصيل أكثر عن أحدها؟ ✨";
      } else if (lastUserMessage.includes("ضمان") || lastUserMessage.includes("مضمون")) {
        reply += "جميع اشتراكاتنا ومنتجاتنا آمنة ومضمونة 100% ورسمية، ونفعلها لك فورياً. رضاك هو أولويتنا يا غالي! 👍";
      } else {
        reply += "أنا المساعد الذكي لمتجر خطفة، أقدر أساعدك تختار أفضل إنارات لغرفتك أو تختار اشتراكات يوتيوب ونيتفليكس وكانفا بأسعار خيالية. وش خاطرك فيه اليوم؟ 🌸";
      }

      return res.json({ text: reply });
    }

    // Format messages for @google/genai chats
    // The chats.create accepts contents. Let's use chats.create and sendMessage
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Send history except the last message, then send the last message
    // If only one message, just send it
    let lastResponse;
    if (messages.length > 1) {
      // Re-hydrate chat history
      // Keep it simple: send messages one by one to the chat or build contents
      // To keep it simple and safe from rate-limiting/token size, we can just compile the messages
      // into a single conversational prompt or send them in order.
      // Let's send them in order.
      for (let i = 0; i < messages.length - 1; i++) {
        await chat.sendMessage({ message: messages[i].text });
      }
    }
    
    const lastMsg = messages[messages.length - 1].text;
    lastResponse = await chat.sendMessage({ message: lastMsg });

    res.json({ text: lastResponse.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء التواصل مع المساعد الذكي. الرجاء المحاولة لاحقاً." });
  }
});

// Start server and mount Vite in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
