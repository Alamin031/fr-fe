import mongoose from "mongoose";

// Schema for DynamicInputItem
const DynamicInputItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true },
});

// Schema for DynamicInputForm
const DynamicInputFormSchema = new mongoose.Schema({
  type: { type: String, required: true },
  items: [DynamicInputItemSchema],
});

// Schema for PreOrderConfig
const PreOrderConfigSchema = new mongoose.Schema({
  isPreOrder: { type: Boolean, default: false },
  availabilityDate: { type: String, default: '' },
  estimatedShipping: { type: String, default: '' },
  preOrderDiscount: { type: Number, default: 0 },
  maxPreOrderQuantity: { type: Number, default: 0 },
});

// Schema for Config (Storage/Variant Configurations)
const ConfigSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: String, required: true },
  shortDetails: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
});

// Schema for ImageConfig
const ImageConfigSchema = new mongoose.Schema({
  image: { type: String, required: true },
  price: { type: String, required: true },
  colorName: { type: String, default: '' },
  colorHex: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
});

// Schema for DetailConfig
const DetailConfigSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

// Schema for RegionConfig (Dynamic Products)
const RegionConfigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true },
});

// Slug generator function
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Main Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: String, required: true },
  storageConfigs: [ConfigSchema],
  imageConfigs: [ImageConfigSchema],
  details: [DetailConfigSchema],
  accessories: { type: String, default: '' },
  accessoriesType: { type: String, default: '' },
  description: { type: String, default: '' },
  dynamicInputs: [DynamicInputFormSchema],
  preOrderConfig: { type: PreOrderConfigSchema, default: {} },
  productlinkname: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Middleware to generate slug before saving
ProductSchema.pre('save', function(next) {
  if (this.name && !this.productlinkname) {
    this.productlinkname = generateSlug(this.name);
  }
  next();
});

// Create and export the Product model
const Product = mongoose.models.accessories1 || mongoose.model("accessories1", ProductSchema);

export default Product;