import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Return empty array by default
    // You can connect this to your database later
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
