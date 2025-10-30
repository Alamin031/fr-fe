// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  color: {
    type: String,
    trim: true
  },
  storage: {
    type: String,
    trim: true
  },
  RAM: {
    type: String,
    trim: true
  },
  sim: {
    type: String,
    trim: true
  },
  display: {
    type: String,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  dynamicInputs: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Can store strings or numbers
    default: {}
  }
});

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  mobile: {
    type: String,
    required: true,
    match: [/^01[3-9]\d{8}$/, 'Please enter a valid BD mobile number']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  upazila: {
    type: String,
    required: true,
    trim: true
  }
});

const orderSchema = new mongoose.Schema({
  // Customer information
  customer: {
    type: customerSchema,
    required: true
  },
  
  // Order items array
  orderItems: [orderItemSchema],
  
  // Total order amount
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Individual product details (from first order item)
  productName: {
    type: String,
    trim: true
  },
  basePrice: {
    type: Number,
    min: 0
  },
  quantity: {
    type: Number,
    min: 1
  },
  image: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  storage: {
    type: String,
    trim: true
  },
  RAM: {
    type: String,
    trim: true
  },
  sim: {
    type: String,
    trim: true
  },
  dynamicInputs: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Order status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Order metadata
  orderNumber: {
    type: String,
    unique: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp}${random}`;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
orderSchema.index({ 'customer.mobile': 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

// Virtual for formatted order date
orderSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to get order summary
orderSchema.methods.getSummary = function() {
  return {
    orderNumber: this.orderNumber,
    total: this.total,
    status: this.status,
    itemCount: this.orderItems.length,
    customerName: `${this.customer.firstName} ${this.customer.lastName}`
  };
};

module.exports = mongoose.model('Order', orderSchema);
