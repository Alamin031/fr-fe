import mongoose from 'mongoose';
const { Schema } = mongoose;

// Sub-schema for image configurations
const ImageConfigSchema = new Schema({
  url: { type: String, required: true },
  altText: { type: String, default: '' },
});

// Sub-schema for storage options
const StorageConfigSchema = new Schema({
  type: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
});

// Main Product Schema
const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    basePrice: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    accessories: { type: String },
    accessoriesType: { type: String },
    storageConfigs: [StorageConfigSchema],
    imageConfigs: [ImageConfigSchema],
    dynamicInputs: { type: [Schema.Types.Mixed], default: [] },
    details: { type: [Schema.Types.Mixed], default: [] },
    preOrderConfig: { type: Schema.Types.Mixed, default: null },
    productLinkName: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// --- Slug Generation Middleware ---
function generateSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^a-z0-9-]/g, '')     // Remove all non-alphanumeric (except -)
    .replace(/-+/g, '-')            // Replace multiple - with single -
    .replace(/^-+|-+$/g, '');       // Trim - from start and end
}

// Auto-generate slug before saving
ProductSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.productLinkName) {
    const baseSlug = generateSlug(this.name);
    this.productLinkName = baseSlug;

    // Optional: Ensure uniqueness by appending counter if duplicate
    // (Advanced: use async check in service layer or plugin)
  }
  next();
});

// Optional: Handle Mixed type updates
ProductSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.dynamicInputs || update.details || update.preOrderConfig) {
    this.markModified('dynamicInputs');
    this.markModified('details');
    this.markModified('preOrderConfig');
  }
  next();
});

// Optional: Index for better query performance
ProductSchema.index({ productLinkName: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Export the model
export default ProductSchema;