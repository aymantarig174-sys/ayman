import { Product, ProductVariant } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, CheckCircle, Shield, Sparkles, ShoppingCart, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailsModal({ product, onClose, onAddToCart }: ProductDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setSelectedVariant(product.variants?.[0] || null);
    }
  }, [product]);

  if (!product) return null;

  const currentPrice = selectedVariant?.price || product.price;
  const hasDiscount = product.originalPrice && product.originalPrice > currentPrice;
  const images = product.gallery?.length ? product.gallery : [product.image];

  const nextImage = () => {
    const nextIdx = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIdx);
    if (product.variants && product.variants[nextIdx]) {
      setSelectedVariant(product.variants[nextIdx]);
    }
  };

  const prevImage = () => {
    const prevIdx = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIdx);
    if (product.variants && product.variants[prevIdx]) {
      setSelectedVariant(product.variants[prevIdx]);
    }
  };

  const handleVariantClick = (variant: ProductVariant, index: number) => {
    setSelectedVariant(variant);
    if (index < images.length) {
      setCurrentImageIndex(index);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans" style={{ direction: "rtl" }}>
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black cursor-pointer"
        />

        {/* Modal content card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-[#111111] rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-[#2a2a2a] z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none"
          id={`details-modal-${product.id}`}
        >
          {/* Close Button Mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden bg-black/60 backdrop-blur-md text-white p-2 rounded-full z-20 hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left / Top Side: Image */}
          <div className="md:w-1/2 aspect-4/3 md:aspect-auto md:h-full bg-[#0b0b0b] relative shrink-0 overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                src={images[currentImageIndex]}
                alt={product.arabicName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}

            {hasDiscount && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-sm z-10">
                وفر {Math.round(((product.originalPrice! - currentPrice) / product.originalPrice!) * 100)}%
              </span>
            )}
            <span className="absolute top-4 left-4 md:bottom-4 md:top-auto bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium z-10">
              {product.category === "lighting" ? "أجهزة إنارة ذكية" : "اشتراكات رقمية فخمة"}
            </span>
          </div>

          {/* Right / Bottom Side: Content */}
          <div className="p-6 md:p-8 md:w-1/2 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[600px]">
            {/* Close Button Desktop */}
            <button
              onClick={onClose}
              className="hidden md:flex self-start text-[#a8a8a8] hover:text-white p-1 rounded-lg hover:bg-[#242424] transition-all mb-4"
              title="إغلاق"
            >
              <X className="w-5.5 h-5.5" />
            </button>

            <div className="flex items-center gap-1.5 mb-2 shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-[#a8a8a8] font-bold mr-1">5.0 / 5.0</span>
            </div>

            <h3 className="font-black text-white text-xl md:text-2xl mb-3 leading-snug shrink-0">
              {product.arabicName}
            </h3>

            {product.stock !== undefined && (
              <div className="mb-4 shrink-0">
                {product.stock > 0 ? (
                  <span className="text-xs bg-green-500/10 text-green-500 px-2.5 py-1 rounded-md font-medium inline-block">متوفر: {product.stock} حبة</span>
                ) : (
                  <span className="text-xs bg-red-500/10 text-red-500 px-2.5 py-1 rounded-md font-medium inline-block">نفدت الكمية</span>
                )}
              </div>
            )}

            <p className="text-[#a8a8a8] text-xs md:text-sm leading-relaxed mb-6 shrink-0">
              {product.arabicDescription}
            </p>

            {/* Features lists */}
            <div className="space-y-3 mb-6 shrink-0">
              <h4 className="text-xs font-black text-[#6a6a6a] uppercase tracking-wider mb-2 shrink-0">مميزات المنتج ومواصفاته</h4>
              {product.arabicFeatures.map((feat, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs text-[#d1d1d1]">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6 shrink-0">
                <h4 className="text-xs font-black text-[#6a6a6a] uppercase tracking-wider mb-3">الخيارات المتاحة</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantClick(variant, index)}
                      className={`text-xs px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                        selectedVariant?.id === variant.id 
                          ? 'bg-white text-black border-white font-bold' 
                          : 'bg-[#111111] text-[#a8a8a8] border-[#2a2a2a] hover:border-[#6a6a6a] hover:text-white'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sourcing protection note */}
            <div className="p-3.5 bg-[#171717] border border-[#2a2a2a] rounded-2xl flex items-center gap-2.5 mb-6 shrink-0 text-[11px] text-[#a8a8a8]">
              <Shield className="w-4 h-4 text-white shrink-0" />
              <span>ضمان رسمي كامل طوال فترة الاشتراك أو تشغيل المنتج.</span>
            </div>

            {/* Footer Pricing & Checkout */}
            <div className="pt-5 border-t border-[#2a2a2a] flex items-center justify-between mt-auto shrink-0">
              <div>
                <span className="block text-[10px] text-[#a8a8a8] font-bold mb-0.5">السعر الحالي</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white font-mono">
                    {currentPrice}
                  </span>
                  <span className="text-xs font-bold text-[#a8a8a8]">ريال</span>
                  {hasDiscount && (
                    <span className="text-xs text-[#6a6a6a] line-through mr-1 font-mono">
                      {product.originalPrice} ريال
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (product.stock === 0) return;
                  onAddToCart({ ...product, price: currentPrice, name: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name });
                  onClose();
                }}
                disabled={product.stock === 0}
                className={`text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 ${product.stock === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 cursor-pointer'}`}
                id={`modal-btn-add-${product.id}`}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? "نفدت الكمية" : "شراء وإضافة للسلة"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
