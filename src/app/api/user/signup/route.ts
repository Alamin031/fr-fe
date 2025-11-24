import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/UserModels";
import { sendVerificationEmail, generateVerificationToken, hashToken } from "@/lib/email";

// Define a type for Mongoose errors
interface MongooseError extends Error {
  code?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    await connect();

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const hashedToken = hashToken(verificationToken);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      provider: "credentials",
      verificationToken: hashedToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await user.save();

    // Send verification email
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    const emailSent = await sendVerificationEmail(email, verificationUrl, username);

    if (!emailSent) {
      console.warn("Verification email failed to send, but user was created");
    }

    return NextResponse.json({
      message: "User created successfully. Please check your email to verify your account.",
      userId: user._id.toString(),
      requiresVerification: true,
    });
  } catch (err: unknown) {
    console.error("Signup error:", err);

    const error = err as MongooseError;

    // Handle duplicate key error (e.g., username or email)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Username or email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
