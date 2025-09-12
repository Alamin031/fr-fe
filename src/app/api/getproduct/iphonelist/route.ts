import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Product from "@/models/ProductModels";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const GET = async () => {
  try {
    await connect();
    const products = await Product.find({ accessories: "iphone" });
    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching iPhone products:", error);
    return NextResponse.json(
      { error: "Failed to fetch iPhone products" },
      { status: 500, headers: corsHeaders }
    );
  }
};

// Handle OPTIONS request (important for preflight CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
