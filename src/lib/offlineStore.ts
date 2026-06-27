export interface OfflineUser {
  email: string;
  password: string;
  createdAt: string;
}

export interface OfflineOrderProduct {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface OfflineOrder {
  id: string;
  userEmail: string;
  products: OfflineOrderProduct[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const USERS_KEY = "khatfa_local_users";
const ORDERS_KEY = "khatfa_local_orders";

function readStoredList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredList<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export async function readResponseJson(response: Response): Promise<Record<string, any> | null> {
  const raw = await response.text();
  if (!raw.trim()) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function makeOfflineToken(email: string) {
  const normalized = email.trim().toLowerCase();
  return `offline-${btoa(normalized)}-${Date.now().toString(36)}`;
}

export function getOfflineUsers(): OfflineUser[] {
  return readStoredList<OfflineUser>(USERS_KEY);
}

export function registerOfflineUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const users = getOfflineUsers();

  if (users.some((user) => user.email.toLowerCase() === normalized)) {
    return { ok: false, error: "هذا البريد مسجل مسبقاً" };
  }

  users.push({
    email: normalized,
    password,
    createdAt: new Date().toISOString(),
  });

  writeStoredList(USERS_KEY, users);
  return { ok: true, token: makeOfflineToken(normalized), message: "تم التسجيل بنجاح" };
}

export function loginOfflineUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const users = getOfflineUsers();
  const existing = users.find((user) => user.email.toLowerCase() === normalized);

  if (!existing) {
    users.push({
      email: normalized,
      password,
      createdAt: new Date().toISOString(),
    });
  } else {
    existing.password = password;
  }

  writeStoredList(USERS_KEY, users);
  return { ok: true, token: makeOfflineToken(normalized), message: "تم تسجيل الدخول بوضع محلي" };
}

export function saveOfflineOrder(order: OfflineOrder) {
  const orders = readStoredList<OfflineOrder>(ORDERS_KEY);
  orders.push(order);
  writeStoredList(ORDERS_KEY, orders);
}

export function getOfflineOrdersByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return readStoredList<OfflineOrder>(ORDERS_KEY)
    .filter((order) => order.userEmail.toLowerCase() === normalized)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
