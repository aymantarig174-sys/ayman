import { motion } from "motion/react";
import { Product } from "../types";
import { Star, ShoppingCart, Eye } from "lucide-react";

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
      {/* Product Image Container */}
      <div 
        className="relative aspect-4/3 overflow-hidden bg-[#0b0b0b] cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
            خصم {discountPercent}%-
          </div>
        )}
        <img
          src={product.image}
          alt={product.arabicName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-medium z-10">
          {product.category === "lighting" ? "أجهزة إنارة" : "اشتراكات رقمية"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs text-[#a8a8a8] mr-1">({product.rating}.0)</span>
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
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">
                {product.price} <span className="text-xs font-normal text-[#a8a8a8]">ريال</span>
              </span>
              {hasDiscount && (
                <span className="text-sm text-[#6a6a6a] line-through">
                  {product.originalPrice} ريال
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onAddToCart(product)}
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
