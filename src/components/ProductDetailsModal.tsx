import { Product, ProductVariant } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, CheckCircle, Shield, Sparkles, ShoppingCart, ChevronRight, ChevronLeft } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailsModal({ product, onClose, onAddToCart }: ProductDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      if (product.variants && product.variants.length > 1) {
        setSelectedVariant(null); // Force user to choose!
      } else {
        setSelectedVariant(product.variants?.[0] || null);
      }
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const currentPrice = selectedVariant?.price || product.price;
  const hasDiscount = product.originalPrice && product.originalPrice > currentPrice;
  const images = product.gallery?.length ? product.gallery : [product.image];

  const nextImage = () => {
    const nextIdx = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIdx);
    if (product.variants && product.variants[nextIdx] && product.variants.length <= 1) {
      setSelectedVariant(product.variants[nextIdx]);
    }
  };

  const prevImage = () => {
    const prevIdx = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIdx);
    if (product.variants && product.variants[prevIdx] && product.variants.length <= 1) {
      setSelectedVariant(product.variants[prevIdx]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = touchStartRef.current.x - touch.clientX;
    const diffY = touchStartRef.current.y - touch.clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const diffX = touchStartRef.current.x - touch.clientX;
    const diffY = touchStartRef.current.y - touch.clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      if (diffX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    touchStartRef.current = null;
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

          {/* Left / Top Side: Image - Adjusted to md:w-[42%] for slightly smaller image representation */}
          <div 
            className="md:w-[42%] aspect-4/3 md:aspect-auto md:h-full bg-[#0b0b0b] relative shrink-0 overflow-hidden group"
            style={{ touchAction: "pan-y" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
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

          {/* Right / Bottom Side: Content - Adjusted to md:w-[58%] with slightly larger font sizes */}
          <div className="p-6 md:p-8 md:w-[58%] flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[600px] product-details-scroll-container">
            {/* Close Button Desktop */}
            <button
              onClick={onClose}
              className="hidden md:flex self-start text-[#a8a8a8] hover:text-white p-1 rounded-lg hover:bg-[#242424] transition-all mb-4 cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5.5 h-5.5" />
            </button>

            <div className="flex items-center justify-between gap-2 mb-2 shrink-0 flex-wrap">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-[#a8a8a8] font-black mr-1 details-rating-text">5.0 / 5.0</span>
              </div>
              {product.salesCount && (
                <span className="text-xs md:text-sm font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                  🔥 تم شراءه {product.salesCount} مرة مؤخراً
                </span>
              )}
            </div>

            <h3 className="font-black text-white text-3xl md:text-4xl mb-4 leading-snug shrink-0 details-title">
              {product.arabicName}
            </h3>

            {product.stock !== undefined && (
              <div className="mb-4 shrink-0">
                {product.stock > 0 ? (
                  <span className="text-base bg-green-500/10 text-green-500 px-3.5 py-1.5 rounded-xl font-black inline-block">متوفر: {product.stock} حبة</span>
                ) : (
                  <span className="text-base bg-red-500/10 text-red-500 px-3.5 py-1.5 rounded-xl font-black inline-block">نفدت الكمية</span>
                )}
              </div>
            )}

            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 shrink-0 font-medium details-desc">
              {product.arabicDescription}
            </p>

            {/* Features lists */}
            <div className="space-y-3.5 mb-6 shrink-0">
              <h4 className="text-sm font-black text-[#6a6a6a] uppercase tracking-wider mb-2 shrink-0 details-section-heading">مميزات المنتج ومواصفاته</h4>
              {product.arabicFeatures.map((feat, index) => (
                <div key={index} className="flex items-start gap-3 text-sm md:text-base text-[#d1d1d1] details-feat-item font-semibold">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6 shrink-0">
                <h4 className="text-sm font-black text-[#6a6a6a] uppercase tracking-wider mb-3 details-section-heading">الخيارات المتاحة</h4>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantClick(variant, index)}
                      className={`text-sm px-5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer details-variant-btn ${
                        selectedVariant?.id === variant.id 
                          ? 'bg-white text-black border-white font-extrabold shadow-md' 
                          : 'bg-[#111111] text-[#a8a8a8] border-[#2a2a2a] hover:border-[#6a6a6a] hover:text-white font-bold'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Pricing & Checkout */}
            <div className="pt-5 border-t border-[#2a2a2a] flex items-center justify-between mt-auto shrink-0 details-footer">
              <div>
                <span className="block text-xs text-[#a8a8a8] font-black mb-0.5 details-price-label">السعر الحالي</span>
                <div className="flex flex-col">
                  {hasDiscount ? (
                    <>
                      <span className="relative text-sm text-[#6a6a6a] font-bold inline-block w-fit mb-0.5">
                        كان {product.originalPrice} ريال
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-red-500"
                        />
                      </span>
                      <motion.span 
                        className="text-3xl font-black text-white flex items-baseline gap-0.5 details-price-val"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      >
                        {currentPrice} <span className="text-sm font-normal text-[#a8a8a8] details-currency">ريال</span>
                      </motion.span>
                    </>
                  ) : (
                    <span className="text-3xl font-black text-white font-mono details-price-val">
                      {currentPrice} <span className="text-sm font-bold text-[#a8a8a8] details-currency">ريال</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (product.stock === 0) return;
                  if (product.variants && product.variants.length > 1 && !selectedVariant) {
                    alert("فضلاً اختر أحد الخيارات المتاحة للمنتج أولاً.");
                    return;
                  }
                  
                  const finalProduct = {
                    ...product,
                    price: currentPrice,
                    name: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name,
                    arabicName: selectedVariant ? `${product.arabicName} - ${selectedVariant.name}` : product.arabicName
                  };
                  
                  onAddToCart(finalProduct);
                  onClose();
                }}
                disabled={product.stock === 0}
                className={`text-sm font-black px-6 py-3.5 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 details-add-btn ${product.stock === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 cursor-pointer'}`}
                id={`modal-btn-add-${product.id}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? "نفدت الكمية" : "شراء وإضافة للسلة"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
