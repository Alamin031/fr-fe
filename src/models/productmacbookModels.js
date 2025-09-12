// models/Product.js
import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  price: { type: String, required: true }
}, { _id: false });

const ColorImageConfigSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true }
}, { _id: false });

const RegionConfigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true }
}, { _id: false });

const DetailConfigSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const SecondDetailConfigSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  seconddetails: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => Date.now().toString()  // Auto-generate SKU
  },
  basePrice: { type: String, required: true },
  coreConfigs: [ConfigSchema],
  storageConfigs: [ConfigSchema],
  ramConfigs: [ConfigSchema],
  displayConfigs: [ConfigSchema],
  colorImageConfigs: [ColorImageConfigSchema],
  dynamicRegions: [RegionConfigSchema],
  details: [DetailConfigSchema],
  secondDetails: [SecondDetailConfigSchema],
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product
