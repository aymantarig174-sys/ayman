/* ============================================
   Ø®Ø·ÙØ© Ø³ØªÙˆØ± - server.js (Pristine & Simplified)
   ============================================ */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Database from 'better-sqlite3';
import { Resend } from 'resend';
import fs from 'fs';
import crypto from 'crypto';

// Load configurations
dotenv.config();

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database('gamezoom.db');

// Ensure database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE,
    tracking_id TEXT UNIQUE,
    service_name TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    contact_email TEXT,
    order_email TEXT,
    account_password TEXT,
    epic_id TEXT,
    platform TEXT,
    mode TEXT,
    current_rank TEXT,
    target_rank TEXT,
    reward TEXT,
    total_price INTEGER,
    notes TEXT,
    payment_id TEXT UNIQUE,
    payment_status TEXT,
    status TEXT DEFAULT 'Ø¬Ø¯ÙŠØ¯',
    email_sent INTEGER DEFAULT 0,
    customer_email_sent INTEGER DEFAULT 0,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS store_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    link TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS store_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    price REAL DEFAULT 0,
    old_price REAL DEFAULT 0,
    image TEXT DEFAULT '',
    options_json TEXT DEFAULT '[]',
    external_url TEXT DEFAULT '',
    featured INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS store_banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    image TEXT DEFAULT '',
    link TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS shop_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    items_json TEXT,
    total REAL DEFAULT 0,
    status TEXT DEFAULT 'Ø¬Ø¯ÙŠØ¯',
    customer_email_sent INTEGER DEFAULT 0,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS store_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT '',
    provider TEXT DEFAULT 'otp',
    verified INTEGER DEFAULT 0,
    created_at TEXT
  );
`);

// Safe column migrations in case the SQLite database already exists
try { db.exec("ALTER TABLE orders ADD COLUMN service_name TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN payment_id TEXT UNIQUE;"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN payment_id TEXT;"); } catch (e) {}
try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN payment_status TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN email_sent INTEGER DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN customer_email_sent INTEGER DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN tracking_id TEXT UNIQUE;"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN contact_email TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN order_email TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN account_password TEXT;"); } catch (e) {}
try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_tracking_id ON orders(tracking_id);"); } catch (e) {}
try { db.exec("ALTER TABLE shop_orders ADD COLUMN payment_id TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE shop_orders ADD COLUMN payment_status TEXT DEFAULT 'pending';"); } catch (e) {}
try { db.exec("ALTER TABLE shop_orders ADD COLUMN email_sent INTEGER DEFAULT 0;"); } catch (e) {}
try { db.exec("ALTER TABLE shop_orders ADD COLUMN customer_email_sent INTEGER DEFAULT 0;"); } catch (e) {}
try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_shop_orders_payment_id ON shop_orders(payment_id);"); } catch (e) {}

const storeDefaults = {
  store_name: 'Ø®Ø·ÙØ© Ø³ØªÙˆØ±',
  store_tagline: 'Ø¹Ø§Ù„Ù… Ø§Ù„Ø£Ù„Ø¹Ø§Ø¨ ÙˆØ§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø±Ù‚Ù…ÙŠØ©',
  logo: 'assets/header.png',
  whatsapp: '966548923180',
  telegram: 'https://t.me/I5TFAH',
  business_platform_url: 'https://eauthenticate.saudibusiness.gov.sa/certificate-details/0000296352',
  freelance_url: '#',
  announcement: 'ØªØ³Ù„ÙŠÙ… Ø±Ù‚Ù…ÙŠ Ø³Ø±ÙŠØ¹ ÙˆØ¯Ø¹Ù… Ù…ØªÙˆØ§ØµÙ„',
  hero_title: 'ÙƒÙ„ Ù…Ø§ ÙŠØ­ØªØ§Ø¬Ù‡ Ø§Ù„Ù‚ÙŠÙ…Ø± ÙÙŠ Ù…ÙƒØ§Ù† ÙˆØ§Ø­Ø¯',
  hero_subtitle: 'Ù…Ù†ØªØ¬Ø§Øª ÙˆØ®Ø¯Ù…Ø§Øª Ø±Ù‚Ù…ÙŠØ© Ù…Ø±ØªØ¨Ø© Ø­Ø³Ø¨ Ù„Ø¹Ø¨ØªÙƒ Ø§Ù„Ù…ÙØ¶Ù„Ø©'
};

const insertSetting = db.prepare('INSERT OR IGNORE INTO store_settings (key, value) VALUES (?, ?)');
Object.entries(storeDefaults).forEach(([key, value]) => insertSetting.run(key, value));

const categoryCount = db.prepare('SELECT COUNT(*) AS count FROM store_categories').get().count;
if (!categoryCount) {
  const insertCategory = db.prepare(`
    INSERT INTO store_categories (name, slug, description, image, link, sort_order, active)
    VALUES (?, ?, ?, '', ?, ?, 1)
  `);
  insertCategory.run('Grand', 'grand', 'Ø®Ø¯Ù…Ø§Øª ÙˆÙ…Ù†ØªØ¬Ø§Øª Ø¹Ø§Ù„Ù… Grand', 'category.html?category=grand', 1);
  insertCategory.run('FC 27', 'fc-27', 'Ù…Ù†ØªØ¬Ø§Øª ÙˆØ®Ø¯Ù…Ø§Øª FC 27', 'category.html?category=fc-27', 2);
  insertCategory.run('Rocket League', 'rocket-league', 'Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ ÙˆØ§Ù„Ø³ÙŠØ²ÙˆÙ† Ø±ÙŠÙˆØ§Ø±Ø¯', 'product.html', 3);
  insertCategory.run('Ø§Ø´ØªØ±Ø§ÙƒØ§Øª', 'subscriptions', 'Ø§Ø´ØªØ±Ø§ÙƒØ§Øª Ø±Ù‚Ù…ÙŠØ© Ù…Ø®ØªØ§Ø±Ø©', 'category.html?category=subscriptions', 4);
}

const productCount = db.prepare('SELECT COUNT(*) AS count FROM store_products').get().count;
if (!productCount) {
  const insertProduct = db.prepare(`
    INSERT INTO store_products
      (category_slug, name, slug, description, price, old_price, image, options_json, external_url, featured, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, '', ?, ?, ?, 1, ?)
  `);
  const now = new Date().toISOString();
  insertProduct.run('grand', 'Ø®Ø¯Ù…Ø© Grand Ø§Ù„Ø±Ù‚Ù…ÙŠØ©', 'grand-digital-service', 'Ù…Ù†ØªØ¬ ØªØ¬Ø±ÙŠØ¨ÙŠ Ù‚Ø§Ø¨Ù„ Ù„Ù„ØªØ¹Ø¯ÙŠÙ„ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©.', 49, 0, '["Ø§Ù„Ø®ÙŠØ§Ø± Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ"]', '', 1, now);
  insertProduct.run('fc-27', 'Ø®Ø¯Ù…Ø© FC 27 Ø§Ù„Ø±Ù‚Ù…ÙŠØ©', 'fc-27-digital-service', 'Ù…Ù†ØªØ¬ ØªØ¬Ø±ÙŠØ¨ÙŠ Ù‚Ø§Ø¨Ù„ Ù„Ù„ØªØ¹Ø¯ÙŠÙ„ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©.', 39, 0, '["Ø§Ù„Ø®ÙŠØ§Ø± Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ"]', '', 1, now);
  insertProduct.run('rocket-league', 'Ø±ÙØ¹ Ø±Ø§Ù†Ùƒ Rocket League', 'rocket-league-rank', 'Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ø­Ø§Ù„ÙŠ Ø§Ù„Ø®Ø§Øµ Ø¨Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ.', 0, 0, '[]', 'product.html', 1, now);
  insertProduct.run('subscriptions', '\u064a\u0648\u062a\u064a\u0648\u0628 \u0628\u0631\u064a\u0645\u064a\u0648\u0645', 'digital-subscription', '\u0627\u0634\u062a\u0631\u0627\u0643 \u064a\u0648\u062a\u064a\u0648\u0628 \u0628\u0631\u064a\u0645\u064a\u0648\u0645 \u0628\u062e\u064a\u0627\u0631\u0627\u062a \u0634\u0647\u0631\u064a\u0629 \u0645\u062a\u0639\u062f\u062f\u0629.', 0, 0, '["\u0634\u0647\u0631","3 \u0623\u0634\u0647\u0631","6 \u0623\u0634\u0647\u0631","\u0633\u0646\u0629"]', '', 1, now);
}

const bannerCount = db.prepare('SELECT COUNT(*) AS count FROM store_banners').get().count;
if (!bannerCount) {
  const insertBanner = db.prepare(`
    INSERT INTO store_banners (title, subtitle, image, link, sort_order, active)
    VALUES (?, ?, '', ?, ?, 1)
  `);
  insertBanner.run('Ø¹Ø§Ù„Ù… Grand', 'Ø§Ø¶ØºØ· Ù„Ø§Ø³ØªØ¹Ø±Ø§Ø¶ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù‚Ø³Ù…', 'category.html?category=grand', 1);
  insertBanner.run('FC 27', 'ÙƒÙ„ Ø®Ø¯Ù…Ø§Øª ÙˆÙ…Ù†ØªØ¬Ø§Øª FC 27', 'category.html?category=fc-27', 2);
  insertBanner.run('Rocket League', 'Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ ÙˆØ§Ù„Ø³ÙŠØ²ÙˆÙ† Ø±ÙŠÙˆØ§Ø±Ø¯', 'product.html', 3);
}

// Apply the built-in paired dark/light gaming artwork when an image has not
// already been customized from the catalog dashboard.
const defaultStoreArtwork = {
  grand: 'assets/store-banners/grand-dark.png',
  'fc-27': 'assets/store-banners/fc27-dark.png',
  'rocket-league': 'assets/store-banners/rocket-league-dark.png',
  subscriptions: 'assets/store-banners/subscriptions-dark.png'
};

const setDefaultCategoryImage = db.prepare(`
  UPDATE store_categories SET image = ?
  WHERE slug = ? AND TRIM(COALESCE(image, '')) = ''
`);
const setDefaultProductImage = db.prepare(`
  UPDATE store_products SET image = ?
  WHERE category_slug = ? AND TRIM(COALESCE(image, '')) = ''
`);

Object.entries(defaultStoreArtwork).forEach(([slug, image]) => {
  setDefaultCategoryImage.run(image, slug);
  setDefaultProductImage.run(image, slug);
});

const setDefaultBannerImage = db.prepare(`
  UPDATE store_banners SET image = ?
  WHERE sort_order = ? AND TRIM(COALESCE(image, '')) = ''
`);
setDefaultBannerImage.run(defaultStoreArtwork.grand, 1);
setDefaultBannerImage.run(defaultStoreArtwork['fc-27'], 2);
setDefaultBannerImage.run(defaultStoreArtwork['rocket-league'], 3);
db.prepare(`
  UPDATE store_products
  SET name = ?, description = ?, price = 0, old_price = 0, options_json = ?
  WHERE slug = 'digital-subscription'
`).run('\u064a\u0648\u062a\u064a\u0648\u0628 \u0628\u0631\u064a\u0645\u064a\u0648\u0645', '\u0627\u0634\u062a\u0631\u0627\u0643 \u064a\u0648\u062a\u064a\u0648\u0628 \u0628\u0631\u064a\u0645\u064a\u0648\u0645 \u0628\u062e\u064a\u0627\u0631\u0627\u062a \u0634\u0647\u0631\u064a\u0629 \u0645\u062a\u0639\u062f\u062f\u0629.', '["\u0634\u0647\u0631","3 \u0623\u0634\u0647\u0631","6 \u0623\u0634\u0647\u0631","\u0633\u0646\u0629"]');

// ==========================================
// Security & Protection Layers
// ==========================================

// 1. Helmet protection
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// 2. Strict CORS setup
const allowedOrigins = (process.env.ALLOWED_ORIGIN || 'https://gamezoom.win,https://gamezooom100.pages.dev')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};
app.use(cors(corsOptions));

// 3. Prevent access to configuration / database files
app.get('/.env', (req, res) => res.status(403).json({ error: 'ØºÙŠØ± Ù…ØµØ±Ø­ Ø¨Ø¯Ø®ÙˆÙ„ Ù‡Ø°Ø§ Ø§Ù„Ù…Ù„Ù.' }));
app.get('/.env.example', (req, res) => res.status(403).json({ error: 'ØºÙŠØ± Ù…ØµØ±Ø­ Ø¨Ø¯Ø®ÙˆÙ„ Ù‡Ø°Ø§ Ø§Ù„Ù…Ù„Ù.' }));
app.get('/gamezoom.db', (req, res) => res.status(403).json({ error: 'ØºÙŠØ± Ù…ØµØ±Ø­ Ø¨Ø¯Ø®ÙˆÙ„ Ù‡Ø°Ø§ Ø§Ù„Ù…Ù„Ù.' }));

// 4. Rate Limiting Configurations
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 orders inside 15 mins
  message: { error: 'Ù„Ù‚Ø¯ Ù‚Ù…Øª Ø¨Ø¥Ø±Ø³Ø§Ù„ Ø¹Ø¯Ø¯ ÙƒØ¨ÙŠØ± Ù…Ù† Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø¨Ø´ÙƒÙ„ Ù…ØªÙƒØ±Ø±ØŒ ÙŠØ±Ø¬Ù‰ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø± 15 Ø¯Ù‚ÙŠÙ‚Ø© ÙˆØªÙƒØ±Ø§Ø± Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©.' }
});

const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 300, // Limit IP to 300 requests
  message: { error: 'Ù„Ù‚Ø¯ ØªØ®Ø·ÙŠØª Ø§Ù„Ø­Ø¯ Ø§Ù„Ù…Ø³Ù…ÙˆØ­ Ù…Ù† Ø§Ù„Ø·Ù„Ø¨Ø§ØªØŒ ÙŠØ±Ø¬Ù‰ Ø§Ù„Ù‡Ø¯ÙˆØ¡ ÙˆØ§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù„Ø§Ø­Ù‚Ø§Ù‹.' }
});

// Apply general rate limits
app.use('/api/', generalLimiter);

// Trust proxy
app.set('trust proxy', 1);

// Body Parsers
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Endpoint to save base64 logo received from client to assets/logo.png
app.post('/api/save-logo', (req, res) => {
  try {
    const { image } = req.body;
    if (!image || !image.startsWith('data:image/png;base64,')) {
      return res.status(400).json({ error: 'ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ø´Ø¹Ø§Ø± ØºÙŠØ± ØµØ§Ù„Ø­.' });
    }
    const base64Data = image.replace(/^data:image\/png;base64,/, '');

    // Ensure assets directory exists
    const assetsDir = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(assetsDir, 'logo.png'), base64Data, 'base64');
    console.log('âœ… assets/logo.png has been saved successfully!');
    res.json({ success: true, message: 'ØªÙ… Ø­ÙØ¸ Ø§Ù„Ø´Ø¹Ø§Ø± ÙƒÙ€ assets/logo.png Ø¨Ù†Ø¬Ø§Ø­.' });
  } catch (err) {
    console.error('Error saving logo:', err);
    res.status(500).json({ error: 'ÙØ´Ù„ Ø­ÙØ¸ Ø§Ù„Ø´Ø¹Ø§Ø±.' });
  }
});

// Helper Functions
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function normalizeEmail(value) {
  const email = sanitize(value || '');
  return isEmailAddress(email) ? email : '';
}

function resolveCustomerEmail(order = {}) {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || 'support@khatafa.store');
  const candidates = [
    order.customer_email,
    order.contact_email,
    order.email
  ].map(normalizeEmail).filter(Boolean);

  return candidates.find(email => email.toLowerCase() !== adminEmail.toLowerCase()) || '';
}

function generateTrackingId() {
    const currentYear = new Date().getFullYear();
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `GZ-${currentYear}-${randomPart}`;
}

function generateOrderNumber(prefix = 'GZ') {
  const currentYear = new Date().getFullYear();
  const latestRow = db.prepare('SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY id DESC LIMIT 1').get(`${prefix}-${currentYear}-%`);
  let currentIncr = 1;
  if (latestRow) {
    const parsedNum = parseInt(String(latestRow.order_number).split('-')[2], 10);
    if (!Number.isNaN(parsedNum)) currentIncr = parsedNum + 1;
  }
  return `${prefix}-${currentYear}-${String(currentIncr).padStart(4, '0')}`;
}

function getGeideaConfig() {
  const region = String(process.env.GEIDEA_ENV || 'ksa').toLowerCase();
  const endpoints = {
    ksa: {
      apiBase: 'https://api.ksamerchant.geidea.net',
      checkoutScript: 'https://www.ksamerchant.geidea.net/hpp/geideaCheckout.min.js'
    },
    uae: {
      apiBase: 'https://api.merchant.geidea.ae',
      checkoutScript: 'https://www.merchant.geidea.ae/hpp/geideaCheckout.min.js'
    },
    egypt: {
      apiBase: 'https://api.merchant.geidea.net',
      checkoutScript: 'https://www.merchant.geidea.net/hpp/geideaCheckout.min.js'
    }
  };
  return {
    ...(endpoints[region] || endpoints.ksa),
    publicKey: process.env.GEIDEA_PUBLIC_KEY || '9d0c21bf-4c75-46d7-9aed-07edd6cbc78f',
    apiPassword: process.env.GEIDEA_API_PASSWORD || '48624c52-2391-4dba-bd6e-45de491050b3',
    currency: process.env.GEIDEA_CURRENCY || 'SAR'
  };
}

function publicSiteUrl(req, requestedReturnUrl = '') {
  const candidate = sanitize(requestedReturnUrl || '');
  try {
    const parsed = new URL(candidate);
    parsed.hash = '';
    const normalized = parsed.toString();
    if (/^https:\/\/(gamezoom\.win|gamezooom100\.pages\.dev)\//i.test(normalized)) return normalized;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(normalized)) return normalized;
  } catch {}
  return process.env.PUBLIC_SITE_URL || process.env.BASE_URL || 'https://gamezoom.win';
}

function backendUrl(req) {
  const configured = process.env.BACKEND_URL || process.env.API_BASE_URL || '';
  if (configured) return configured.replace(/\/+$/, '');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  return `${protocol}://${req.get('host')}`;
}

function geideaSignature({ publicKey, apiPassword, amount, currency, merchantReferenceId, timestamp }) {
  const amountText = Number(amount).toFixed(2);
  const payload = `${publicKey}${amountText}${currency}${merchantReferenceId}${timestamp}`;
  return crypto.createHmac('sha256', apiPassword).update(payload).digest('base64');
}

function geideaOrderDescription(orderType, orderNumber) {
  const safeType = String(orderType || 'ORDER').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const safeOrderNumber = String(orderNumber || '').replace(/[^A-Z0-9_-]/g, '');
  return [safeType, safeOrderNumber].filter(Boolean).join('-').slice(0, 64) || 'GAMEZOOM-ORDER';
}

async function createGeideaSession(req, { amount, merchantReferenceId, returnUrl, customer = {}, order = {} }) {
  const config = getGeideaConfig();
  if (!config.publicKey || !config.apiPassword) {
    const error = new Error('Geidea credentials are not configured');
    error.statusCode = 500;
    throw error;
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    const error = new Error('Invalid checkout amount');
    error.statusCode = 400;
    throw error;
  }

  const timestamp = new Date().toISOString();
  const currency = config.currency;
  const body = {
    amount: Number(numericAmount.toFixed(2)),
    currency,
    timestamp,
    merchantReferenceId,
    signature: geideaSignature({
      publicKey: config.publicKey,
      apiPassword: config.apiPassword,
      amount: numericAmount,
      currency,
      merchantReferenceId,
      timestamp
    }),
    callbackUrl: `${backendUrl(req)}/api/geidea/callback`,
    returnUrl: publicSiteUrl(req, returnUrl),
    language: 'ar',
    paymentOperation: 'Pay',
    customer,
    order
  };

  const auth = Buffer.from(`${config.publicKey}:${config.apiPassword}`).toString('base64');
  const response = await fetch(`${config.apiBase}/payment-intent/api/v2/direct/session`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.responseCode !== '000') {
    console.error('Geidea create session error:', result);
    const error = new Error(result.responseMessage || result.detailedResponseMessage || result.title || result.message || 'Unable to create Geidea checkout session');
    error.statusCode = response.status || 400;
    throw error;
  }

  return {
    sessionId: result.session?.id || result.sessionId || result.id,
    checkoutScript: config.checkoutScript,
    raw: result
  };
}

function isGeideaSuccess(payload = {}) {
  const code = payload.responseCode || payload.detailedResponseCode || payload.order?.responseCode;
  const status = String(payload.status || payload.order?.status || payload.paymentStatus || '').toLowerCase();
  return code === '000' || ['paid', 'success', 'successful', 'captured'].includes(status);
}

function shouldSendPaidEmails(order) {
  if (!order) return false;
  return Number(order.email_sent || 0) === 0 || Number(order.customer_email_sent || 0) === 0;
}

async function markGeideaPayment(payload = {}) {
  const sessionId = sanitize(payload.sessionId || payload.session?.id || payload.order?.sessionId || '');
  const orderNumber = sanitize(payload.orderNumber || payload.merchantReferenceId || payload.merchantReference || payload.order?.merchantReferenceId || '');
  const paymentStatus = isGeideaSuccess(payload) ? 'paid' : sanitize(payload.status || payload.paymentStatus || 'pending');

  let order = null;
  if (sessionId) order = db.prepare('SELECT * FROM orders WHERE payment_id = ?').get(sessionId);
  if (!order && orderNumber) order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber);

  if (order) {
    db.prepare('UPDATE orders SET payment_status = ? WHERE id = ?').run(paymentStatus, order.id);
    if (paymentStatus === 'paid' && shouldSendPaidEmails(order)) {
      const latest = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
      void sendPaidOrderEmails(latest, { table: 'orders', type: 'rocket' }).catch(err => {
        console.error('Geidea paid email dispatch error:', err);
      });
    }
    return { type: 'rocket', orderNumber: order.order_number, trackingId: order.tracking_id, paid: paymentStatus === 'paid' };
  }

  let shopOrder = null;
  if (sessionId) shopOrder = db.prepare('SELECT * FROM shop_orders WHERE payment_id = ?').get(sessionId);
  if (!shopOrder && orderNumber) shopOrder = db.prepare('SELECT * FROM shop_orders WHERE order_number = ?').get(orderNumber);
  if (shopOrder) {
    db.prepare('UPDATE shop_orders SET payment_status = ?, status = ? WHERE id = ?').run(paymentStatus, paymentStatus === 'paid' ? 'paid' : shopOrder.status, shopOrder.id);
    if (paymentStatus === 'paid' && shouldSendPaidEmails(shopOrder)) {
      const latestShopOrder = db.prepare('SELECT * FROM shop_orders WHERE id = ?').get(shopOrder.id);
      void sendPaidOrderEmails(latestShopOrder, { table: 'shop_orders', type: 'shop' }).catch(err => {
        console.error('Geidea shop paid email dispatch error:', err);
      });
    }
    return { type: 'shop', orderNumber: shopOrder.order_number, paid: paymentStatus === 'paid' };
  }

  return { type: 'unknown', paid: paymentStatus === 'paid' };
}

function parseShopItems(order) {
  try { return JSON.parse(order.items_json || '[]'); } catch { return []; }
}

function shopOrderDetails(order) {
  const items = parseShopItems(order);
  const firstDelivery = items.find(item => item.delivery)?.delivery || {};
  const mapLink = firstDelivery.maps_url || (firstDelivery.lat && firstDelivery.lng ? `https://www.google.com/maps?q=${encodeURIComponent(`${firstDelivery.lat},${firstDelivery.lng}`)}` : '');
  const lines = items.map(item => {
    const qty = Number(item.quantity || 1);
    const itemTotal = Number(item.price || 0) * qty;
    return `- ${item.name || 'Ù…Ù†ØªØ¬'} | ${item.option || 'Ø¨Ø¯ÙˆÙ† Ø®ÙŠØ§Ø±'} | Ø§Ù„ÙƒÙ…ÙŠØ© ${qty} | ${itemTotal} Ø±ÙŠØ§Ù„`;
  });
  return {
    items,
    mapLink,
    text: [
      `Ø±Ù‚Ù… Ø§Ù„Ø·Ù„Ø¨: ${order.order_number || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}`,
      `Ø§Ø³Ù… Ø§Ù„Ø¹Ù…ÙŠÙ„: ${order.customer_name || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}`,
      `Ø±Ù‚Ù… Ø§Ù„Ø¬ÙˆØ§Ù„: ${order.customer_phone || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}`,
      `Ø§Ù„Ø¨Ø±ÙŠØ¯: ${order.customer_email || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}`,
      `Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¯ÙÙˆØ¹: ${order.total || 0} Ø±ÙŠØ§Ù„`,
      `Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ù…Ø®ØªØµØ±: ${firstDelivery.short_address || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}`,
      `Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„ØªÙˆØµÙŠÙ„: ${firstDelivery.address_notes || 'Ù„Ø§ ØªÙˆØ¬Ø¯'}`,
      `Ø±Ø§Ø¨Ø· Ø§Ù„Ù…ÙˆÙ‚Ø¹: ${mapLink || 'Ù„Ù… ÙŠØ­Ø¯Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹'}`,
      'Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª:',
      ...(lines.length ? lines : ['- Ù„Ø§ ØªÙˆØ¬Ø¯ ØªÙØ§ØµÙŠÙ„ Ù…Ù†ØªØ¬Ø§Øª'])
    ].join('\n')
  };
}

function adminWhatsAppUrlForShopOrder(order) {
  const details = shopOrderDetails(order);
  const message = `Ø·Ù„Ø¨ Ø¬Ø¯ÙŠØ¯ Ù…Ù† Ø®Ø·ÙØ© Ø³ØªÙˆØ±\n${details.text}`;
  return `https://wa.me/966548923180?text=${encodeURIComponent(message)}`;
}

function isHttpUrl(value) {
  return /^https?:\/\/\S+$/i.test(String(value || '').trim());
}

function getOrderMapLink(order = {}) {
  const directCandidates = [
    order.maps_url,
    order.map_url,
    order.location_url,
    order.google_maps_url
  ].map(value => sanitize(value || '')).filter(isHttpUrl);
  if (directCandidates.length) return directCandidates[0];

  const items = parseShopItems(order);
  const delivery = items.find(item => item?.delivery)?.delivery || {};
  const deliveryCandidates = [
    delivery.maps_url,
    delivery.map_url,
    delivery.location_url,
    delivery.google_maps_url
  ].map(value => sanitize(value || '')).filter(isHttpUrl);
  if (deliveryCandidates.length) return deliveryCandidates[0];

  const lat = sanitize(order.lat || delivery.lat || '');
  const lng = sanitize(order.lng || delivery.lng || '');
  if (lat && lng) return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;

  return '';
}

function blackEmailShell({ title, subtitle, rows = [], linkLabel = '', linkUrl = '', footer = '' }) {
  const rowHtml = rows.map(row => `
      <span style="color:#d8c7ff;font-weight:700;min-width:110px">${escapeHtml(row.label)}</span>
      <span style="color:#f8fafc;word-break:break-word;text-align:left;flex:1">${escapeHtml(row.value)}</span>
    </div>
  `).join('');

  const linkHtml = linkUrl ? `
      <span style="color:#d8c7ff;font-weight:700;min-width:110px">${escapeHtml(linkLabel || 'Ø§Ù„Ù…ÙˆÙ‚Ø¹')}</span>
      <a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener" style="color:#8ab4ff;word-break:break-all;text-decoration:underline;text-underline-offset:3px;flex:1;text-align:left">${escapeHtml(linkUrl)}</a>
    </div>
  ` : '';

  const textLines = [
    title,
    subtitle,
    '',
    ...rows.map(row => `${row.label}: ${row.value}`),
    ...(linkUrl ? [`${linkLabel || 'Ø§Ù„Ù…ÙˆÙ‚Ø¹'}: ${linkUrl}`] : []),
    footer ? ['', footer] : []
  ].flat().filter(Boolean);

  return {
    text: textLines.join('\n'),
    html: `
      <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#050505;color:#f8fafc;padding:24px;border-radius:18px;line-height:1.7;max-width:720px;margin:auto;border:1px solid #2c2440">
        <div style="text-align:center;margin-bottom:18px">
          <h2 style="margin:0;color:#c4b5fd;font-size:28px;font-weight:800">${escapeHtml(title)}</h2>
          <p style="margin:8px 0 0;color:#a1a1aa;font-size:15px">${escapeHtml(subtitle)}</p>
        </div>
        <div style="height:1px;background:linear-gradient(90deg,transparent,#3f2d69,transparent);margin:18px 0 8px"></div>
        ${rowHtml}
        ${linkHtml}
        ${footer ? `<p style="margin:18px 0 0;color:#94a3b8;font-size:13px;text-align:center">${escapeHtml(footer)}</p>` : ''}
      </div>
    `
  };
}

async function sendShopOrderNotification(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'support@khatafa.store';
  const fromEmail = process.env.FROM_EMAIL || 'no-reply@khatafa.store';

  if (!apiKey) {
    const err = new Error('RESEND_API_KEY is missing');
    console.error('❌', err.message);
    throw err;
  }

  const items = parseShopItems(order);
  const mapLink = getOrderMapLink(order);
  const shortAddress =
    items.find(item => item?.delivery?.short_address)?.delivery?.short_address ||
    order.short_address ||
    'غير متوفر';
  const deliveryNotes =
    items.find(item => item?.delivery?.address_notes)?.delivery?.address_notes ||
    order.address_notes ||
    'لا توجد';
  const itemSummary = items.length
    ? items.map(item => {
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const lineTotal = price * qty;
        return `${item.name || 'منتج'} | ${item.option || 'بدون خيار'} | الكمية ${qty} | ${lineTotal} ريال`;
      }).join('\n')
    : 'لا توجد تفاصيل منتجات';

  const email = blackEmailShell({
    title: 'طلب جديد | خطفة ستور',
    subtitle: 'بيانات الطلب المختصرة',
    rows: [
      { label: 'اسم العميل', value: order.customer_name || 'غير متوفر' },
      { label: 'رقم الجوال', value: order.customer_phone || 'غير متوفر' },
      { label: 'البريد الإلكتروني', value: resolveCustomerEmail(order) || order.customer_email || 'غير متوفر' },
      { label: 'العنوان المختصر', value: shortAddress },
      { label: 'ملاحظات التوصيل', value: deliveryNotes },
      { label: 'المنتجات', value: itemSummary },
      { label: 'الإجمالي', value: `${Number(order.total || 0)} ريال` }
    ],
    linkLabel: 'الموقع',
    linkUrl: mapLink,
    footer: 'هذا البريد يحتوي فقط على بيانات العميل المدخلة في الموقع.'
  });

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: 'طلب جديد | خطفة ستور',
    text: email.text,
    html: email.html
  });

  if (error) throw error;
  return data;
}

// Resend Email Notification System (Admin alert)
async function sendAdminEmailNotification(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'support@khatafa.store';
  const fromEmail = process.env.FROM_EMAIL || 'no-reply@khatafa.store';

  if (!apiKey) {
    const err = new Error('RESEND_API_KEY is missing');
    console.error('❌', err.message);
    throw err;
  }

  const mapLink = getOrderMapLink(order);
  const orderEmail = order.order_email || order.account_email || order.email || order.customer_email || 'غير متوفر';
  const email = blackEmailShell({
    title: 'طلب جديد | خطفة ستور',
    subtitle: 'بيانات العميل المختصرة',
    rows: [
      { label: 'اسم العميل', value: order.customer_name || 'غير متوفر' },
      { label: 'رقم الجوال', value: order.customer_phone || 'غير متوفر' },
      { label: 'البريد الإلكتروني', value: resolveCustomerEmail(order) || order.customer_email || 'غير متوفر' },
      { label: 'بريد الحساب', value: orderEmail },
      { label: 'كلمة المرور', value: order.account_password || 'غير متوفرة' },
      { label: 'Epic ID', value: order.epic_id || 'غير متوفر' },
      { label: 'المنصة', value: order.platform || 'غير متوفر' },
      { label: 'الطور', value: order.mode || 'غير متوفر' },
      { label: 'الرانك الحالي', value: order.current_rank || 'غير متوفر' },
      { label: 'الرانك المطلوب', value: order.target_rank || 'غير متوفر' },
      { label: 'الريوارد', value: order.reward || 'بدون' },
      { label: 'الملاحظات', value: order.notes || 'بلا ملاحظات' },
      { label: 'الإجمالي', value: `${Number(order.total_price || 0)} ريال سعودي` }
    ],
    linkLabel: 'الموقع',
    linkUrl: mapLink,
    footer: 'هذا البريد يحتوي فقط على البيانات التي أدخلها العميل في الموقع.'
  });

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: 'طلب جديد | خطفة ستور',
    text: email.text,
    html: email.html
  });

  if (error) throw error;
  return data;
}
function buildRocketCustomerReceipt(order) {
  const orderNum = order.order_number || 'N/A';
  const trackingId = order.tracking_id || 'N/A';
  const customerName = order.customer_name || 'Customer';
  const platform = order.platform || 'N/A';
  const mode = order.mode || 'N/A';
  const currentRank = order.current_rank || 'N/A';
  const targetRank = order.target_rank || 'N/A';
  const reward = order.reward || 'N/A';
  const totalPrice = Number(order.total_price || 0);

  return {
    subject: `Ø®Ø·ÙØ© Ø³ØªÙˆØ± - ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨ ${orderNum}`,
    text: [
      `Hello ${customerName},`,
      '',
      'Thank you for your payment. Your order has been confirmed by Ø®Ø·ÙØ© Ø³ØªÙˆØ±.',
      '',
      `Order number: ${orderNum}`,
      `Tracking ID: ${trackingId}`,
      `Name: ${customerName}`,
      `Phone: ${order.customer_phone || 'N/A'}`,
      `Email: ${resolveCustomerEmail(order) || 'N/A'}`,
      `Platform: ${platform}`,
      `Mode: ${mode}`,
      `Current rank: ${currentRank}`,
      `Target rank: ${targetRank}`,
      `Reward: ${reward}`,
      `Total paid: ${totalPrice} SAR`,
      '',
      'If you need help, reply to this email and our support team will assist you.'
    ].join('\n'),
    html: `
      <div dir="ltr" style="font-family:Arial,sans-serif;background:#0b0b0f;color:#f8fafc;padding:24px;border-radius:16px;line-height:1.7">
        <h2 style="margin:0 0 12px;color:#ffffff">Ø®Ø·ÙØ© Ø³ØªÙˆØ± - ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨</h2>
        <p style="margin:0 0 16px;color:#cbd5e1">Thank you for your payment. Your order has been confirmed by Ø®Ø·ÙØ© Ø³ØªÙˆØ±.</p>
        <div style="background:#111827;padding:16px;border-radius:12px;border:1px solid #243041">
          <p style="margin:0 0 8px"><strong>Order number:</strong> ${escapeHtml(orderNum)}</p>
          <p style="margin:0 0 8px"><strong>Tracking ID:</strong> ${escapeHtml(trackingId)}</p>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(customerName)}</p>
          <p style="margin:0 0 8px"><strong>Phone:</strong> ${escapeHtml(order.customer_phone || 'N/A')}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(resolveCustomerEmail(order) || 'N/A')}</p>
          <p style="margin:0 0 8px"><strong>Platform:</strong> ${escapeHtml(platform)}</p>
          <p style="margin:0 0 8px"><strong>Mode:</strong> ${escapeHtml(mode)}</p>
          <p style="margin:0 0 8px"><strong>Current rank:</strong> ${escapeHtml(currentRank)}</p>
          <p style="margin:0 0 8px"><strong>Target rank:</strong> ${escapeHtml(targetRank)}</p>
          <p style="margin:0 0 8px"><strong>Reward:</strong> ${escapeHtml(reward)}</p>
          <p style="margin:0"><strong>Total paid:</strong> ${escapeHtml(`${totalPrice} SAR`)}</p>
        </div>
        <p style="margin:16px 0 0;color:#94a3b8;font-size:13px">If you need help, reply to this email and our support team will assist you.</p>
      </div>
    `
  };
}

function buildShopCustomerReceipt(order) {
  const orderNum = order.order_number || 'N/A';
  const customerName = order.customer_name || 'Customer';
  const totalPrice = Number(order.total || 0);
  const items = parseShopItems(order);
  const itemLines = items.map(item => {
    const qty = Number(item.quantity || 1);
    const itemTotal = Number(item.price || 0) * qty;
    return `- ${item.name || 'Item'} | ${item.option || 'No option'} | Qty ${qty} | ${itemTotal} SAR`;
  });

  return {
    subject: `Ø®Ø·ÙØ© Ø³ØªÙˆØ± - ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø·Ù„Ø¨ Ø§Ù„Ù…ØªØ¬Ø± ${orderNum}`,
    text: [
      `Hello ${customerName},`,
      '',
      'Thank you for your payment. Your store order has been confirmed by Ø®Ø·ÙØ© Ø³ØªÙˆØ±.',
      '',
      `Order number: ${orderNum}`,
      `Name: ${customerName}`,
      `Phone: ${order.customer_phone || 'N/A'}`,
      `Email: ${resolveCustomerEmail(order) || 'N/A'}`,
      `Total paid: ${totalPrice} SAR`,
      '',
      'Items:',
      ...(itemLines.length ? itemLines : ['- No item details available']),
      '',
      'If you need help, reply to this email and our support team will assist you.'
    ].join('\n'),
    html: `
      <div dir="ltr" style="font-family:Arial,sans-serif;background:#0b0b0f;color:#f8fafc;padding:24px;border-radius:16px;line-height:1.7">
        <h2 style="margin:0 0 12px;color:#ffffff">Ø®Ø·ÙØ© Ø³ØªÙˆØ± - ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø·Ù„Ø¨ Ø§Ù„Ù…ØªØ¬Ø±</h2>
        <p style="margin:0 0 16px;color:#cbd5e1">Thank you for your payment. Your store order has been confirmed by Ø®Ø·ÙØ© Ø³ØªÙˆØ±.</p>
        <div style="background:#111827;padding:16px;border-radius:12px;border:1px solid #243041">
          <p style="margin:0 0 8px"><strong>Order number:</strong> ${escapeHtml(orderNum)}</p>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(customerName)}</p>
          <p style="margin:0 0 8px"><strong>Phone:</strong> ${escapeHtml(order.customer_phone || 'N/A')}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(resolveCustomerEmail(order) || 'N/A')}</p>
          <p style="margin:0 0 8px"><strong>Total paid:</strong> ${escapeHtml(`${totalPrice} SAR`)}</p>
          <div style="margin-top:12px">
            <strong>Items:</strong>
            <div style="margin-top:8px;color:#cbd5e1;white-space:pre-wrap">${escapeHtml(itemLines.length ? itemLines.join('\n') : 'No item details available')}</div>
          </div>
        </div>
        <p style="margin:16px 0 0;color:#94a3b8;font-size:13px">If you need help, reply to this email and our support team will assist you.</p>
      </div>
    `
  };
}

async function sendCustomerReceiptEmail(order, type = 'rocket') {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'no-reply@khatafa.store';
  const customerEmail = resolveCustomerEmail(order);

  if (!apiKey) {
    const err = new Error('RESEND_API_KEY is missing');
    console.error('âŒ', err.message);
    throw err;
  }

  if (!customerEmail) {
    console.log('ðŸ“­ Customer email missing, skipping receipt email.');
    return null;
  }

  const payload = type === 'shop' ? buildShopCustomerReceipt(order) : buildRocketCustomerReceipt(order);
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: customerEmail,
    subject: payload.subject,
    text: payload.text,
    html: payload.html
  });

  if (error) throw error;
  return data;
}

async function sendPaidOrderEmails(order, { table = 'orders', type = 'rocket' } = {}) {
  if (!order) return;

  const identifier = order.id || order.payment_id;
  const identifierColumn = order.id ? 'id' : 'payment_id';
  if (!identifier) return;

  const tasks = [];
  if (Number(order.email_sent || 0) === 0) {
    tasks.push(
      sendAdminEmailNotification(order)
        .then(() => {
          db.prepare(`UPDATE ${table} SET email_sent = 1 WHERE ${identifierColumn} = ?`).run(identifier);
        })
        .catch(err => {
          console.error('âŒ Admin receipt email failed:', err);
        })
    );
  }

  if (Number(order.customer_email_sent || 0) === 0 && resolveCustomerEmail(order)) {
    tasks.push(
      sendCustomerReceiptEmail(order, type)
        .then(() => {
          db.prepare(`UPDATE ${table} SET customer_email_sent = 1 WHERE ${identifierColumn} = ?`).run(identifier);
        })
        .catch(err => {
          console.error('âŒ Customer receipt email failed:', err);
        })
    );
  }

  await Promise.allSettled(tasks);
}

// ==========================================
// API Endpoints
// ==========================================

// Create new order (manual/cash fallback)
app.post('/api/orders', orderLimiter, async (req, res) => {
  try {
    const data = req.body.order || req.body;

    if (!data) {
      return res.status(400).json({ error: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù…Ø±Ø³Ù„Ø© ØªØ§Ù„ÙØ©.' });
    }

    // Sanitization & Parsing
    const name = sanitize(data.customerName || data.name);
    const phone = sanitize(data.customerPhone || data.phone);
    const email = sanitize(data.customerEmail || data.email);
    const epicId = sanitize(data.epicId || data.epic_id || 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯');
    const platform = sanitize(data.platform);
    const mode = sanitize(data.mode);
    const currentRank = sanitize(data.currentRank);
    const targetRank = sanitize(data.targetRank);
    const reward = sanitize(data.reward);
    const paymentMethod = sanitize(data.paymentMethod || '');
    let notes = sanitize(data.notes || '');
    if (paymentMethod) {
      notes = `[Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¯ÙØ¹: ${paymentMethod}]` + (notes ? ` - ${notes}` : '');
    }
    const priceNum = parseInt(data.total || data.price || 0, 10);

    // Validation checks
    if (!name || !phone || !email || !platform || !mode || !currentRank || !targetRank) {
      return res.status(400).json({ error: 'ÙŠØ±Ø¬Ù‰ ØªØ¹Ø¨Ø¦Ø© Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©.' });
    }

    const rankHierarchy = [
      'Bronze',
      'Silver',
      'Gold',
      'Platinum',
      'Diamond',
      'Champion',
      'Grand Champion',
      'Supersonic Legend'
    ];

    const currentIdx = rankHierarchy.indexOf(currentRank);
    const targetIdx = rankHierarchy.indexOf(targetRank);

    if (currentIdx === -1 || targetIdx === -1 || targetIdx <= currentIdx) {
      return res.status(400).json({ error: 'Ø§Ù„Ø±Ø§Ù†Ùƒ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙƒÙˆÙ† Ø£Ø¹Ù„Ù‰ Ù…Ù† Ø§Ù„Ø±Ø§Ù†Ùƒ Ø§Ù„Ø­Ø§Ù„ÙŠ.' });
    }

    // Generate unique order number (e.g., GZ-2026-0001)
    const currentYear = new Date().getFullYear();
    const latestRow = db.prepare('SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY id DESC LIMIT 1').get(`GZ-${currentYear}-%`);

    let currentIncr = 1;
    if (latestRow) {
      const parts = latestRow.order_number.split('-');
      const parsedNum = parseInt(parts[2], 10);
      if (!isNaN(parsedNum)) {
        currentIncr = parsedNum + 1;
      }
    }
    const orderNumber = `GZ-${currentYear}-${String(currentIncr).padStart(4, '0')}`;
    const trackingId = generateTrackingId();
    const createdAt = new Date().toISOString();

    // Insertion
    const insertStmt = db.prepare(`
      INSERT INTO orders (
        order_number, tracking_id, service_name, customer_name, customer_phone, customer_email, epic_id, platform, mode, current_rank, target_rank, reward, total_price, notes, status, created_at
      ) VALUES (?, ?, 'Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ ÙˆØ§Ù„Ø±ÙŠÙˆØ§Ø±Ø¯Ø²', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Ø¬Ø¯ÙŠØ¯', ?)
    `);

    insertStmt.run(
      orderNumber,
      trackingId,
      name,
      phone,
      email,
      epicId,
      platform,
      mode,
      currentRank,
      targetRank,
      reward,
      priceNum,
      notes,
      createdAt
    );

    const savedOrder = {
      order_number: orderNumber,
      tracking_id: trackingId,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      epic_id: epicId,
      platform,
      mode,
      current_rank: currentRank,
      target_rank: targetRank,
      reward,
      total_price: priceNum,
      notes
    };

    // Dispatch email notification to admin asynchronously (without waiting or failing)
    sendAdminEmailNotification(savedOrder).catch(err => {
      console.error('Email alert dispatch error:', err);
    });

    res.json({
      success: true,
      message: 'ØªÙ… Ø­Ø¬Ø² ÙˆØªØ³Ø¬ÙŠÙ„ Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­!',
      order_number: orderNumber
    });

  } catch (error) {
    console.error('Create Order Exception in SQLite:', error);
    res.status(500).json({ error: 'Ø­Ø¯Ø« Ø¹Ø·Ù„ Ø¯Ø§Ø®Ù„ÙŠ Ø£Ø«Ù†Ø§Ø¡ Ø­ÙØ¸ ÙˆØªØ®Ø²ÙŠÙ† ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨.' });
  }
});

app.get('/api/geidea/config', (req, res) => {
  const config = getGeideaConfig();
  res.json({
    success: true,
    configured: Boolean(config.publicKey && config.apiPassword),
    checkoutScript: config.checkoutScript,
    currency: config.currency,
    applePayReady: false
  });
});

app.post('/api/geidea/rocket-pay', orderLimiter, async (req, res) => {
  try {
    const data = req.body || {};
    const name = sanitize(data.customerName || data.name);
    const phone = sanitize(data.customerPhone || data.phone);
    const email = sanitize(data.customerEmail || data.contactEmail || data.email);
    const contactEmail = sanitize(data.contactEmail || data.customerEmail || data.email);
    const orderEmail = sanitize(data.accountEmail || data.orderEmail || data.account_email || data.order_email || '');
    const password = sanitize(data.password || '');
    const epicId = sanitize(data.epicId || data.epic_id || 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯');
    const platform = sanitize(data.platform);
    const mode = sanitize(data.mode);
    const currentRank = sanitize(data.currentRank);
    const targetRank = sanitize(data.targetRank);
    const reward = sanitize(data.reward);
    const total = Number(data.total || data.price || 0);
    const notes = sanitize(data.notes || '');

    if (!name || !phone || !email || !platform || !mode || !currentRank || !targetRank || !total) {
      return res.status(400).json({ error: 'ÙŠØ±Ø¬Ù‰ ØªØ¹Ø¨Ø¦Ø© Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·Ù„Ø¨ Ù‚Ø¨Ù„ Ø§Ù„Ø¯ÙØ¹.' });
    }

    const orderNumber = generateOrderNumber('GZ');
    const trackingId = generateTrackingId();
    const createdAt = new Date().toISOString();
    const geideaSession = await createGeideaSession(req, {
      amount: total,
      merchantReferenceId: crypto.randomUUID(),
      returnUrl: data.returnUrl,
      customer: {
        name,
        email,
        phoneNumber: phone
      },
      order: {
        description: geideaOrderDescription('GAMEZOOM-ROCKET', orderNumber)
      }
    });

    db.prepare(`
      INSERT INTO orders (
        order_number, tracking_id, service_name, customer_name, customer_phone, customer_email, contact_email, order_email, account_password, epic_id, platform, mode, current_rank, target_rank, reward, total_price, notes, payment_id, payment_status, email_sent, status, created_at
      ) VALUES (?, ?, 'Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ ÙˆØ§Ù„Ø±ÙŠÙˆØ§Ø±Ø¯Ø²', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, 'Ø¬Ø¯ÙŠØ¯', ?)
    `).run(orderNumber, trackingId, name, phone, contactEmail, contactEmail, orderEmail, password, epicId, platform, mode, currentRank, targetRank, reward, total, notes, geideaSession.sessionId, createdAt);

    res.json({
      success: true,
      provider: 'geidea',
      sessionId: geideaSession.sessionId,
      checkoutScript: geideaSession.checkoutScript,
      orderNumber,
      trackingId
    });
  } catch (error) {
    console.error('Geidea Rocket payment error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø¬Ù„Ø³Ø© Ø§Ù„Ø¯ÙØ¹.' });
  }
});

app.post('/api/geidea/checkout-result', async (req, res) => {
  try {
    const result = await markGeideaPayment(req.body || {});
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Geidea checkout-result error:', error);
    res.status(500).json({ error: 'ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ« Ø­Ø§Ù„Ø© Ø§Ù„Ø¯ÙØ¹.' });
  }
});

app.all('/api/geidea/callback', async (req, res) => {
  try {
    await markGeideaPayment({ ...(req.query || {}), ...(req.body || {}) });
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Geidea callback error:', error);
    res.status(200).json({ received: true });
  }
});

// Endpoint to initiate Moyasar payment
app.post('/api/pay', orderLimiter, async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø±Ø³Ù„Ø© ØºÙŠØ± ØµØ§Ù„Ø­Ø©.' });
    }

    const name = sanitize(data.customerName || data.name);
    const phone = sanitize(data.customerPhone || data.phone);
    // customerEmail/contactEmail = Ø¨Ø±ÙŠØ¯ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ù† Ø§Ù„Ø³Ù„Ø©
    const email = sanitize(data.customerEmail || data.contactEmail || data.email);
    const contactEmail = sanitize(data.contactEmail || data.customerEmail || data.email);
    // accountEmail/orderEmail = Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù„Ù„Ø­Ø³Ø§Ø¨ Ù…Ù† ØµÙØ­Ø© Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ
    const orderEmail = sanitize(data.accountEmail || data.orderEmail || data.account_email || data.order_email || '');
    const password = sanitize(data.password || '');
    const epicId = sanitize(data.epicId || data.epic_id || 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯');
    const platform = sanitize(data.platform);
    const mode = sanitize(data.mode);
    const currentRank = sanitize(data.currentRank);
    const targetRank = sanitize(data.targetRank);
    const reward = sanitize(data.reward);
    const total = parseInt(data.total || data.price || 0, 10);
    const notes = sanitize(data.notes || '');

    // Server-side validation of all required fields before payment
    if (!name || !phone || !email || !platform || !mode || !currentRank || !targetRank) {
      return res.status(400).json({ error: 'ÙŠØ±Ø¬Ù‰ ØªØ¹Ø¨Ø¦Ø© Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©.' });
    }

    // Moyasar configuration validation
    const secretKey = process.env.MOYASAR_SECRET_KEY;
    if (!secretKey) {
      console.error('âŒ [Moyasar Error]: MOYASAR_SECRET_KEY is missing in environment.');
      return res.status(500).json({ error: 'ØªÙ‡ÙŠØ¦Ø© Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø¯ÙØ¹ ØºÙŠØ± Ù…ÙƒØªÙ…Ù„Ø©ØŒ ÙŠØ±Ø¬Ù‰ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ØªØ¬Ø± Ù„Ø§Ø­Ù‚Ø§Ù‹.' });
    }
    console.log('Using Moyasar key prefix:', secretKey?.substring(0, 7));

    // Get Base URL dynamically
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Moyasar expects amount in Halalas (1 SAR = 100 Halalas)
    const amountInHalalas = total * 100;

    // Call Moyasar API to create an Invoice (Hosted Checkout Page)
    const auth = Buffer.from(`${secretKey}:`).toString('base64');
    const moyasarRes = await fetch('https://api.moyasar.com/v1/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInHalalas,
        currency: 'SAR',
        description: `Ø®Ø·ÙØ© Ø³ØªÙˆØ± - Order - ${contactEmail || orderEmail || email}`,
        // Moyasar hosted invoice return URLs.
        // The countdown runs on our success.html page after Moyasar returns the customer.
        callback_url: "https://gamezooom100.pages.dev/success.html",
        success_url: "https://gamezooom100.pages.dev/success.html",
        back_url: "https://gamezooom100.pages.dev/success.html",
        metadata: {
          customer_name: name,
          customer_phone: phone,
          customer_email: contactEmail,
          contact_email: contactEmail,
          order_email: orderEmail,
          account_password: password,
          epic_id: epicId,
          platform: platform,
          mode: mode,
          current_rank: currentRank,
          target_rank: targetRank,
          reward: reward,
          notes: notes,
          total_price: String(total),
          // Will be updated after local order number generation when possible.
          // Kept for compatibility with webhook metadata parsing.
          source: 'gamezoom'
        }
      })
    });

    const moyasarData = await moyasarRes.json();

    if (!moyasarRes.ok) {
      console.error('âŒ Moyasar Invoice API Error:', moyasarData);
      return res.status(400).json({ error: moyasarData.message || 'ÙØ´Ù„ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø¯ÙØ¹ Ù…ÙŠØ³Ø±.' });
    }

    // Save PENDING order
    // ÙŠØªÙ… Ø­ÙØ¸ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ÙÙŠ Ø¹Ù…ÙˆØ¯ Ù…Ù†ÙØµÙ„ Ù„Ù„ÙˆØ­Ø© Ø§Ù„Ø£Ø¯Ù…Ù† ÙÙ‚Ø·ØŒ ÙˆÙ„Ø§ ÙŠØªÙ… Ø¥Ø±Ø³Ø§Ù„Ù‡Ø§ Ø¨Ø§Ù„Ø¨Ø±ÙŠØ¯.
    let finalNotes = notes;

    const currentYear = new Date().getFullYear();
    const latestRow = db.prepare('SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY id DESC LIMIT 1').get(`GZ-${currentYear}-%`);
    let currentIncr = 1;
    if (latestRow) {
      const parts = latestRow.order_number.split('-');
      const parsedNum = parseInt(parts[2], 10);
      if (!isNaN(parsedNum)) {
        currentIncr = parsedNum + 1;
      }
    }
    const orderNumber = `GZ-${currentYear}-${String(currentIncr).padStart(4, '0')}`;
    const trackingId = generateTrackingId();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO orders (
        order_number, tracking_id, service_name, customer_name, customer_phone, customer_email, contact_email, order_email, account_password, epic_id, platform, mode, current_rank, target_rank, reward, total_price, notes, payment_id, payment_status, email_sent, status, created_at
      ) VALUES (?, ?, 'Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ ÙˆØ§Ù„Ø±ÙŠÙˆØ§Ø±Ø¯Ø²', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, 'Ø¬Ø¯ÙŠØ¯', ?)
    `).run(orderNumber, trackingId, name, phone, contactEmail, contactEmail, orderEmail, password, epicId, platform, mode, currentRank, targetRank, reward, total, finalNotes, moyasarData.id, createdAt);

    // Return checkout URL to client for redirection
    res.json({
      success: true,
      checkoutUrl: moyasarData.url,
      invoiceId: moyasarData.id
    });

  } catch (error) {
    console.error('Moyasar Init Exception:', error);
    res.status(500).json({ error: 'Ø­Ø¯Ø« Ø®Ø·Ø£ ØºÙŠØ± Ù…ØªÙˆÙ‚Ø¹ Ø£Ø«Ù†Ø§Ø¡ ØªÙˆÙ„ÙŠØ¯ Ø±Ø§Ø¨Ø· Ø¯ÙØ¹ Ù…ÙŠØ³Ø±.' });
  }
});

// Endpoint to verify payment and process order
app.get('/api/verify-payment', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.redirect(`/failed.html?error=${encodeURIComponent('Ø±Ù‚Ù… ØªØ¹Ø±ÙŠÙ Ø§Ù„Ø¯ÙØ¹ Ù…ÙÙ‚ÙˆØ¯.')}`);
    }

    const secretKey = process.env.MOYASAR_SECRET_KEY;
    if (!secretKey) {
      console.error('âŒ [Moyasar Error]: MOYASAR_SECRET_KEY is missing on server.');
      return res.redirect(`/failed.html?id=${id}&error=${encodeURIComponent('ØªÙ‡ÙŠØ¦Ø© Ù†Ø¸Ø§Ù… Ø§Ù„Ø¯ÙØ¹ ØºÙŠØ± Ù…ÙƒØªÙ…Ù„Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø§Ø¯Ù….')}`);
    }
    console.log('Using Moyasar key prefix:', secretKey?.substring(0, 7));

    // 1. Prevent duplicate order creation if customer refreshes or re-enters callback URL
    const existingOrder = db.prepare('SELECT * FROM orders WHERE payment_id = ?').get(id);
    if (existingOrder) {
      if (shouldSendPaidEmails(existingOrder)) {
          console.log(`[Verify Success Duplicate]: Invoice ${id} paid but one or more emails were not sent. Retrying email.`);
          const savedOrder = db.prepare('SELECT * FROM orders WHERE payment_id = ?').get(id);
          void sendPaidOrderEmails(savedOrder, { table: 'orders', type: 'rocket' }).catch(err => {
            console.error('Email notification failed for paid order:', err);
          });
      } else {
        console.log(`[Verify Success Duplicate]: Invoice ${id} already processed.`);
      }
      return res.json({ success: true, paid: true, orderNumber: existingOrder.order_number, trackingId: existingOrder.tracking_id, amount: existingOrder.total_price });
    }

    // 2. Fetch invoice status securely from Moyasar server to verify transaction
    const auth = Buffer.from(`${secretKey}:`).toString('base64');
    const moyasarRes = await fetch(`https://api.moyasar.com/v1/invoices/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    const invoice = await moyasarRes.json();

    if (!moyasarRes.ok) {
      console.error('âŒ Moyasar Invoice Retrieve Error:', invoice);
      return res.status(400).json({ success: false, error: 'ØªØ¹Ø°Ø± Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„ÙØ§ØªÙˆØ±Ø© Ù„Ø¯Ù‰ Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø³Ø¯Ø§Ø¯ Ù…ÙŠØ³Ø±.' });
    }

    // 3. Confirm Invoice status is 'paid'
    if (invoice.status !== 'paid') {
      console.log(`[Verify Failed]: Payment status is ${invoice.status} for Invoice ${id}`);
      return res.status(400).json({ success: false, error: 'Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø¯ÙØ¹ ØºÙŠØ± Ù…ÙƒØªÙ…Ù„Ø© Ø£Ùˆ ØªÙ… Ø¥Ù„ØºØ§Ø¤Ù‡Ø§ Ù…Ù† Ù‚Ø¨Ù„ Ø§Ù„Ø¹Ù…ÙŠÙ„.' });
    }

    // Extract order metadata
    const metadata = invoice.metadata || {};
    const customer_name = metadata.customer_name || '';
    const customer_phone = metadata.customer_phone || '';
    const customer_email = metadata.customer_email || '';
    const contact_email = metadata.contact_email || metadata.customer_email || '';
    const order_email = metadata.order_email || metadata.account_email || '';
    const password = metadata.account_password || metadata.password || '';
    const epic_id = metadata.epic_id || '';
    const platform = metadata.platform || '';
    const mode = metadata.mode || '';
    const current_rank = metadata.current_rank || '';
    const target_rank = metadata.target_rank || '';
    const reward = metadata.reward || '';
    const total_price = parseInt(metadata.total_price || (invoice.amount / 100), 10);
    const notes = metadata.notes || '';

    // Keep password separate from notes and email; it is available only in the admin panel.
    let finalNotes = notes;

    // 4. Generate unique order ID
    const currentYear = new Date().getFullYear();
    const latestRow = db.prepare('SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY id DESC LIMIT 1').get(`GZ-${currentYear}-%`);

    let currentIncr = 1;
    if (latestRow) {
      const parts = latestRow.order_number.split('-');
      const parsedNum = parseInt(parts[2], 10);
      if (!isNaN(parsedNum)) {
        currentIncr = parsedNum + 1;
      }
    }
    const orderNumber = `GZ-${currentYear}-${String(currentIncr).padStart(4, '0')}`;
    const createdAt = new Date().toISOString();

    // 5. Save order to database
    const insertStmt = db.prepare(`
      INSERT INTO orders (
        order_number, service_name, customer_name, customer_phone, customer_email, contact_email, order_email, account_password, epic_id, platform, mode, current_rank, target_rank, reward, total_price, notes, payment_id, payment_status, email_sent, status, created_at
      ) VALUES (?, 'Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ ÙˆØ§Ù„Ø±ÙŠÙˆØ§Ø±Ø¯Ø²', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', 0, 'Ø¬Ø¯ÙŠØ¯', ?)
    `);

    insertStmt.run(
      orderNumber,
      customer_name,
      customer_phone,
      contact_email || customer_email,
      contact_email || customer_email,
      order_email || customer_email,
      password,
      epic_id,
      platform,
      mode,
      current_rank,
      target_rank,
      reward,
      total_price,
      finalNotes,
      id,
      createdAt
    );

    const savedOrder = {
      order_number: orderNumber,
      customer_name,
      customer_phone,
      customer_email: contact_email || customer_email,
      contact_email: contact_email || customer_email,
      order_email: order_email || customer_email,
      account_password: password,
      epic_id,
      platform,
      mode,
      current_rank,
      target_rank,
      reward,
      total_price,
      notes: finalNotes,
      tracking_id: null,
      payment_id: id
    };

    // 6. Send email notification to ADMIN_EMAIL using Resend if not already sent
    if (!existingOrder || shouldSendPaidEmails(savedOrder)) {
      console.log("âœ… Payment is paid");
      console.log("ðŸ“§ Starting email notifications...");
      console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
      console.log("FROM_EMAIL:", process.env.FROM_EMAIL);

      void sendPaidOrderEmails(savedOrder, { table: 'orders', type: 'rocket' }).catch(err => {
        console.error("âŒ Resend email failed:", err);
      });
    }

    // 7. Return JSON response instead of redirect
    res.json({ success: true, paid: true, orderNumber: orderNumber, trackingId: savedOrder.tracking_id, amount: total_price });

  } catch (error) {
    console.error('Verify Payment Exception:', error);
    res.status(500).json({ success: false, error: 'Ø­Ø¯Ø« Ø®Ø·Ø£ ØºÙŠØ± Ù…ØªÙˆÙ‚Ø¹ Ø£Ø«Ù†Ø§Ø¡ Ù…Ø¹Ø§Ù„Ø¬Ø© ÙˆØµÙŠØ§Ù†Ø© Ø§Ù„Ø¯ÙØ¹.' });
  }
});

// Endpoint to receive Moyasar webhooks
app.get('/api/moyasar/webhook', (req, res) => {
  res.json({ status: "webhook ready" });
});

app.post('/api/moyasar/webhook', express.json(), async (req, res) => {
  // Return success immediately to Moyasar
  res.status(200).json({ received: true });

  // Process asynchronously
  try {
    const payload = req.body;
    console.log("ðŸ“© Webhook body:", JSON.stringify(req.body, null, 2));

    // Determine event details
    const eventType = payload.type || payload.event || "";
    const data = payload.data || payload;
    const status = data.status || "";
    const paymentId = data.id || "";
    const invoiceId = data.invoice_id || "";
    const sourceInvoiceId = (data.source && data.source.invoice_id) ? data.source.invoice_id : "";

    // Determine if successful
    const isSuccessStatus = ['paid', 'captured', 'successful'].includes(status);
    const isSuccessEvent = ['PAYMENT_PAID', 'payment_paid', 'PAYMENT_CAPTURED', 'payment_captured'].includes(eventType);

    if (isSuccessStatus || isSuccessEvent) {
      console.log("âœ… Paid event detected");

      // Find order using all possible Moyasar IDs and metadata fallbacks
      const metadata = data.metadata || payload.metadata || {};
      const metaTrackingId = metadata.tracking_id || metadata.trackingId || '';
      const metaOrderNumber = metadata.order_number || metadata.orderNumber || '';
      const idsToTry = [
        paymentId,
        invoiceId,
        sourceInvoiceId,
        data.payment_id,
        data.invoiceId,
        data.source?.id,
        data.source?.payment_id,
        data.source?.invoice_id
      ].filter(Boolean);

      let order = null;
      for (const id of idsToTry) {
        order = db.prepare('SELECT * FROM orders WHERE payment_id = ?').get(id);
        if (order) break;
      }

      if (!order && metaTrackingId) {
        order = db.prepare('SELECT * FROM orders WHERE tracking_id = ?').get(metaTrackingId);
      }

      if (!order && metaOrderNumber) {
        order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(metaOrderNumber);
      }

      console.log("Webhook event type:", eventType);
      console.log("Webhook payment status:", status);
      console.log("Webhook payment id:", paymentId);
      console.log("Webhook invoice id:", invoiceId);
      console.log("Order found:", !!order);

      if (!order) {
        console.log("âŒ Order not found for webhook ID");
        return;
      }

      if (shouldSendPaidEmails(order)) {
        console.log("ðŸ“§ Sending order emails via Resend");
        await sendPaidOrderEmails(order, { table: 'orders', type: 'rocket' });
        db.prepare('UPDATE orders SET payment_status = ? WHERE id = ?').run('paid', order.id);
        console.log("âœ… Email notifications sent successfully");
      } else {
        console.log("âœ… Order already processed and email sent.");
      }
    }
  } catch (error) {
    console.error("âŒ Webhook processing error:", error);
  }
});

// Endpoint to update order status (Admin only)
app.post('/api/update-order-status', (req, res) => {
  const { tracking_id, status } = req.body;
  const validStatuses = ['pending', 'paid', 'assigned', 'in_progress', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Ø­Ø§Ù„Ø© Ø§Ù„Ø·Ù„Ø¨ ØºÙŠØ± ØµØ§Ù„Ø­Ø©.' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE tracking_id = ?').get(tracking_id);
  if (!order) {
    return res.status(404).json({ error: 'Ø§Ù„Ø·Ù„Ø¨ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯.' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE tracking_id = ?').run(status, tracking_id);
  res.json({ success: true });
});

// ==========================================
// Digital Storefront API
// ==========================================
function parseOptions(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value).split(/\r?\n|,/).map(item => item.trim()).filter(Boolean);
  }
}

function mapStoreProduct(product) {
  return {
    ...product,
    price: Number(product.price || 0),
    old_price: Number(product.old_price || 0),
    featured: Boolean(product.featured),
    active: Boolean(product.active),
    options: parseOptions(product.options_json)
  };
}

function getStoreSettings() {
  return Object.fromEntries(db.prepare('SELECT key, value FROM store_settings').all().map(row => [row.key, row.value]));
}

app.get('/api/storefront', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM store_categories WHERE active = 1 ORDER BY sort_order, id').all();
    const banners = db.prepare('SELECT * FROM store_banners WHERE active = 1 ORDER BY sort_order, id').all();
    const products = db.prepare('SELECT * FROM store_products WHERE active = 1 ORDER BY featured DESC, id DESC').all().map(mapStoreProduct);
    res.json({ success: true, settings: getStoreSettings(), categories, banners, products });
  } catch (error) {
    console.error('Storefront load error:', error);
    res.status(500).json({ error: 'ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…ØªØ¬Ø±.' });
  }
});

app.get('/api/store/products/:slug', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM store_products WHERE slug = ? AND active = 1').get(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Ø§Ù„Ù…Ù†ØªØ¬ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯.' });
    res.json({ success: true, product: mapStoreProduct(product) });
  } catch (error) {
    res.status(500).json({ error: 'ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬.' });
  }
});

app.post('/api/shop-orders', orderLimiter, async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_email, items, total, returnUrl } = req.body || {};
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ù…Ù†ØªØ¬ Ø£ÙˆÙ„Ø§Ù‹.' });
    }
    const orderNumber = `GZS-${Date.now().toString().slice(-9)}`;
    const payableTotal = Number(total || 0);
    const customerName = sanitize(customer_name || 'Ø¹Ù…ÙŠÙ„ Ø®Ø·ÙØ© Ø³ØªÙˆØ±');
    const customerPhone = sanitize(customer_phone || '');
    const customerEmail = sanitize(customer_email || '');
    const geideaSession = await createGeideaSession(req, {
      amount: payableTotal,
      merchantReferenceId: crypto.randomUUID(),
      returnUrl,
      customer: Object.fromEntries(Object.entries({
        name: customerName,
        email: customerEmail,
        phoneNumber: customerPhone
      }).filter(([, value]) => value)),
      order: {
        description: geideaOrderDescription('GAMEZOOM-STORE', orderNumber)
      }
    });
    const sanitizedItems = items.map(item => ({
      ...item,
      name: sanitize(item.name || ''),
      option: sanitize(item.option || ''),
      image: sanitize(item.image || ''),
      delivery: {
        short_address: sanitize(item.delivery?.short_address || req.body?.short_address || ''),
        address_notes: sanitize(item.delivery?.address_notes || req.body?.address_notes || ''),
        lat: sanitize(item.delivery?.lat || req.body?.lat || ''),
        lng: sanitize(item.delivery?.lng || req.body?.lng || ''),
        maps_url: sanitize(item.delivery?.maps_url || req.body?.maps_url || '')
      }
    }));
    const draftOrder = {
      order_number: orderNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      items_json: JSON.stringify(sanitizedItems),
      total: payableTotal
    };
    db.prepare(`
      INSERT INTO shop_orders
        (order_number, customer_name, customer_phone, customer_email, items_json, total, status, payment_id, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, 'pending', ?)
    `).run(
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      JSON.stringify(sanitizedItems),
      payableTotal,
      geideaSession.sessionId,
      new Date().toISOString()
    );
    res.json({
      success: true,
      provider: 'geidea',
      order_number: orderNumber,
      sessionId: geideaSession.sessionId,
      checkoutScript: geideaSession.checkoutScript,
      adminWhatsAppUrl: adminWhatsAppUrlForShopOrder(draftOrder)
    });
  } catch (error) {
    console.error('Shop order error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'ØªØ¹Ø°Ø± Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨.' });
  }
});

const authCodes = new Map();

app.post('/api/auth/request-code', (req, res) => {
  const identifier = sanitize(req.body?.identifier || '');
  if (!identifier) return res.status(400).json({ error: 'Ø£Ø¯Ø®Ù„ Ø±Ù‚Ù… Ø§Ù„Ø¬ÙˆØ§Ù„ Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ.' });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  authCodes.set(identifier, { code, expires: Date.now() + 5 * 60 * 1000 });
  res.json({
    success: true,
    message: 'ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø±Ù…Ø² ØªØ­Ù‚Ù‚ ØªØ¬Ø±ÙŠØ¨ÙŠ. Ø§Ø±Ø¨Ø· Ù…Ø²ÙˆØ¯ SMS Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ± Ù„Ù„Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠ.',
    demo_code: code
  });
});

app.post('/api/auth/verify-code', (req, res) => {
  const identifier = sanitize(req.body?.identifier || '');
  const code = sanitize(req.body?.code || '');
  const stored = authCodes.get(identifier);
  if (!stored || stored.code !== code || stored.expires < Date.now()) {
    return res.status(400).json({ error: 'Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ ØºÙŠØ± ØµØ­ÙŠØ­ Ø£Ùˆ Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØªÙ‡.' });
  }
  authCodes.delete(identifier);
  const existing = db.prepare('SELECT * FROM store_users WHERE identifier = ?').get(identifier);
  if (!existing) {
    db.prepare('INSERT INTO store_users (identifier, verified, created_at) VALUES (?, 1, ?)')
      .run(identifier, new Date().toISOString());
  } else {
    db.prepare('UPDATE store_users SET verified = 1 WHERE identifier = ?').run(identifier);
  }
  res.json({ success: true, user: { identifier }, token: Buffer.from(`${identifier}:${Date.now()}`).toString('base64') });
});



// ==========================================
// Admin Panel API (password protected)
// ==========================================
function requireAdmin(req, res, next) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD ØºÙŠØ± Ù…Ø¶Ø¨ÙˆØ· ÙÙŠ Ù…ØªØºÙŠØ±Ø§Øª Ø§Ù„Ø¨ÙŠØ¦Ø©.' });
  }
  const providedPassword = req.headers['x-admin-password'] || req.body?.admin_password || req.query?.admin_password;
  if (!providedPassword || providedPassword !== configuredPassword) {
    return res.status(401).json({ error: 'ÙƒÙ„Ù…Ø© Ù…Ø±ÙˆØ± Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© ØºÙŠØ± ØµØ­ÙŠØ­Ø©.' });
  }
  next();
}

function adminStorePayload() {
  return {
    settings: getStoreSettings(),
    categories: db.prepare('SELECT * FROM store_categories ORDER BY sort_order, id').all(),
    banners: db.prepare('SELECT * FROM store_banners ORDER BY sort_order, id').all(),
    products: db.prepare('SELECT * FROM store_products ORDER BY id DESC').all().map(mapStoreProduct),
    shop_orders: db.prepare('SELECT * FROM shop_orders ORDER BY id DESC LIMIT 100').all().map(order => ({
      ...order,
      items: (() => {
        try { return JSON.parse(order.items_json || '[]'); } catch { return []; }
      })()
    }))
  };
}

app.get('/api/admin/storefront', requireAdmin, (req, res) => {
  try {
    res.json({ success: true, ...adminStorePayload() });
  } catch (error) {
    console.error('Admin storefront load error:', error);
    res.status(500).json({ error: 'ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ØªØ¬Ø±.' });
  }
});

app.post('/api/admin/store/settings', requireAdmin, (req, res) => {
  try {
    const settings = req.body?.settings || {};
    const upsert = db.prepare(`
      INSERT INTO store_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    Object.entries(settings).forEach(([key, value]) => upsert.run(String(key), String(value ?? '')));
    res.json({ success: true, settings: getStoreSettings() });
  } catch (error) {
    res.status(500).json({ error: 'ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ØªØ¬Ø±.' });
  }
});

app.post('/api/admin/store/categories', requireAdmin, (req, res) => {
  try {
    const item = req.body || {};
    if (!item.name || !item.slug) return res.status(400).json({ error: 'Ø§Ø³Ù… ÙˆØ±Ø§Ø¨Ø· Ø§Ù„Ù‚Ø³Ù… Ù…Ø·Ù„ÙˆØ¨Ø§Ù†.' });
    if (item.id) {
      db.prepare(`
        UPDATE store_categories
        SET name = ?, slug = ?, description = ?, image = ?, link = ?, sort_order = ?, active = ?
        WHERE id = ?
      `).run(item.name, item.slug, item.description || '', item.image || '', item.link || '', Number(item.sort_order || 0), item.active ? 1 : 0, item.id);
    } else {
      db.prepare(`
        INSERT INTO store_categories (name, slug, description, image, link, sort_order, active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(item.name, item.slug, item.description || '', item.image || '', item.link || `category.html?category=${item.slug}`, Number(item.sort_order || 0), item.active === false ? 0 : 1);
    }
    res.json({ success: true, categories: adminStorePayload().categories });
  } catch (error) {
    res.status(400).json({ error: 'ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ù‚Ø³Ù…. ØªØ£ÙƒØ¯ Ø£Ù† Ø§Ù„Ø±Ø§Ø¨Ø· Ø§Ù„Ù…Ø®ØªØµØ± ØºÙŠØ± Ù…Ø³ØªØ®Ø¯Ù….' });
  }
});

app.delete('/api/admin/store/categories/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM store_categories WHERE id = ?').run(Number(req.params.id));
  res.json({ success: true });
});

app.post('/api/admin/store/banners', requireAdmin, (req, res) => {
  try {
    const item = req.body || {};
    if (!item.title) return res.status(400).json({ error: 'Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¨Ù†Ø± Ù…Ø·Ù„ÙˆØ¨.' });
    if (item.id) {
      db.prepare(`
        UPDATE store_banners SET title = ?, subtitle = ?, image = ?, link = ?, sort_order = ?, active = ? WHERE id = ?
      `).run(item.title, item.subtitle || '', item.image || '', item.link || '', Number(item.sort_order || 0), item.active ? 1 : 0, item.id);
    } else {
      db.prepare(`
        INSERT INTO store_banners (title, subtitle, image, link, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)
      `).run(item.title, item.subtitle || '', item.image || '', item.link || '', Number(item.sort_order || 0), item.active === false ? 0 : 1);
    }
    res.json({ success: true, banners: adminStorePayload().banners });
  } catch (error) {
    res.status(400).json({ error: 'ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ø¨Ù†Ø±.' });
  }
});

app.delete('/api/admin/store/banners/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM store_banners WHERE id = ?').run(Number(req.params.id));
  res.json({ success: true });
});

app.post('/api/admin/store/products', requireAdmin, (req, res) => {
  try {
    const item = req.body || {};
    if (!item.name || !item.slug || !item.category_slug) {
      return res.status(400).json({ error: 'Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬ ÙˆØ±Ø§Ø¨Ø·Ù‡ ÙˆÙ‚Ø³Ù…Ù‡ Ù…Ø·Ù„ÙˆØ¨Ø©.' });
    }
    const optionsJson = JSON.stringify(parseOptions(item.options || item.options_json));
    if (item.id) {
      db.prepare(`
        UPDATE store_products
        SET category_slug = ?, name = ?, slug = ?, description = ?, price = ?, old_price = ?, image = ?,
            options_json = ?, external_url = ?, featured = ?, active = ?
        WHERE id = ?
      `).run(
        item.category_slug, item.name, item.slug, item.description || '', Number(item.price || 0), Number(item.old_price || 0),
        item.image || '', optionsJson, item.external_url || '', item.featured ? 1 : 0, item.active ? 1 : 0, item.id
      );
    } else {
      db.prepare(`
        INSERT INTO store_products
          (category_slug, name, slug, description, price, old_price, image, options_json, external_url, featured, active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        item.category_slug, item.name, item.slug, item.description || '', Number(item.price || 0), Number(item.old_price || 0),
        item.image || '', optionsJson, item.external_url || '', item.featured ? 1 : 0, item.active === false ? 0 : 1, new Date().toISOString()
      );
    }
    res.json({ success: true, products: adminStorePayload().products });
  } catch (error) {
    res.status(400).json({ error: 'ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ù…Ù†ØªØ¬. ØªØ£ÙƒØ¯ Ø£Ù† Ø±Ø§Ø¨Ø· Ø§Ù„Ù…Ù†ØªØ¬ ØºÙŠØ± Ù…Ø³ØªØ®Ø¯Ù….' });
  }
});

app.delete('/api/admin/store/products/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM store_products WHERE id = ?').run(Number(req.params.id));
  res.json({ success: true });
});

app.post('/api/admin/store/orders/:id/status', requireAdmin, (req, res) => {
  const status = sanitize(req.body?.status || '');
  if (!status) return res.status(400).json({ error: 'Ø§Ù„Ø­Ø§Ù„Ø© Ù…Ø·Ù„ÙˆØ¨Ø©.' });
  db.prepare('UPDATE shop_orders SET status = ? WHERE id = ?').run(status, Number(req.params.id));
  res.json({ success: true });
});

function redactSensitiveNotes(notes) {
  if (!notes) return '';
  return String(notes)
    .replace(/\[ÙƒÙ„Ù…Ø© Ù…Ø±ÙˆØ± Ø§Ù„Ø­Ø³Ø§Ø¨:[^\]]*\]/g, '[ÙƒÙ„Ù…Ø© Ù…Ø±ÙˆØ± Ø§Ù„Ø­Ø³Ø§Ø¨: Ù…Ø®ÙÙŠØ© Ù„Ø£Ù…Ø§Ù† Ø§Ù„Ø¹Ù…ÙŠÙ„]')
    .replace(/ÙƒÙ„Ù…Ø©\s*Ø§Ù„Ù…Ø±ÙˆØ±\s*[:ï¼š][^\-\n\r]*/gi, 'ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±: Ù…Ø®ÙÙŠØ© Ù„Ø£Ù…Ø§Ù† Ø§Ù„Ø¹Ù…ÙŠÙ„');
}

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT id, order_number, tracking_id, service_name, customer_name, customer_phone, customer_email, contact_email, order_email, account_password,
             platform, mode, current_rank, target_rank, reward, total_price, notes, payment_id,
             payment_status, status, email_sent, created_at
      FROM orders
      ORDER BY id DESC
    `).all().map(order => ({
      ...order,
      safe_notes: redactSensitiveNotes(order.notes),
      account_password: order.account_password || ''
    }));

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Admin orders load error:', error);
    res.status(500).json({ error: 'ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª.' });
  }
});

app.post('/api/admin/order-status', requireAdmin, (req, res) => {
  try {
    const { id, status } = req.body || {};
    const validStatuses = ['pending', 'paid', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (!id || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Ø¨ÙŠØ§Ù†Ø§Øª ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø­Ø§Ù„Ø© ØºÙŠØ± ØµØ­ÙŠØ­Ø©.' });
    }

    const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    if (!result.changes) {
      return res.status(404).json({ error: 'Ø§Ù„Ø·Ù„Ø¨ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Admin status update error:', error);
    res.status(500).json({ error: 'ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ« Ø­Ø§Ù„Ø© Ø§Ù„Ø·Ù„Ø¨.' });
  }
});

app.delete('/api/admin/orders/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Ø±Ù‚Ù… Ø§Ù„Ø·Ù„Ø¨ ØºÙŠØ± ØµØ­ÙŠØ­.' });
    }

    const result = db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    if (!result.changes) {
      return res.status(404).json({ error: 'Ø§Ù„Ø·Ù„Ø¨ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯ Ø£Ùˆ ØªÙ… Ø­Ø°ÙÙ‡ Ù…Ø³Ø¨Ù‚Ø§Ù‹.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Admin order delete error:', error);
    res.status(500).json({ error: 'ØªØ¹Ø°Ø± Ø­Ø°Ù Ø§Ù„Ø·Ù„Ø¨.' });
  }
});

// Serve frontend static assets
app.use('/.well-known', express.static(path.join(__dirname, '.well-known'), {
  dotfiles: 'allow',
  index: false,
  extensions: false
}));
app.use(express.static(__dirname));

// Route wildcard fallback serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Launch server on specified port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=============================================================`);
  console.log(`ðŸš€ Ø®Ø·ÙØ© Ø³ØªÙˆØ± running smoothly.`);
  console.log(`ðŸ”— Local preview server active at http://localhost:${PORT}`);
  console.log(`ðŸ“¡ Webhook endpoint registered`);
  console.log(`=============================================================\n`);
});