import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/ProductModels";

// Cache database connection
let isConnected = false;

async function ensureDbConnection() {
  if (!isConnected) {
    await connect();
    isConnected = true;
  }
}

const brandMap: Record<string, string> = {
  iphone: "iPhone",
  samsung: "Samsung",
  google: "Google",
  oneplus: "OnePlus",
};

const deslugifyCache = new Map<string, string>();

const deslugify = (slug: string): string => {
  if (deslugifyCache.has(slug)) {
    return deslugifyCache.get(slug)!;
  }

  const result = slug
    .replace(/-/g, " ")
    .replace(/\b\w+\b/g, (word) => {
      const lowerWord = word.toLowerCase();
      return brandMap[lowerWord] || (word.charAt(0).toUpperCase() + word.slice(1));
    });

  if (deslugifyCache.size < 1000) {
    deslugifyCache.set(slug, result);
  }

  return result;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ productName: string }> } // ⬅ must be Promise
) {
  try {
    // ✅ Await params
    const { productName } = await context.params;

    const name = req.nextUrl.searchParams.get("name");

    // Use query param if exists, otherwise fallback to productName
    const readableName = deslugify(name || productName);

    await ensureDbConnection();
    console.log(readableName)

    const product = await Product.findOne({ name: readableName })
      .select("-__v")
      .lean()
      .exec();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        {
          status: 404,
          headers: {
            "Cache-Control": "public, s-maxage=300",
          },
        }
      );
    }

    return NextResponse.json(product, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
