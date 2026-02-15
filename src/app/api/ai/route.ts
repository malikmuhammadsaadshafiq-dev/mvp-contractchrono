import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, systemPrompt } = await req.json();
  
  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + (process.env.NVIDIA_API_KEY || ""),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2.5",
        messages: [
          { role: "system", content: systemPrompt || "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ result: "AI service error: " + response.status }, { status: 502 });
    }
    
    const data = await response.json();
    const message = data.choices?.[0]?.message;
    const result = message?.content || message?.reasoning_content || "No response";
    
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ result: "Request failed: " + (error as Error).message }, { status: 500 });
  }
}