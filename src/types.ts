export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  variants?: ProductVariant[];
  description: string;
  arabicDescription: string;
  features: string[];
  arabicFeatures: string[];
  rating: number;
  isSubscription?: boolean;
  stock?: number;
  salesCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  reviewImage?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
