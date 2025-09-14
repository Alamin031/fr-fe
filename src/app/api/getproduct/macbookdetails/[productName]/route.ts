import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/productmacbookModels";

interface SpecialCases {
  [key: string]: string;
}

export async function GET(
  req: NextRequest,
  context: { params: { productName: string } }
) {
  const { productName } = context.params;
  const nameParam = req.nextUrl.searchParams.get("name");

  console.log("Dynamic param:", productName);
  console.log("Query param:", nameParam);

  // Function to format product name from slug to readable format
  

  // Use query param if available, otherwise use dynamic param
  const inputSlug = nameParam || productName;
  const finalSlug = inputSlug.toLowerCase(); // Ensure consistent slug format

  console.log("Search slug:", finalSlug);

  await connect();

  // Try finding by slug first
  let product = await Product.findOne({ slug: finalSlug });

  if (!product) {
    // fallback to readableName
    product = await Product.findOne({ porductlinkname: nameParam });
  }


  return NextResponse.json(product);
}