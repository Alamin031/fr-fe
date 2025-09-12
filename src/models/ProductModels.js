// models/Product.js
import mongoose from "mongoose";

// Reusable sub-schema for basic configs
const ConfigSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    label: { type: String, required: true },
    price: { type: String, required: true },
  },
  { _id: false }
);

// Color + image configs
const ColorImageConfigSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
  },
  { _id: false }
);

// Region pricing
const RegionConfigSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
  },
  { _id: false }
);

// Details
const DetailConfigSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);



// Pre-order config
const PreOrderConfigSchema = new mongoose.Schema(
  {
    isPreOrder: { type: Boolean, required: true, default: false },
    availabilityDate: { type: String }, // could also be Date if you prefer
    estimatedShipping: { type: String },
    preOrderDiscount: { type: Number, default: 0 },
    maxPreOrderQuantity: { type: Number, default: 0 },
  },
  { _id: false }
);

// Main Product schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      default: () => Date.now().toString(),
    },
    basePrice: { type: String, required: true },

    // Config groups
    storageConfigs: [ConfigSchema],

    // Colors + images
    colorImageConfigs: [ColorImageConfigSchema],

    // Regions
    dynamicRegions: [RegionConfigSchema],

    // Details
    details: [DetailConfigSchema],

    // Pre-order
    preOrderConfig: PreOrderConfigSchema,
accessories: {
  type: String,
  default: "iphone", // auto defaults to "iphone"
},

},
  { timestamps: true }
);

// Prevent overwrite in dev / hot reload
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
