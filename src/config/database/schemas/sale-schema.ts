import { Schema, model, Document } from 'mongoose';

export interface ISaleMongo extends Document {
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  branch: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new Schema<ISaleMongo>(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    branch: {
    
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const SaleModel = model<ISaleMongo>('Sale', saleSchema);
