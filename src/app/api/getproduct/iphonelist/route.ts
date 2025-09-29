import { NextResponse } from "next/server";
import Product from "@/models/ProductModels";
import { connect } from "@/dbconfig/dbconfig";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // প্রোডাকশনে নির্দিষ্ট ডোমেইন দিন
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    await connect();
    const products = await Product.find({ accessories: "iphone" });
    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error) {
    console.error(error); // log the actual error
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
