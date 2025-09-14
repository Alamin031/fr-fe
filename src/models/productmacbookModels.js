import mongoose from "mongoose";

// Sub-schemas
const configSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true }
});

const colorImageConfigSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true }
});

const regionConfigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true }
});

const detailConfigSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const secondConfigSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  seconddetails: { type: String, required: true },
  value: { type: String, required: true }
});

// Main product schema
const macbookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: String, required: true },
  cpuCoreConfigs: [configSchema],
  gpuCoreConfigs: [configSchema],
  storageConfigs: [configSchema],
  ramConfigs: [configSchema],
  displayConfigs: [configSchema],
  colorImageConfigs: [colorImageConfigSchema],
  dynamicRegions: [regionConfigSchema],
  details: [detailConfigSchema],
  secondDetails: [secondConfigSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  accessories: {
    type: String,
    default: "macbook",
  },
  porductlinkname: {
    type: String,
    unique: true,
    sparse: true
  }
});

// Function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-');
}

// Auto-generate porductlinkname before saving
macbookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Only generate porductlinkname if it doesn't exist and name exists
  if (this.name && !this.porductlinkname) {
    this.porductlinkname = generateSlug(this.name);
  }
  
  next();
});

// Auto-generate porductlinkname before updating if name changed
macbookSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  if (update && update.name && !update.porductlinkname) {
    update.porductlinkname = generateSlug(update.name);
  }
  
  next();
});

const Product =
  mongoose.models.macbook || mongoose.model("macbook", macbookSchema);

export default Product;