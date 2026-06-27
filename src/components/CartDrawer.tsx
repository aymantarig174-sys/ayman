import React, { useState } from "react";
import { CartItem, Product } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, ShoppingBag, Plus, Minus, Trash2, CreditCard, ShieldCheck, 
  Smartphone, Wallet, Receipt, Award, CheckCircle2, ShoppingCart, Key,
  Zap, Lightbulb
} from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, q: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenTerms: () => void;
  onPurchaseSuccess?: () => void;
}

type CheckoutStep = 'cart' | 'details' | 'payment' | 'otp' | 'success';
type PaymentMethod = 'applepay' | 'stcpay' | 'visa' | 'mada';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenTerms,
  onPurchaseSuccess
}: CartDrawerProps) {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('applepay');
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [nationalAddress, setNationalAddress] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Card info state (for visa/mada)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [locationName, setLocationName] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationName(`${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
          setIsLocating(false);
          setNationalAddress(`الإحداثيات: ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
        },
        () => {
          alert("تعذر تحديد الموقع. يرجى إدخال الموقع يدوياً.");
          setIsLocating(false);
        }
      );
    } else {
      alert("متصفحك لا يدعم تحديد الموقع.");
      setIsLocating(false);
    }
  };

  const hasLightingProduct = cart.some(item => item.product.category === "lighting");
  const isSubscriptionCart = cart.some(item => item.product.category === "subscriptions" || item.product.isSubscription);
  
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = isSubscriptionCart ? 0 : 0; // VAT 15% removed entirely
  const shipping = isSubscriptionCart ? 0 : 30; // 30 SAR shipping for products
  const total = isSubscriptionCart ? subtotal : subtotal + shipping;

  const handleNextToDetails = () => {
    if (cart.length === 0) return;
    setStep('details');
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubscriptionCart) {
      if (!customerEmail) return;
    } else {
      if (!customerName || !customerPhone || !customerEmail) return;
    }
    setStep('payment');
  };

  const handleConfirmPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    
    const token = localStorage.getItem('khatfa_token');
    if (!token) {
      alert("الرجاء تسجيل الدخول أولاً لإتمام الشراء");
      return;
    }

    setIsProcessing(true);
    
    try {
      const items = cart.map(item => ({ productId: item.product.id, quantity: item.quantity }));
      const response = await fetch('/api/buy', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          items,
          customerName: isSubscriptionCart ? "عميل اشتراكات خطفة" : customerName,
          customerPhone: isSubscriptionCart ? "0500000000" : customerPhone,
          customerEmail,
          nationalAddress: isSubscriptionCart ? "اشتراك رقمي" : (nationalAddress || "غير محدد"),
          shortCode: isSubscriptionCart ? "" : shortCode,
          isSubscription: isSubscriptionCart
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || "حدث خطأ أثناء الشراء");
        setIsProcessing(false);
        return;
      }

      setOrderId(data.orderId || "KTF-" + Math.floor(100000 + Math.random() * 90000));
      setStep('success');
      
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (error) {
      alert("تعذر إتمام عملية الشراء. حاول لاحقاً.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCheckout = () => {
    setStep('cart');
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setNationalAddress("");
    setShortCode("");
    setOtpCode("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
            id="cart-backdrop"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 left-0 w-full md:w-[460px] bg-[#111111] z-50 shadow-2xl flex flex-col font-sans border-r border-[#2a2a2a]"
            id="cart-drawer-panel"
            style={{ direction: "rtl" }}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#0b0b0b]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-amber-500 text-black rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <ShoppingBag className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm md:text-base">السلة</h2>
                  <p className="text-[11px] text-[#a8a8a8] font-mono">{cart.length} {cart.length === 1 ? "عنصر مضاف" : "عناصر مضافة"}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#a8a8a8] hover:text-white p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors"
                id="btn-close-cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Wizard Indicator */}
            <div className="bg-[#0b0b0b] border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between text-xs font-semibold text-[#a8a8a8] select-none">
              <span className={step === 'cart' ? 'text-white' : 'text-[#a8a8a8]'}>السلة</span>
              <span className="text-[#6a6a6a]">←</span>
              <span className={step === 'details' ? 'text-white' : 'text-[#a8a8a8]'}>بيانات التوصيل</span>
              <span className="text-[#6a6a6a]">←</span>
              <span className={step === 'payment' || step === 'otp' ? 'text-white' : 'text-[#a8a8a8]'}>الدفع الآمن</span>
              <span className="text-[#6a6a6a]">←</span>
              <span className={step === 'success' ? 'text-[#10b981]' : 'text-[#a8a8a8]'}>إتمام الطلب</span>
            </div>

            {/* Step Body */}
            <div className="flex-grow overflow-y-auto p-6">
              {/* CART STEP */}
              {step === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-16 h-16 bg-[#0b0b0b] text-[#6a6a6a] rounded-full flex items-center justify-center mb-4 border border-[#2a2a2a]">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-white text-lg mb-1">سلتك فارغة حالياً</p>
                      <p className="text-[#a8a8a8] text-xs mb-6 max-w-xs leading-relaxed">أضف بعض المنتجات الرائعة أو الاشتراكات الذكية وابدأ تجربة تسوق مذهلة!</p>
                      <button
                        onClick={onClose}
                        className="bg-white text-black text-xs font-bold px-6 py-3 rounded-xl hover:bg-gray-200 cursor-pointer"
                        id="btn-back-shopping"
                      >
                        تصفح المنتجات الآن
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-4 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.arabicName}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-xl object-cover border border-[#2a2a2a] shrink-0"
                          />
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{item.product.arabicName}</h4>
                            <span className="text-xs text-[#a8a8a8]">{item.product.category === "lighting" ? "أجهزة إنارة" : "اشتراكات رقمية"}</span>
                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity controls */}
                              <div className="flex items-center gap-2 border border-[#2a2a2a] bg-[#0b0b0b] px-2 py-1 rounded-xl">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="text-[#a8a8a8] hover:text-white p-0.5"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold px-1.5 text-white font-mono">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="text-[#a8a8a8] hover:text-white p-0.5"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="font-extrabold text-sm text-white font-mono">
                                {item.product.price * item.quantity} ريال
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-[#6a6a6a] hover:text-red-500 p-1 rounded-lg self-start transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* DETAILS STEP */}
              {step === 'details' && (
                <form onSubmit={handleNextToPayment} className="space-y-4">
                  {isSubscriptionCart ? (
                    <>
                      <h3 className="font-bold text-white text-base mb-4">بيانات تفعيل الاشتراك ⚡</h3>
                      <div>
                        <label className="block text-xs font-bold text-[#a8a8a8] mb-2">
                          البريد الإلكتروني المخصص لتلقي الفاتورة وتفعيل الاشتراك (إجباري)
                        </label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full bg-[#0b0b0b] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-[#1a1a1a] focus:outline-none transition-all placeholder:text-[#6a6a6a]"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-white text-base mb-4">بيانات التوصيل الشحن 📦</h3>

                      <div>
                        <label className="block text-xs font-bold text-[#a8a8a8] mb-2">الاسم بالكامل (إجباري)</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="عبدالله محمد"
                          className="w-full bg-[#0b0b0b] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-[#1a1a1a] focus:outline-none transition-all placeholder:text-[#6a6a6a]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#a8a8a8] mb-2">رقم الجوال (إجباري)</label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="501234567"
                            className="w-full bg-[#0b0b0b] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm pr-14 font-mono text-white focus:border-blue-500 focus:bg-[#1a1a1a] focus:outline-none transition-all text-left placeholder:text-[#6a6a6a]"
                          />
                          <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[#a8a8a8] font-mono pointer-events-none" style={{ direction: "ltr" }}>
                            +966
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#a8a8a8] mb-2">البريد الإلكتروني لتلقي الفاتورة (إجباري)</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="customer@gmail.com"
                          className="w-full bg-[#0b0b0b] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-[#1a1a1a] focus:outline-none transition-all placeholder:text-[#6a6a6a]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#a8a8a8] mb-2">العنوان الوطني (اختياري)</label>
                        <input
                          type="text"
                          value={nationalAddress}
                          onChange={(e) => setNationalAddress(e.target.value)}
                          placeholder="الرياض، حي النرجس، شارع الملك فهد"
                          className="w-full bg-[#0b0b0b] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-[#1a1a1a] focus:outline-none transition-all placeholder:text-[#6a6a6a]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#a8a8a8] mb-2">الرمز المختصر (اختياري)</label>
                        <input
                          type="text"
                          value={shortCode}
                          onChange={(e) => setShortCode(e.target.value)}
                          placeholder="الرمز المختصر (مثال: 1234)"
                          className="w-full bg-[#0b0b0b] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-[#1a1a1a] focus:outline-none transition-all placeholder:text-[#6a6a6a]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#a8a8a8] mb-2">موقع التوصيل التلقائي</label>
                        <button
                          type="button"
                          onClick={handleLocateMe}
                          disabled={isLocating}
                          className="w-full bg-[#1a1a1a] text-white border border-[#2a2a2a] py-3 rounded-xl text-xs font-bold hover:bg-[#242424] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          📍 {isLocating ? "جاري التحديد..." : "حدد موقعي الآن"}
                        </button>
                      </div>

                      <div className="bg-[#0b0b0b] border border-[#2a2a2a] p-4 rounded-2xl flex items-start gap-3 mt-6">
                        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-xs text-white">شحن آمن وسريع</h5>
                          <p className="text-[11px] text-[#a8a8a8] leading-relaxed mt-1">منتجات الإنارة تشحن مجاناً وبسرعة فائقة لجميع مناطق المملكة عبر أفضل شركات الشحن.</p>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-white text-black py-3.5 rounded-xl text-sm font-bold mt-8 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    الانتقال للدفع الآمن
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-full text-[#a8a8a8] hover:text-[#6a6a6a] text-xs py-2 text-center cursor-pointer"
                  >
                    الرجوع لتعديل السلة
                  </button>
                </form>
              )}

              {/* PAYMENT STEP */}
              {step === 'payment' && (
                <form onSubmit={handleConfirmPayment} className="space-y-6">
                  <h3 className="font-bold text-white text-base">بيانات الدفع والتأكيد 💳</h3>

                  <div className="p-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto relative">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs leading-relaxed text-[#a8a8a8] font-medium">بوابة دفع آمنة ومشفرة. لا يتم حفظ بيانات بطاقتك لدينا.</p>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input 
                      type="checkbox" 
                      id="terms-checkbox" 
                      required 
                      className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] checked:bg-blue-500 cursor-pointer"
                    />
                    <label htmlFor="terms-checkbox" className="text-xs text-[#a8a8a8] cursor-pointer">
                      أوافق على <button type="button" onClick={onOpenTerms} className="text-blue-500 hover:underline">الشروط والأحكام</button>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-white text-black py-3.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? "جاري التحقق الآمن..." : (isSubscriptionCart ? "ادفع الآن" : "تأكيد الدفع والمجموع")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(hasLightingProduct ? 'details' : 'cart')}
                    className="w-full text-[#a8a8a8] hover:text-[#6a6a6a] text-xs py-1 text-center cursor-pointer"
                  >
                    الرجوع لتعديل الطلب
                  </button>
                </form>
              )}

              {/* OTP STEP */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-6 text-center py-6">
                  <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">أدخل رمز الأمان المؤقت 🔒</h3>
                    <p className="text-xs text-[#a8a8a8] mt-2 leading-relaxed">أرسلنا رمز تحقق SMS مؤلف من 4 أرقام لرقم الجوال الخاص بك لإتمام عملية الشراء الآمنة.</p>
                  </div>

                  <div className="max-w-xs mx-auto">
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="• • • •"
                      className="w-full text-center bg-[#0b0b0b] border border-[#2a2a2a] rounded-2xl px-4 py-4 text-2xl font-black font-mono tracking-widest focus:bg-[#1a1a1a] focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-[#6a6a6a]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || otpCode.length < 4}
                    className="w-full bg-white text-black py-3.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? "جاري معالجة الطلب..." : "تأكيد الطلب نهائياً"}
                  </button>

                  <p className="text-xs text-[#a8a8a8]">
                    لم يصلك الرمز؟ <button type="button" className="text-blue-500 font-bold hover:underline cursor-pointer">إعادة الإرسال</button>
                  </p>
                </form>
              )}

              {/* SUCCESS STEP */}
              {step === 'success' && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 bg-[#10b981]/10 text-[#10b981] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#10b981]/20">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl">يا هلا والله! تم تأكيد طلبك بنجاح! 🎉</h3>
                    <p className="text-xs text-[#a8a8a8] leading-relaxed mt-2">تسلم يدينك يا غالي، جاري معالجة طلبك الآن وتجهيز التفعيل الفوري لاشتراكاتك وشحن منتجات الإنارة لمنزلك.</p>
                  </div>

                  {/* Mock Invoice Receipt */}
                  <div className="bg-[#0b0b0b] rounded-2xl p-5 text-right space-y-3.5 border border-[#2a2a2a]">
                    <div className="flex justify-between text-xs border-b border-[#2a2a2a] pb-2.5 font-bold text-white">
                      <span>تفاصيل الفاتورة الإلكترونية</span>
                      <Receipt className="w-4 h-4 text-[#a8a8a8]" />
                    </div>
                    <div className="flex justify-between text-xs text-[#a8a8a8]">
                      <span>رقم الطلب:</span>
                      <span className="font-mono font-bold text-white">{orderId}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#a8a8a8]">
                      <span>اسم العميل:</span>
                      <span className="font-bold text-white">{customerName || "عميل متجر خطفة"}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#a8a8a8]">
                      <span>حالة الشحن والتفعيل:</span>
                      <span className="text-blue-500 font-bold">جاري المزامنة فورا ⚡</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#a8a8a8] border-t border-[#2a2a2a] pt-2.5">
                      <span>طريقة الدفع:</span>
                      <span className="font-semibold text-white">
                        {payMethod === 'applepay' && "Apple Pay"}
                        {payMethod === 'stcpay' && "stc pay"}
                        {payMethod === 'visa' && "Visa Card"}
                        {payMethod === 'mada' && "بطاقة مدى"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-white border-t border-[#2a2a2a] pt-2.5">
                      <span>المبلغ الإجمالي المدفوع:</span>
                      <span>{total} ريال</span>
                    </div>
                  </div>

                  <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-2xl p-4 flex items-start gap-3 text-right">
                    <Award className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-[#f59e0b]">شكر ومكافأة! 🌟</h5>
                      <p className="text-[11px] text-[#f59e0b]/80 leading-relaxed mt-1">حصلت على 50 نقطة مكافأة في محفظتك لاستخدامها بخصومات رائعة في مشترياتك القادمة من خطفة.</p>
                    </div>
                  </div>

                  <button
                    onClick={resetCheckout}
                    className="w-full bg-white text-black py-3.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    الرجوع للمتجر للتسوق
                  </button>
                </div>
              )}
            </div>

            {/* Cart Calculations Summary Footer (Only for Cart, Details, and Payment states) */}
            {step !== 'success' && step !== 'otp' && cart.length > 0 && (
              <div className="p-6 border-t border-[#2a2a2a] bg-[#0b0b0b] space-y-4 shrink-0">
                <div className="space-y-2 text-sm text-[#a8a8a8]">
                  {isSubscriptionCart ? (
                    <div className="flex justify-between text-base font-black text-white py-1">
                      <span>المبلغ الإجمالي:</span>
                      <span className="text-xl font-black text-white font-mono">{total} ريال</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>المجموع الفرعي:</span>
                        <span className="font-bold text-white font-mono">{subtotal} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span>رسوم الشحن:</span>
                        <span className="font-bold text-white font-mono">30 ريال</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-white border-t border-[#2a2a2a] pt-3 mt-1">
                        <span>المبلغ الإجمالي:</span>
                        <span className="text-xl font-black text-white font-mono">{total} ريال</span>
                      </div>
                    </>
                  )}
                </div>

                {step === 'cart' && (
                  <button
                    onClick={handleNextToDetails}
                    className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    id="btn-checkout-cart"
                  >
                    {isSubscriptionCart ? "ادفع الآن" : "إتمام الشراء والطلب"}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
