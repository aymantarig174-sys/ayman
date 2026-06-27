import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "server", "users.json");
const ORDERS_FILE = path.join(process.cwd(), "server", "orders.json");

// Helper to ensure files exist
function ensureFiles() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
  }
}

export interface LocalUser {
  id: string;
  email: string;
  passwordHash: string;
}

export interface LocalOrderProduct {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface LocalOrder {
  id: string;
  userId: string;
  products: LocalOrderProduct[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export const localDb = {
  getUsers(): LocalUser[] {
    ensureFiles();
    try {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveUser(user: LocalUser) {
    ensureFiles();
    const users = this.getUsers();
    users.push(user);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  },

  findUserByEmail(email: string): LocalUser | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getOrders(): LocalOrder[] {
    ensureFiles();
    try {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getOrdersByUserId(userId: string): LocalOrder[] {
    return this.getOrders().filter((o) => o.userId === userId);
  },

  saveOrder(order: LocalOrder) {
    ensureFiles();
    const orders = this.getOrders();
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  },
};
