// app/api/getproduct/route.ts  <-- URL: /api/getproduct?name=...
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/ipadproductModels";

let isConnected = false;

export async function GET(req: NextRequest) {
  try {
    if (!isConnected) {
      await connect(); // your dbconfig should handle mongoose.connect
      isConnected = true;
    }
    

    const nameParam = req.nextUrl.searchParams.get("name");
    if (!nameParam) {
      return NextResponse.json({ error: "Missing name param" }, { status: 400 });
    }

    const product = await Product.findOne({  productlinkname: nameParam });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
