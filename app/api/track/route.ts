import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  slug: z.string().min(1),
  locale: z.enum(["en", "fr"]),
  pageType: z.enum(["post", "landing", "tag"]),
});

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const body = JSON.parse(text);
    const data = schema.parse(body);

    const { error } = await supabase.from("page_views").insert({
      slug: data.slug,
      locale: data.locale,
      page_type: data.pageType,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
