import { motion } from "motion/react";
import { X, User, ShoppingBag, LogOut, Loader2, Package, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getOfflineOrdersByEmail, readResponseJson } from "../lib/offlineStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  isDarkMode?: boolean;
}

interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

interface Order {
  id: string;
  _id?: string;
  products: OrderProduct[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function Sidebar({ isOpen, onClose, isAuthenticated, onLogout, onOpenLogin, isDarkMode = true }: SidebarProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmail(localStorage.getItem("khatfa_email") || "demo@demo.com");
      if (isAuthenticated) {
        fetchOrders();
      }
    }
  }, [isOpen, isAuthenticated]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("khatfa_token");
      const userEmail = localStorage.getItem("khatfa_email") || "";
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await readResponseJson(response);
      if (response.ok && Array.isArray(data)) {
        setOrders(data);
        return;
      }

      setOrders(userEmail ? getOfflineOrdersByEmail(userEmail) : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      const userEmail = localStorage.getItem("khatfa_email") || "";
      setOrders(userEmail ? getOfflineOrdersByEmail(userEmail) : []);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" style={{ direction: "rtl" }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black cursor-pointer"
      />

      {/* Sidebar Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className={`w-screen max-w-md flex flex-col shadow-2xl h-full transition-colors duration-300 store-sidebar ${
            isDarkMode 
              ? "bg-[#0a0a0a] border-l border-[#2a2a2a] text-white" 
              : "bg-white border-l border-neutral-200 text-neutral-900"
          }`}
        >
          {/* Header */}
          <div className={`px-6 py-5 flex items-center justify-between border-b ${
            isDarkMode ? "border-[#2a2a2a]" : "border-neutral-200"
          }`}>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              <h2 className={`text-lg font-black ${isDarkMode ? "text-white" : "text-neutral-900"}`}>قائمة التحكم للمتجر</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDarkMode 
                  ? "text-gray-400 hover:text-white hover:bg-white/10" 
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {isAuthenticated ? (
              <>
                {/* 1. Account Info Section */}
                <div className="space-y-4">
                  <div className={`flex items-center gap-2 pb-2 border-b ${
                    isDarkMode ? "border-[#1f1f1f]" : "border-neutral-200"
                  }`}>
                    <User className="w-4.5 h-4.5 text-blue-400" />
                    <h3 className={`text-sm font-bold ${isDarkMode ? "text-gray-400" : "text-neutral-500"}`}>معلومات الحساب</h3>
                  </div>
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isDarkMode 
                      ? "bg-[#111111] border-[#1f1f1f]" 
                      : "bg-neutral-50 border-neutral-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-neutral-500"}`}>البريد الإلكتروني:</span>
                      <span className={`text-xs font-mono font-bold ${isDarkMode ? "text-white" : "text-neutral-900"}`}>{email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-neutral-500"}`}>حالة الحساب:</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                        isDarkMode 
                          ? "text-green-400 bg-green-500/10" 
                          : "text-green-700 bg-green-100"
                      }`}>
                        <CheckCircle2 className="w-3 h-3" /> نشط وموثق
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. My Orders Section */}
                <div className="space-y-4">
                  <div className={`flex items-center justify-between pb-2 border-b ${
                    isDarkMode ? "border-[#1f1f1f]" : "border-neutral-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4.5 h-4.5 text-green-400" />
                      <h3 className={`text-sm font-bold ${isDarkMode ? "text-gray-400" : "text-neutral-500"}`}>طلباتي السابقة</h3>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isDarkMode ? "bg-gray-800 text-gray-300" : "bg-neutral-200 text-neutral-700"
                    }`}>
                      {orders.length} طلب
                    </span>
                  </div>

                  {isLoading ? (
                    <div className={`py-12 flex flex-col items-center justify-center gap-3 ${
                      isDarkMode ? "text-gray-400" : "text-neutral-500"
                    }`}>
                      <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
                      <span className="text-xs">جاري جلب الطلبات من الخادم...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className={`py-12 text-center rounded-2xl border border-dashed p-6 space-y-3 ${
                      isDarkMode 
                        ? "bg-[#111111]/30 border-[#2a2a2a]" 
                        : "bg-neutral-50 border-neutral-200"
                    }`}>
                      <ShoppingBag className="w-8 h-8 text-gray-400 mx-auto opacity-50" />
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-neutral-500"}`}>ليس لديك أي طلبات مسجلة بعد.</p>
                      <button
                        onClick={onClose}
                        className="text-xs text-blue-500 hover:underline cursor-pointer font-bold"
                      >
                        ابدأ التسوق الآن
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const orderId = order.id || order._id || "ord-unknown";
                        const dateString = new Date(order.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        });

                        return (
                          <div
                            key={orderId}
                            className={`border rounded-xl p-4 space-y-3 transition-colors ${
                              isDarkMode 
                                ? "bg-[#111111] border-[#1f1f1f] hover:border-gray-800" 
                                : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div className={`flex items-center justify-between text-xs border-b pb-2 ${
                              isDarkMode ? "border-white/5 text-gray-400" : "border-neutral-200/60 text-neutral-500"
                            }`}>
                              <span className="font-mono font-bold">رقم الطلب: #{orderId.slice(-6).toUpperCase()}</span>
                              <span>{dateString}</span>
                            </div>

                            {/* Products inside the order */}
                            <div className="space-y-2">
                              {order.products.map((p, idx) => (
                                <div key={idx} className="flex items-center gap-3 justify-between">
                                  <div className="flex items-center gap-2">
                                    {p.image && (
                                      <img
                                        src={p.image}
                                        alt={p.name}
                                        referrerPolicy="no-referrer"
                                        className={`w-9 h-9 object-cover rounded-lg border shrink-0 ${
                                          isDarkMode ? "border-[#2a2a2a] bg-black" : "border-neutral-200 bg-white"
                                        }`}
                                      />
                                    )}
                                    <div className="text-right">
                                      <p className={`text-xs font-bold line-clamp-1 ${isDarkMode ? "text-white" : "text-neutral-900"}`}>{p.name || "منتج فخم"}</p>
                                      <p className={`text-[10px] ${isDarkMode ? "text-gray-400" : "text-neutral-500"}`}>
                                        الكمية: {p.quantity} × {p.price} ريال
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className={`flex items-center justify-between pt-2 border-t text-xs ${
                              isDarkMode ? "border-white/5" : "border-neutral-200/60"
                            }`}>
                              <span className={isDarkMode ? "text-gray-400" : "text-neutral-500"}>الحالة:</span>
                              <span className={`px-2 py-0.5 rounded-md font-bold ${
                                isDarkMode ? "text-green-400 bg-green-500/10" : "text-green-700 bg-green-100"
                              }`}>مكتمل ومحفوظ</span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className={isDarkMode ? "text-gray-400" : "text-neutral-500"}>الإجمالي:</span>
                              <span className={`text-base ${isDarkMode ? "text-white" : "text-neutral-900"}`}>{order.totalAmount} ريال</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-16 text-center space-y-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border ${
                  isDarkMode 
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                    : "bg-blue-50 text-blue-600 border-blue-200"
                }`}>
                  <User className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className={`font-extrabold text-lg ${isDarkMode ? "text-white" : "text-neutral-900"}`}>لم تقم بتسجيل الدخول</h3>
                  <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isDarkMode ? "text-gray-400" : "text-neutral-500"}`}>
                    يرجى تسجيل الدخول إلى حسابك لعرض تفاصيل الحساب، وإدارة وتتبع طلباتك المحفوظة بشكل دائم على خادمنا.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  تسجيل الدخول الآن
                </button>
              </div>
            )}
          </div>

          {/* Footer / Logout */}
          {isAuthenticated && (
            <div className={`p-6 border-t ${
              isDarkMode ? "border-[#2a2a2a] bg-[#0c0c0c]" : "border-neutral-200 bg-neutral-50"
            }`}>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
                  isDarkMode 
                    ? "bg-red-600/10 hover:bg-red-600 border-red-600/20 hover:border-red-600 text-red-400 hover:text-white" 
                    : "bg-red-50 hover:bg-red-600 border-red-100 hover:border-red-600 text-red-600 hover:text-white"
                }`}
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج من الحساب
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
