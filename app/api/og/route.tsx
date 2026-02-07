import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = decodeURIComponent(
      searchParams.get("title") || "The Debrief"
    );
    const description = decodeURIComponent(
      searchParams.get("description") || "AI news, explained simply."
    );

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            background: "#0c1529",
          }}
        >
          {/* Gradient orbs */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "800px",
              height: "800px",
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)",
              filter: "blur(80px)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30%",
              left: "-10%",
              width: "900px",
              height: "900px",
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
              filter: "blur(80px)",
              display: "flex",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              padding: "80px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex" }} />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "64px",
                  fontWeight: "bold",
                  lineHeight: 1.1,
                  color: "white",
                  display: "flex",
                  letterSpacing: "-0.02em",
                  maxWidth: "900px",
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: "32px",
                  color: "#94a3b8",
                  display: "flex",
                  letterSpacing: "-0.01em",
                  maxWidth: "800px",
                }}
              >
                {description}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "24px",
                color: "#64748b",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#3b82f6" }}>
                The Debrief
              </span>
              <span>— AI news, explained simply.</span>
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
