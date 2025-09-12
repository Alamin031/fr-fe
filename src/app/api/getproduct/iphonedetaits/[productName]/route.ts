import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbconfig/dbconfig';
import Product from '@/models/ProductModels';
export async function GET(
  req: NextRequest,
  context: { params: { productName: string } }
) {
  const { productName } = context.params; // direct destructure
  const name = req.nextUrl.searchParams.get("name"); // query param

  console.log("Dynamic param:", productName);
  console.log("Query param:", name);

  // Map of brands with custom capitalization
  const brandMap: Record<string, string> = {
    iphone: "iPhone",
    samsung: "Samsung",
    google: "Google",
    oneplus: "OnePlus",
    // add more as needed
  };

  const deslugify = (slug: string) =>
    slug
      .replace(/-/g, " ")
      .replace(/\b\w+\b/g, (word) => {
        const lowerWord = word.toLowerCase();
        if (brandMap[lowerWord]) return brandMap[lowerWord];
        return word.charAt(0).toUpperCase() + word.slice(1);
      });

  // Use query param if exists, otherwise fallback to productName
  const readableName = deslugify(name || productName);

  console.log("Readable Name:", readableName);

  await connect();

  const product = await Product.findOne({ name: readableName });

  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    product
  );
}
