import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/dbconfig/dbconfig';
import Product from '@/models/ProductModels';

// Cache database connection
let isConnected = false;

async function ensureDbConnection() {
  if (!isConnected) {
    await connect();
    isConnected = true;
  }
}

// Move constants outside the function to avoid recreation
const brandMap: Record<string, string> = {
  iphone: "iPhone",
  samsung: "Samsung",
  google: "Google",
  oneplus: "OnePlus",
  // add more as needed
};

// Memoize deslugify results for common queries
const deslugifyCache = new Map<string, string>();

const deslugify = (slug: string): string => {
  // Check cache first
  if (deslugifyCache.has(slug)) {
    return deslugifyCache.get(slug)!;
  }

  const result = slug
    .replace(/-/g, " ")
    .replace(/\b\w+\b/g, (word) => {
      const lowerWord = word.toLowerCase();
      return brandMap[lowerWord] || (word.charAt(0).toUpperCase() + word.slice(1));
    });

  // Cache the result (limit cache size to prevent memory issues)
  if (deslugifyCache.size < 1000) {
    deslugifyCache.set(slug, result);
  }

  return result;
};

export async function GET(
  req: NextRequest,
  context: { params: { productName: string } }
) {
  try {
    const { productName } = context.params;
    const name = req.nextUrl.searchParams.get("name");
    
    // Use query param if exists, otherwise fallback to productName
    const readableName = deslugify(name || productName);
    
    // Connect to database (reuses existing connection if available)
    await ensureDbConnection();
    
    // Use lean() and select only needed fields
    const product = await Product.findOne({ name: readableName })
      .select('-__v') // Exclude version key
      .lean() // Returns plain JavaScript object
      .exec();
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, s-maxage=300', // Cache 404s for 5 minutes
          }
        }
      );
    }
    
    // Set cache headers for successful responses
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}