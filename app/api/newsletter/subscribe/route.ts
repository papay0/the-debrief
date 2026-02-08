import { NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.email(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const apiKey = process.env.KIT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Newsletter service is not configured" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": apiKey,
    },
    body: JSON.stringify({
      email_address: parsed.data.email,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(`Kit API error (${response.status}): ${error}`);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
