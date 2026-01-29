import { Schema, model, Document } from 'mongoose';

export interface IProductMongo extends Document {
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  currentStock: number;
  reservedStock: number;
  minStock: number;
  active: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
const productSchema = new Schema<IProductMongo>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    reservedStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ sku: 'text', name: 'text' });

export const ProductModel = model<IProductMongo>('Product', productSchema);

