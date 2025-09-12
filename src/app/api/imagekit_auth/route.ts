import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string,
});

export async function POST(req: Request) {
  try {
    const { file, fileName } = await req.json();

    if (!file || !fileName) {
      return NextResponse.json({ error: "Missing file or fileName" }, { status: 400 });
    }

    const response = await imagekit.upload({ file, fileName });

    return NextResponse.json(response);
  } catch (error: unknown) {
    // Safely handle unknown error
    let message = "Unknown error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
