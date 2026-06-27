import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Product } from "../types";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  // Touch Swipe Gallery Logic
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = touchStartRef.current.x - touch.clientX;
    const diffY = touchStartRef.current.y - touch.clientY;

    // If swipe is mostly horizontal, prevent vertical page scroll
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

    // Detect horizontal swipe with minimum threshold of 30px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      if (diffX > 0) {
        // Swipe left -> Next image (RTL forward)
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swipe right -> Previous image (RTL backward)
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    touchStartRef.current = null;
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="bg-[#111111] rounded-2xl overflow-hidden border border-[#2a2a2a] hover:border-[#3a3a3a] shadow-lg transition-all duration-300 flex flex-col group h-full relative z-10"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Container with Swipe Support */}
      <div 
        className="relative aspect-4/3 overflow-hidden bg-[#0b0b0b] cursor-pointer"
        style={{ touchAction: "pan-y" }} // Block vertical page scroll when swiping horizontally on touch
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onViewDetails({ ...product, image: images[currentImageIndex] })}
      >
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
            خصم {discountPercent}%-
          </div>
        )}
        
        <img
          src={images[currentImageIndex]}
          alt={product.arabicName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
        />

        {/* Left/Right Arrow Overlays (only visible if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80 z-10 cursor-pointer"
              title="الصورة السابقة"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80 z-10 cursor-pointer"
              title="الصورة التالية"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 right-1/2 translate-x-1/2 flex gap-1.5 z-10 bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentImageIndex ? "bg-white scale-125" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-medium z-10">
          {product.category === "lighting" ? "أجهزة إنارة" : "اشتراكات رقمية"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-1 mb-2 flex-wrap">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-[#a8a8a8] mr-1">({product.rating}.0)</span>
          </div>
          {product.salesCount && (
            <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              🔥 مبيعات: {product.salesCount} طلب
            </span>
          )}
        </div>

        <h3 className="font-bold text-lg text-white mb-2 leading-snug">
          {product.arabicName}
        </h3>

        {product.stock !== undefined && (
          <div className="mb-2">
            {product.stock > 0 ? (
              <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-md font-medium inline-block">متوفر: {product.stock} حبة</span>
            ) : (
              <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-md font-medium inline-block">نفدت الكمية</span>
            )}
          </div>
        )}

        <p className="text-[#a8a8a8] text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
          {product.arabicDescription}
        </p>

        {/* Footer with pricing and buttons */}
        <div className="pt-4 border-t border-[#2a2a2a] flex items-center justify-between mt-auto">
          <div>
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="relative text-xs text-[#6a6a6a] font-bold inline-block w-fit mb-0.5">
                    كان {product.originalPrice} ريال
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-red-500"
                    />
                  </span>
                  <motion.span 
                    className="text-xl font-black text-white flex items-baseline gap-0.5"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    {product.price} <span className="text-[10px] font-normal text-[#a8a8a8]">ريال</span>
                  </motion.span>
                </>
              ) : (
                <span className="text-xl font-black text-white">
                  {product.price} <span className="text-xs font-normal text-[#a8a8a8]">ريال</span>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onAddToCart({ ...product, image: images[currentImageIndex] })}
            disabled={product.stock === 0}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm ${product.stock === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 cursor-pointer'}`}
            id={`btn-add-${product.id}`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? "نفدت الكمية" : "إضافة للسلة"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
