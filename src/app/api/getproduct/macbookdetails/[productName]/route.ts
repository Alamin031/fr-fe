import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/productmacbookModels";

// Cache database connection
let isConnected = false;

async function ensureDbConnection() {
  if (!isConnected) {
    await connect();
    isConnected = true;
  }
}

export async function GET(
  req: NextRequest,
  context: { params: { productName: string } }
) {
  try {
    const { productName } = context.params;
    const nameParam = req.nextUrl.searchParams.get("name");
    
    // Use query param if available, otherwise use dynamic param
    const searchSlug = (nameParam || productName).toLowerCase();
    
    // Connect to database (reuses existing connection if available)
    await ensureDbConnection();
    
    // Use lean() for faster queries and select only needed fields
    const product = await Product.findOne({
      $or: [
        { slug: searchSlug },
        { porductlinkname: nameParam }
      ]
    })
    .select('-__v') // Exclude version key if not needed
    .lean() // Returns plain JavaScript object instead of Mongoose document
    .exec();
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Set cache headers for better performance
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}