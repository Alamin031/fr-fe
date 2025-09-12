import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/UserModels";

// Define a type for Mongoose errors
interface MongooseError extends Error {
  code?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    await connect();

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    return NextResponse.json({ message: "User created successfully" });
  } catch (err: unknown) {
    console.error(err);

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
