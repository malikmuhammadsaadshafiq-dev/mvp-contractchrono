import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const data = await pdf(buffer);
    
    return NextResponse.json({ 
      text: data.text,
      pages: data.numpages,
      info: data.info
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to parse PDF", 
      details: (error as Error).message 
    }, { status: 500 });
  }
}