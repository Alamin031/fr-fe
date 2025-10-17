import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbconfig/dbconfig';
import Product from '@/models/notifymodel';

export async function GET(req: NextRequest) {

  

  try {
    await connect();
    const product = await Product.find();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
