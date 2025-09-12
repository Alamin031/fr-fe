import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/productmacbookModels";

// Type for Mongoose duplicate key or validation error
interface MongooseError extends Error {
  code?: number;
  name?: string;
  errors?: Record<string, { message: string }>;
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();

    // Ensure SKU is a string if provided
    if (body.sku) body.sku = String(body.sku);

    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json({ message: "Product added successfully" }, { status: 201 });
  } catch (err: unknown) {
    console.error("❌ Error adding product:", err);

    const error = err as MongooseError;

    // Handle Mongoose duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ message: "Duplicate SKU" }, { status: 409 });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }

    // Default error
    return NextResponse.json(
      { message: error.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
