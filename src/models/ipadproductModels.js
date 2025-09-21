import mongoose, { Schema } from "mongoose";

// ---------- Sub Schemas ----------

// Storage configuration
const StorageConfigSchema = new Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  price: { type: String, required: true },
  shortDetails: { type: String, default: "" },
  inStock: { type: Boolean, default: true },
});

// Color + Image configuration
const ColorImageConfigSchema = new Schema({
  id: { type: Number, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true },
});

// Sim configuration
const SimConfigSchema = new Schema({
  id: { type: Number, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Wi-Fi', 'Wi-Fi + Cell'],
    default: 'Wi-Fi'
  },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true },
});

// Region-based configuration
const RegionConfigSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true },
});

// Product details (key/value pairs)
const DetailConfigSchema = new Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
});

// Pre-order configuration
const PreOrderConfigSchema = new Schema({
  isPreOrder: { type: Boolean, default: false },
  availabilityDate: { type: String },
  estimatedShipping: { type: String },
  preOrderDiscount: { type: Number, default: 0 },
  maxPreOrderQuantity: { type: Number, default: 0 },
});

// ---------- Main Product Schema ----------
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    basePrice: { type: String, required: true },
    sku: { type: String }, // optional
    accessories: { type: String, default: "iphone" },

    storageConfigs: [StorageConfigSchema],
    colorImageConfigs: [ColorImageConfigSchema],
    simConfigs: [SimConfigSchema], // Added sim configurations
    dynamicRegions: [RegionConfigSchema],
    details: [DetailConfigSchema],

    productlinkname: {
      type: String,
      unique: true,
      sparse: true,
    },

    preOrderConfig: { type: PreOrderConfigSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// ---------- Slug generator ----------
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
}

// ---------- Pre-save hook ----------
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Only generate productlinkname if it doesn't exist and name exists
  if (this.name && !this.productlinkname) {
    this.productlinkname = generateSlug(this.name);
  }

  next();
});

// ---------- Model ----------
const Product =
  mongoose.models.ipadproduct || mongoose.model("ipadproduct", ProductSchema);

export default Product;