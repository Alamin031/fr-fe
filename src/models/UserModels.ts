import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  image?: string;
  role: 'admin' | 'user';
  provider?: 'google' | 'credentials';
  emailVerified?: Date;
  isVerified?: boolean;
  isAdmin?: boolean;
  
  // Email verification
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  
  // Password reset
  forgotPasswordToken?: string | null;
  forgetPasswordTokenExpire?: Date | null;
  verifyToken?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      select: false,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    provider: {
      type: String,
      enum: ['google', 'credentials'],
      default: 'credentials',
    },
    
    // Email verification fields
    emailVerified: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    
    // Password reset fields
    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
      default: null,
    },
    forgetPasswordTokenExpire: {
      type: Date,
      default: null,
    },
    verifyToken: {
      type: String,
      default: null,
    },
    
    // Metadata
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ verificationToken: 1, verificationTokenExpires: 1 });
userSchema.index({ forgotPasswordToken: 1, forgetPasswordTokenExpire: 1 });

// Check if model exists before creating to avoid overwriting
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
