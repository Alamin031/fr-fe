import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/productmacbookModels";

// Define a more specific error type
interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

interface ValidationError extends Error {
  errors?: Record<string, { message: string }>;
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();

    // If SKU is provided, ensure it's a string
    if (body.sku) body.sku = String(body.sku);

    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json({ message: "Product added successfully" }, { status: 201 });
  } catch (error: unknown) {
    console.error("❌ Error adding product:", error);

    // Type guard for MongoError
    const isMongoError = (err: unknown): err is MongoError => {
      return err instanceof Error && 'code' in err;
    };

    // Type guard for ValidationError
    const isValidationError = (err: unknown): err is ValidationError => {
      return err instanceof Error && 'name' in err && err.name === "ValidationError";
    };

    if (isMongoError(error) && error.code === 11000) {
      return NextResponse.json({ message: "Duplicate SKU" }, { status: 409 });
    }

    if (isValidationError(error)) {
      return NextResponse.json({ 
        message: "Validation failed", 
        errors: error.errors 
      }, { status: 400 });
    }

    // Handle other errors
    if (error instanceof Error) {
      return NextResponse.json({ 
        message: error.message || "Error adding product" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Unknown error occurred" 
    }, { status: 500 });
  }
}