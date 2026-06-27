import { useState, useEffect, useRef } from "react";
import { Product, CartItem, Category, Review } from "./types";
import { 
  ShoppingBag, Star, Info, Moon, Sun, ArrowLeft, ArrowRight,
  ShieldCheck, HelpCircle, Truck, Phone, Mail, Instagram, Twitter, LogOut, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "./components/ProductCard";
import AIChatBot from "./components/AIChatBot";
import CartDrawer from "./components/CartDrawer";
import ProductDetailsModal from "./components/ProductDetailsModal";
import TermsModal from "./components/TermsModal";
import AuthModal from "./components/AuthModal";

const KhatafaLogo = ({ className = "h-16" }: { className?: string }) => (
  <svg viewBox="20 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Baseline */}
    <path d="M 250 75 L 140 75" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
    
    {/* خ */}
    <path d="M 260 45 C 285 45 290 55 250 75" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
    <circle cx="270" cy="18" r="9" fill="currentColor" />

    {/* ط */}
    <path d="M 230 75 C 230 40 185 40 185 75" stroke="currentColor" strokeWidth="16" />
    <path d="M 185 10 L 185 75" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />

    {/* ف */}
    <circle cx="130" cy="60" r="15" stroke="currentColor" strokeWidth="16" />
    <circle cx="130" cy="18" r="9" fill="currentColor" />

    {/* Speed Lines */}
    <path d="M 105 45 L 85 45" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M 108 55 L 75 55" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M 105 65 L 80 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    
    {/* Broken baseline */}
    <path d="M 115 75 L 65 75" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
    <path d="M 125 75 L 122 75" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />

    {/* ة */}
    <path d="M 70 75 L 60 75 C 35 75 35 40 55 40 C 75 40 75 60 70 75" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="45" cy="16" r="8" fill="currentColor" />
    <circle cx="65" cy="16" r="8" fill="currentColor" />
  </svg>
);

// Pre-defined Products
const PRODUCTS: Product[] = [
  {
    id: "star-projector",
    name: "اضاءة النجوم والمجرات",
    arabicName: "اضاءة النجوم والمجرات",
    category: "lighting",
    price: 156,
    originalPrice: 200,
    image: "/src/assets/images/galaxy_projector_thumbnail_1782560416265.jpg",
    gallery: [
      "/src/assets/images/galaxy_projector_thumbnail_1782560416265.jpg",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80",
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80",
      "https://images.unsplash.com/photo-1446776811953-b23d5734c1b6?w=500&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80"
    ],
    variants: [
      { id: "v1", name: "24 قرص", price: 156 },
      { id: "v2", name: "12 قرص خيار (أ)", price: 130 },
      { id: "v3", name: "12 قرص خيار (ب)", price: 130 },
      { id: "v4", name: "10 أقراص", price: 120 },
      { id: "v5", name: "6 أقراص", price: 90 },
      { id: "v6", name: "3 أقراص خيار (أ)", price: 60 },
      { id: "v7", name: "3 أقراص خيار (ب)", price: 60 }
    ],
    description: "وفرنا لكم جهاز عرض نجوم ومجرات بخيارات أقراص متعددة لأجواء هادئة ومميزة.",
    arabicDescription: "وفرنا لكم جهاز عرض نجوم ومجرات بخيارات أقراص متعددة لأجواء هادئة ومميزة.",
    features: [
      "جودة عرض مذهلة وتأثير واقعي",
      "أجواء هادئة ومريحة",
      "تشغيل سهل عبر USB",
      "خيارات متعددة للأقراص"
    ],
    arabicFeatures: [
      "جودة عرض مذهلة وتأثير واقعي",
      "أجواء هادئة ومريحة",
      "تشغيل سهل عبر USB",
      "خيارات متعددة للأقراص"
    ],
    rating: 5,
  },
  {
    id: "tv-lighting",
    name: "الإنارة التفاعلية",
    arabicName: "الإنارة التفاعلية",
    category: "lighting",
    price: 159,
    image: "/src/assets/images/ambient_tv_lighting_1782560430963.jpg",
    description: "وفرنا لكم إضاءة خلفية تفاعلية للتلفزيون بتجربة مناسبة للأفلام والألعاب.",
    arabicDescription: "وفرنا لكم إضاءة خلفية تفاعلية للتلفزيون بتجربة مناسبة للأفلام والألعاب.",
    features: [
      "تقنية RGBIC Color Sync",
      "تفاعل مع الألوان والصوت",
      "دعم تطبيق الجوال",
      "مثالي لغرف الألعاب والسينما المنزلية"
    ],
    arabicFeatures: [
      "تقنية RGBIC Color Sync",
      "تفاعل مع الألوان والصوت",
      "دعم تطبيق الجوال",
      "مثالي لغرف الألعاب والسينما المنزلية"
    ],
    rating: 5,
  },
  {
    id: "youtube-1y",
    name: "اشتراك YouTube - سنة",
    arabicName: "اشتراك YouTube - سنة كاملة",
    category: "subscriptions",
    price: 190,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&q=80",
    description: "مدة سنة كاملة، مشاهدة بدون إعلانات وتفعيل عبر الخطوات المرسلة.",
    arabicDescription: "مدة سنة كاملة، مشاهدة بدون إعلانات وتفعيل عبر الخطوات المرسلة.",
    features: [
      "بدون إعلانات تماماً",
      "تشغيل في الخلفية",
      "تنزيل المقاطع",
      "ضمان كامل"
    ],
    arabicFeatures: [
      "بدون إعلانات تماماً",
      "تشغيل في الخلفية",
      "تنزيل المقاطع",
      "ضمان كامل"
    ],
    rating: 5,
    isSubscription: true
  },
  {
    id: "chatgpt-vip",
    name: "اشتراك ChatGPT - VIP",
    arabicName: "اشتراك ChatGPT - VIP",
    category: "subscriptions",
    price: 30,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500&q=80",
    description: "تجربة أفضل وتفعيل سريع للوصول إلى مزايا ChatGPT المتقدمة.",
    arabicDescription: "تجربة أفضل وتفعيل سريع للوصول إلى مزايا ChatGPT المتقدمة.",
    features: [
      "وصول لنموذج ذكاء اصطناعي متقدم",
      "دعم فني طوال مدة الاشتراك",
      "تفعيل سريع"
    ],
    arabicFeatures: [
      "وصول لنموذج ذكاء اصطناعي متقدم",
      "دعم فني طوال مدة الاشتراك",
      "تفعيل سريع"
    ],
    rating: 5,
    isSubscription: true
  },
  {
    id: "gemini-yearly",
    name: "اشتراك Gemini - سنة",
    arabicName: "اشتراك Gemini Google - سنة كاملة",
    category: "subscriptions",
    price: 150,
    originalPrice: 720,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80",
    description: "اشتراك Gemini Advanced حسب الباقة المتاحة، سنة كاملة من الخدمة.",
    arabicDescription: "اشتراك Gemini Advanced حسب الباقة المتاحة، سنة كاملة من الخدمة.",
    features: [
      "Gemini Advanced",
      "سنة كاملة",
      "دعم بعد التفعيل"
    ],
    arabicFeatures: [
      "Gemini Advanced",
      "سنة كاملة",
      "دعم بعد التفعيل"
    ],
    rating: 5,
    isSubscription: true
  },
  {
    id: "canva-pro",
    name: "اشتراك Canva",
    arabicName: "اشتراك Canva",
    category: "subscriptions",
    price: 25,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80",
    description: "مناسب للتصميم والقوالب الجاهزة مع دعم بعد التفعيل.",
    arabicDescription: "مناسب للتصميم والقوالب الجاهزة مع دعم بعد التفعيل.",
    features: [
      "ملايين القوالب",
      "أدوات الذكاء الاصطناعي",
      "تصميم احترافي"
    ],
    arabicFeatures: [
      "ملايين القوالب",
      "أدوات الذكاء الاصطناعي",
      "تصميم احترافي"
    ],
    rating: 5,
    isSubscription: true
  }
];

const REVIEWS: Review[] = [
  { id: '1', name: 'أبو ناصر', rating: 5, comment: 'وصلتني الإضاءة بسرعة، بصراحة شكل النجوم على السقف يفتح النفس.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', reviewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80' },
  { id: '2', name: 'نورة', rating: 5, comment: 'التصوير يعطي شكل خرافي في الغرفة والتمرير بين الأقراص سهل جدًا.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', reviewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
  { id: '3', name: 'فيصل', rating: 5, comment: 'الأجواء صارت أهدأ وأجمل، والمنتج مناسب كهدية فعلًا.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: '4', name: 'ريم', rating: 5, comment: 'الصورة واضحة جدًا وتغطية النجوم ممتازة على السقف.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', reviewImage: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&q=80' },
  { id: '5', name: 'عبدالله', rating: 5, comment: 'كلما غيرت القرص يتغير المشهد بشكل جميل ومرتب.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { id: '6', name: 'سارة', rating: 5, comment: 'مظهر الإضاءة في الليل رائع ويعطي الغرفة طابع خاص.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80', reviewImage: 'https://images.unsplash.com/photo-1531306728370-53779273597c?w=400&q=80' }
];

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('khatfa_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('فشل في جلب المنتجات');
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError("تعذر الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto scroll reviews
  useEffect(() => {
    const scrollContainer = reviewsRef.current;
    if (!scrollContainer) return;

    let isHovered = false;

    const handleMouseEnter = () => isHovered = true;
    const handleMouseLeave = () => isHovered = false;

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    const scrollInterval = setInterval(() => {
      if (!isHovered && scrollContainer) {
        const scrollAmount = window.innerWidth >= 768 ? 374 : 324; // card width + gap (24px)
        
        // Check if we reached the end
        const isAtEnd = Math.abs(scrollContainer.scrollLeft) >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 10;
        
        if (isAtEnd) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // RTL scroll: usually negative left means scrolling to the next item
          scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => {
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(scrollInterval);
    };
  }, []);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("khatfa_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Error loading cart", err);
      }
    }
  }, []);

  // Save cart to local storage on change
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("khatfa_cart", JSON.stringify(newCart));
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const handleAddToCart = (product: Product) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, q: number) => {
    if (q <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updated = cart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: q };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") return true;
    return product.category === selectedCategory;
  });

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#2a2a2a]" style={{ direction: "rtl" }}>
      {/* Dynamic Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("hero")}>
            <div className="relative flex items-center">
              <KhatafaLogo className="h-10 text-white" />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#a8a8a8]">
            <button onClick={() => scrollToSection("categories")} className="hover:text-white transition-colors cursor-pointer">
              الأقسام
            </button>
            <button onClick={() => scrollToSection("products")} className="hover:text-white transition-colors cursor-pointer">
              المنتجات
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="hover:text-white transition-colors cursor-pointer">
              آراء العملاء
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  localStorage.removeItem('khatfa_token');
                  setIsAuthenticated(false);
                }}
                className="p-2.5 bg-[#111111] border border-[#2a2a2a] text-red-400 rounded-full hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 cursor-pointer shadow-md"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5.5 h-5.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="p-2.5 bg-blue-600 border border-blue-500 text-white rounded-full hover:bg-blue-700 transition-all duration-200 cursor-pointer shadow-md"
                title="تسجيل الدخول"
              >
                <User className="w-5.5 h-5.5" />
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-[#111111] border border-[#2a2a2a] text-white rounded-full hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer shadow-md"
              title={isDarkMode ? "الوضع الفاتح" : "الوضع الداكن"}
            >
              {isDarkMode ? <Sun className="w-5.5 h-5.5" /> : <Moon className="w-5.5 h-5.5" />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#111111] border border-[#2a2a2a] text-white rounded-full hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer shadow-md"
              id="nav-cart-btn"
            >
            <ShoppingBag className="w-5.5 h-5.5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#10b981] text-black font-mono text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-[#10b981]"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="max-w-6xl mx-auto px-6 pt-24 pb-24 text-center relative overflow-hidden">
        {/* Subtle decorative blurred cosmic background bubbles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#ffffff]/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Logo large display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mb-6"
          >
            <KhatafaLogo className="h-20 md:h-28 text-white" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#a8a8a8] text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            وفرنا لكم منتجات إضاءة تعطي المكان جو مختلف، ومعها اشتراكات ذكاء اصطناعي وبرامج بشكل مرتب وواضح، بالإضافة لأفضل منتجات الألعاب الرقمية.
          </motion.p>

          {/* Dual Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-4 pt-6"
          >
            <button
              onClick={() => {
                setSelectedCategory("lighting");
                scrollToSection("products");
              }}
              className="px-8 py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              تصفح المنتجات
            </button>
            <button
              onClick={() => {
                setSelectedCategory("subscriptions");
                scrollToSection("products");
              }}
              className="px-8 py-4 bg-[#111111] border border-[#2a2a2a] text-white rounded-2xl font-bold text-sm hover:bg-[#1a1a1a] transition-all cursor-pointer shadow-md active:scale-95"
            >
              تصفح الاشتراكات
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid (الأقسام) */}
      <section id="categories" className="bg-[#0b0b0b] py-24 border-y border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black text-[#6a6a6a] tracking-wider uppercase">الأقسام</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">تسوق حسب القسم</h2>
            <p className="text-sm text-[#a8a8a8]">رتبنا الموقع من الأقسام المطلوبة لراحتكم.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Subscriptions Card */}
            <div 
              onClick={() => {
                setSelectedCategory("subscriptions");
                scrollToSection("products");
              }}
              className="bg-[#111111] rounded-3xl p-6 border border-[#2a2a2a] hover:border-[#3a3a3a] shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#050505] mb-6 border border-[#2a2a2a]">
                <img 
                  src="/src/assets/images/subscriptions_badge_1782560445725.jpg" 
                  alt="الاشتراكات"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white mb-2 transition-colors">الاشتراكات الرقمية</h3>
                <p className="text-sm text-[#a8a8a8]">اشتراكات وبرامج مضمونة وأصلية</p>
              </div>
            </div>

            {/* Interactive Lighting Card */}
            <div 
              onClick={() => {
                setSelectedCategory("lighting");
                scrollToSection("products");
              }}
              className="bg-[#111111] rounded-3xl p-6 border border-[#2a2a2a] hover:border-[#3a3a3a] shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#050505] mb-6 border border-[#2a2a2a]">
                <img 
                  src="/src/assets/images/ambient_tv_lighting_1782560430963.jpg" 
                  alt="الإنارة والديكور"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white mb-2 transition-colors">إضاءة وديكور</h3>
                <p className="text-sm text-[#a8a8a8]">إضاءة تفاعلية ونجوم للمنزل</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Products Section (المنتجات المتوفرة) */}
      <section id="products" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8 border-b border-[#2a2a2a] pb-8">
          <div className="text-right space-y-2 max-w-md">
            <span className="text-xs font-black text-[#6a6a6a] tracking-wider uppercase">الكتالوج</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">المنتجات المتوفرة</h2>
            <p className="text-sm text-[#a8a8a8]">جميع المنتجات المتوفرة لدينا حالياً.</p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-3">
            {[
              { id: "all", label: "الكل" },
              { id: "lighting", label: "إضاءة وديكور" },
              { id: "subscriptions", label: "الاشتراكات الرقمية" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-white text-black shadow-lg"
                    : "bg-[#111111] text-[#a8a8a8] hover:text-white hover:bg-[#1a1a1a] border border-[#2a2a2a]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]"
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="col-span-full flex justify-center items-center h-40">
              <p className="text-red-500 font-bold">{error}</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((prod) => (
                <motion.div key={prod.id} layout>
                  <ProductCard
                    product={prod}
                    onViewDetails={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </section>

      {/* Testimonials Section (ماذا يقول عملاؤنا) */}
      <section id="testimonials" className="bg-[#0b0b0b] py-24 border-y border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black text-[#6a6a6a] tracking-wider uppercase">آراء وتقييمات</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">ماذا يقول عملاؤنا</h2>
            <p className="text-sm text-[#a8a8a8]">تجارب عملائنا المميزة معنا.</p>
          </div>

          <div ref={reviewsRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 hide-scrollbar">
            {REVIEWS.map((rev) => (
              <div 
                key={rev.id}
                className="bg-[#111111] p-6 rounded-3xl border border-[#2a2a2a] shadow-lg space-y-4 flex flex-col justify-between hover:border-[#3a3a3a] transition-colors duration-300 min-w-[300px] md:min-w-[350px] snap-center shrink-0"
                id={`review-card-${rev.id}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <p className="text-[#a8a8a8] text-sm leading-relaxed font-medium whitespace-normal">
                    "{rev.comment}"
                  </p>
                  {rev.reviewImage && (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-[#2a2a2a]">
                      <img 
                        src={rev.reviewImage} 
                        alt="صورة تقييم"
                        referrerPolicy="no-referrer"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 border-t border-[#2a2a2a] pt-4 mt-2">
                  <img 
                    src={rev.avatar} 
                    alt={rev.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-[#2a2a2a] shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                    <span className="text-[10px] text-[#6a6a6a]">عميل موثق لدينا ✅</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info Trust Badges */}
      <section className="py-20 bg-[#050505] border-b border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex items-start gap-5 text-right">
            <div className="w-14 h-14 bg-[#111111] text-white rounded-2xl flex items-center justify-center shrink-0 border border-[#2a2a2a]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">ضمان كامل وآمن</h4>
              <p className="text-sm text-[#a8a8a8] mt-2 leading-relaxed">اشتراكاتنا موثقة وبضمان كامل طوال فترة الاشتراك، والمنتجات تشمل ضمان تشغيل متكامل.</p>
            </div>
          </div>
          <div className="flex items-start gap-5 text-right">
            <div className="w-14 h-14 bg-[#111111] text-white rounded-2xl flex items-center justify-center shrink-0 border border-[#2a2a2a]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">شحن وتفعيل سريع</h4>
              <p className="text-sm text-[#a8a8a8] mt-2 leading-relaxed">تفعيل فوري للاشتراكات الرقمية عبر الواتس، وشحن فائق السرعة لمنتجات الإضاءة بالمملكة.</p>
            </div>
          </div>
          <div className="flex items-start gap-5 text-right">
            <div className="w-14 h-14 bg-[#111111] text-white rounded-2xl flex items-center justify-center shrink-0 border border-[#2a2a2a]">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">دعم فني متواصل</h4>
              <p className="text-sm text-[#a8a8a8] mt-2 leading-relaxed">فريق دعم متكامل لخدمتك على مدار الساعة مع مساعد ذكي مدمج ليجيبك في ثوانٍ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0b0b] text-[#a8a8a8] py-20 px-6 font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center text-white">
              <KhatafaLogo className="h-14 text-white" />
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-[#a8a8a8]">
              متجر منتجات مختارة واشتراكات رقمية بتجربة طلب واضحة وآمنة. نعمل على توفير أرقى المنتجات بأفضل أسعار بالمملكة.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-3 bg-[#111111] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a href="#" className="p-3 bg-[#111111] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.282-.346-.086l-6.4 4.024-2.76-.86c-.6-.188-.616-.605.126-.893l10.78-4.155c.498-.184.945.105.78 1.311z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-base">روابط سريعة</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => scrollToSection("hero")} className="hover:text-white transition-colors cursor-pointer">الرئيسية</button></li>
              <li><button onClick={() => { setSelectedCategory("all"); scrollToSection("products"); }} className="hover:text-white transition-colors cursor-pointer">المنتجات</button></li>
              <li><button onClick={() => { setSelectedCategory("subscriptions"); scrollToSection("products"); }} className="hover:text-white transition-colors cursor-pointer">الاشتراكات</button></li>
              <li><button onClick={() => setIsCartOpen(true)} className="hover:text-white transition-colors cursor-pointer">السلة</button></li>
            </ul>
          </div>

          {/* Support and Policies */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-base">الدعم والسياسات</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => setIsTermsOpen(true)} className="hover:text-white transition-colors cursor-pointer">الشروط والأحكام</button></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Rights */}
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-[#2a2a2a] flex items-center justify-center text-xs text-[#6a6a6a] text-center">
          <div>
            © 2026 متجر خطفة. جميع الحقوق محفوظة لـ <span className="text-[#a8a8a8] font-bold">gamezoom.win</span>.
          </div>
        </div>
      </footer>

      {/* Slide-in Cart drawer component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenTerms={() => setIsTermsOpen(true)}
        onPurchaseSuccess={fetchProducts}
      />

      {/* Pop-up Details modal component */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Terms and Conditions Modal */}
      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setIsAuthenticated(true)}
      />

      {/* Floating Arabic Smart Gemini Chatbot Widget */}
      <AIChatBot />
    </div>
  );
}
