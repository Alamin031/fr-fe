import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/productmacbookModels";

interface ValidationError extends Error {
  errors: Record<string, { message: string }>;
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();

    // Required fields check
  

    // Ensure SKU is string if provided
    if (body.sku) body.sku = String(body.sku);

    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json({ message: "Product added successfully" }, { status: 201 });
  } catch (error: unknown) {
    console.error("❌ Error adding product:", error);

    // Type guard to check if error is an Error object
    if (error instanceof Error) {
      if ('code' in error && error.code === 11000) {
        return NextResponse.json({ message: "Duplicate SKU" }, { status: 409 });
      }

      if (error.name === "ValidationError") {
        return NextResponse.json(
          { message: "Validation failed", errors: (error as ValidationError).errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: error.message || "Error adding product" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Error adding product" },
      { status: 500 }
    );
  }
}
