// models/Order.ts (or Order.js if not using TS)
import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  storage?: string;
  RAM?: string;
  sim?: string;
  display?: string;
  region?: string;
  image?: string;
}

interface ICustomer {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  upazila: string;
}

export interface IOrder extends Document {
  customer: ICustomer;
  orderItems: IOrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  color: String,
  storage: String,
  RAM: String,
  sim: String,
  display: String,
  region: String,
  image: String,
});

const CustomerSchema = new Schema<ICustomer>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { 
    type: String, 
    required: true,
    match: /^01[3-9]\d{8}$/  // BD phone validation
  },
  email: { 
    type: String, 
    required: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  address: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: CustomerSchema, required: true },
    orderItems: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

 const Product = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
 export default Product
