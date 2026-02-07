import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = decodeURIComponent(
      searchParams.get("title") || "The Debrief"
    );
    const description = decodeURIComponent(
      searchParams.get("description") || ""
    );

    // Is this the homepage/default OG (no article title)?
    const isDefault = !searchParams.get("title");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            position: "relative",
            background: "#0a1628",
          }}
        >
          {/* Ambient gradient — fills center for warmth */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "20%",
              width: "900px",
              height: "700px",
              background:
                "radial-gradient(ellipse, rgba(59, 130, 246, 0.18) 0%, transparent 65%)",
              filter: "blur(60px)",
              display: "flex",
            }}
          />
          {/* Edge highlight — top right corner glow */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: "500px",
              height: "500px",
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
              filter: "blur(50px)",
              display: "flex",
            }}
          />

          {/* Content — vertically centered, maximum title prominence */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              padding: "60px 80px",
              justifyContent: "center",
              gap: "0",
            }}
          >
            {/* Brand — small, muted, above the title */}
            <div
              style={{
                display: "flex",
                fontSize: "22px",
                fontWeight: 600,
                color: "#3b82f6",
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                marginBottom: "28px",
              }}
            >
              The Debrief
            </div>

            {/* Title — DOMINANT, fills the card */}
            <div
              style={{
                fontSize: isDefault ? "88px" : title.length > 50 ? "64px" : title.length > 30 ? "76px" : "88px",
                fontWeight: "bold",
                lineHeight: 1.05,
                color: "#ffffff",
                display: "flex",
                letterSpacing: "-0.03em",
                maxWidth: "1050px",
              }}
            >
              {isDefault ? "AI news, explained simply." : title}
            </div>

            {/* Description — only if present and short enough to matter at thumbnail */}
            {!isDefault && description && description.length <= 100 && (
              <div
                style={{
                  fontSize: "30px",
                  color: "#7a8ba8",
                  display: "flex",
                  lineHeight: 1.35,
                  maxWidth: "900px",
                  marginTop: "24px",
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* Bottom bar — thin accent line */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              height: "4px",
              background: "linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #3b82f6 100%)",
              display: "flex",
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
