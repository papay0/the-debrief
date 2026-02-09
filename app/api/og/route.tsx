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

    const isDefault = !searchParams.get("title");

    // Adaptive font size based on title length
    const titleSize = isDefault
      ? "82px"
      : title.length > 70
        ? "48px"
        : title.length > 50
          ? "56px"
          : title.length > 30
            ? "66px"
            : "78px";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            position: "relative",
            background: "#FAFAF7",
          }}
        >
          {/* Left accent rule — thick enough to see at thumbnail */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              bottom: "0",
              width: "8px",
              background: "#2B2B6E",
              display: "flex",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              padding: "60px 72px 60px 56px",
              justifyContent: "space-between",
            }}
          >
            {/* Top: Brand — big enough to read at thumbnail */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "52px",
                  height: "52px",
                  borderRadius: "10px",
                  background: "#1b2340",
                  color: "#ffffff",
                  fontSize: "22px",
                  fontWeight: 800,
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  letterSpacing: "-1px",
                }}
              >
                TD
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#1A1A18",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                The Debrief
              </div>
            </div>

            {/* Title — massive, fills the card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: titleSize,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: "#1A1A18",
                  display: "flex",
                  letterSpacing: "-0.03em",
                  maxWidth: "1060px",
                  fontFamily: "Georgia, Times New Roman, serif",
                }}
              >
                {isDefault ? "AI news, explained simply." : title}
              </div>
            </div>

            {/* Bottom: domain — readable at small size */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  color: "#8A8A82",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  letterSpacing: "0.02em",
                  display: "flex",
                }}
              >
                the-debrief.ai
              </div>
            </div>
          </div>
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
