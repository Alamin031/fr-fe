import { NextResponse } from "next/server";
import Product from "@/models/ProductModels";
import { connect } from "@/dbconfig/dbconfig";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NODE_ENV === "production" 
    ? "https://www.friendstelecom.com.bd" 
    : "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    await connect(); // ✅ make sure it's not creating multiple connections
    const products = await Product.find().lean();
    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
