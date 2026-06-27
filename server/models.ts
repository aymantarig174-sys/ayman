import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  arabicName: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  description: { type: String, required: true },
  arabicDescription: { type: String },
  stock: { type: Number, default: 10 },
  image: { type: String },
  gallery: [{ type: String }],
  variants: [{
    id: String,
    name: String,
    price: Number
  }],
  features: [{ type: String }],
  arabicFeatures: [{ type: String }],
  rating: { type: Number, default: 5 },
  isSubscription: { type: Boolean, default: false },
  salesCount: { type: Number, default: 100 }
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Product = mongoose.models.Product || mongoose.model<any>('Product', productSchema);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const User = mongoose.models.User || mongoose.model<any>('User', userSchema);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model<any>('Order', orderSchema);

