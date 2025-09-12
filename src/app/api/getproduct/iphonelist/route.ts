import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Product from "@/models/ProductModels";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    await connect();
    const products = await Product.find({ accessories: "iphone" });

    return NextResponse.json(products, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error fetching iPhone products:", error);
    return NextResponse.json(
      { error: "Failed to fetch iPhone products" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Handle preflight CORS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204, // No content
    headers: corsHeaders,
  });
}
