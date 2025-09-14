import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/productmacbookModels";

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
  } catch (error: any) {
    console.error("❌ Error adding product:", error);

    if (error.code === 11000) {
      return NextResponse.json({ message: "Duplicate SKU" }, { status: 409 });
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Error adding product" },
      { status: 500 }
    );
  }
}
