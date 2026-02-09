import { NextResponse } from "next/server";
import { readdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const AUDIO_DIR = path.join(process.cwd(), "public", "audio");

export async function POST() {
  if (!existsSync(AUDIO_DIR)) {
    return NextResponse.json({ deleted: 0 });
  }

  const files = await readdir(AUDIO_DIR);
  let deleted = 0;

  for (const file of files) {
    if (file.endsWith(".wav")) {
      await unlink(path.join(AUDIO_DIR, file)).catch(() => {});
      deleted++;
    }
  }

  return NextResponse.json({ deleted });
}
