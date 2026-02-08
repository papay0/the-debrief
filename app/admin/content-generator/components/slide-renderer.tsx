// Slide rendering components with inline styles (required for html2canvas export)

export interface SlideData {
  type: "title" | "content" | "cta";
  title?: string;
  description?: string;
  tags?: string[];
  heading?: string;
  bullets?: string[];
  slideNumber?: number;
  totalSlides?: number;
}

// Editorial palette
export const SLIDE_BG = "#FAFAF7";
export const SLIDE_INK = "#1A1A18";
export const SLIDE_MUTED = "#8A8A82";
export const SLIDE_ACCENT = "#2B2B6E";
export const SLIDE_RULE = "#D4D4CC";
export const SERIF = '"Source Serif 4", "Georgia", "Times New Roman", serif';
export const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

export function SlideTitle({ slide }: { slide: SlideData }) {
  const titleLen = slide.title?.length || 0;
  const fontSize = titleLen > 60 ? 66 : titleLen > 45 ? 76 : 84;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: SLIDE_BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px 100px 140px",
        fontFamily: SERIF,
      }}
    >
      {/* Masthead */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 100,
          right: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontFamily: SANS,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: SLIDE_INK,
          }}
        >
          The Debrief
        </div>
        <div
          style={{
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 400,
            color: SLIDE_MUTED,
            letterSpacing: "0.04em",
          }}
        >
          the-debrief.ai
        </div>
      </div>

      {/* Thin rule under masthead */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 100,
          right: 100,
          height: 1,
          background: SLIDE_RULE,
        }}
      />

      {/* Title */}
      <div
        style={{
          fontSize,
          fontWeight: 700,
          color: SLIDE_INK,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          marginBottom: 32,
          maxWidth: 830,
        }}
      >
        {slide.title}
      </div>

      {/* Description */}
      {slide.description && (
        <div
          style={{
            fontSize: 34,
            fontFamily: SANS,
            color: SLIDE_MUTED,
            lineHeight: 1.55,
            maxWidth: 780,
          }}
        >
          {slide.description}
        </div>
      )}

      {/* Tags */}
      {slide.tags && slide.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 44,
          }}
        >
          {slide.tags.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                border: `1px solid ${SLIDE_RULE}`,
                borderRadius: 100,
                fontSize: 20,
                fontFamily: SANS,
                color: SLIDE_MUTED,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          left: 100,
          right: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontFamily: SANS,
            color: SLIDE_MUTED,
            fontWeight: 400,
            letterSpacing: "0.04em",
          }}
        >
          Swipe to read &rarr;
        </div>
        <div style={{ width: 36, height: 2, background: SLIDE_ACCENT }} />
      </div>
    </div>
  );
}

export function SlideContent({ slide }: { slide: SlideData }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: SLIDE_BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px 100px 140px",
        fontFamily: SERIF,
      }}
    >
      {/* Top rule */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 100,
          right: 100,
          height: 1,
          background: SLIDE_RULE,
        }}
      />

      {/* Slide number */}
      <div
        style={{
          fontSize: 14,
          fontFamily: SANS,
          color: SLIDE_MUTED,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          marginBottom: 44,
        }}
      >
        {String(slide.slideNumber).padStart(2, "0")} /{" "}
        {String(slide.totalSlides).padStart(2, "0")}
      </div>

      {/* Heading */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: SLIDE_INK,
          lineHeight: 1.14,
          letterSpacing: "-0.02em",
          marginBottom: 40,
          maxWidth: 800,
        }}
      >
        {slide.heading}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 40,
          height: 2,
          background: SLIDE_ACCENT,
          marginBottom: 40,
        }}
      />

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {slide.bullets?.map((bullet, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: SLIDE_ACCENT,
                marginTop: 18,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 36,
                fontFamily: SANS,
                color: SLIDE_INK,
                lineHeight: 1.55,
                maxWidth: 820,
                opacity: 0.8,
              }}
            >
              {bullet}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          left: 100,
          right: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color: SLIDE_MUTED,
            opacity: 0.6,
          }}
        >
          The Debrief
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: slide.totalSlides || 0 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === slide.slideNumber ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i + 1 === slide.slideNumber ? SLIDE_ACCENT : SLIDE_RULE,
                transition: "width 0.2s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SlideCTA({ slide }: { slide: SlideData }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: SLIDE_BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 100,
        fontFamily: SERIF,
      }}
    >
      {/* Masthead */}
      <div
        style={{
          fontSize: 15,
          fontFamily: SANS,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: SLIDE_INK,
          marginBottom: 64,
        }}
      >
        The Debrief
      </div>

      {/* CTA text */}
      <div
        style={{
          fontSize: 68,
          fontWeight: 700,
          color: SLIDE_INK,
          textAlign: "center" as const,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: 28,
        }}
      >
        Read the
        <br />
        full article
      </div>

      {/* Divider */}
      <div
        style={{
          width: 48,
          height: 2,
          background: SLIDE_ACCENT,
          marginBottom: 32,
        }}
      />

      {/* URL */}
      <div
        style={{
          fontSize: 28,
          fontFamily: SANS,
          color: SLIDE_MUTED,
          fontWeight: 400,
          marginBottom: 56,
          letterSpacing: "0.02em",
        }}
      >
        the-debrief.ai
      </div>

      {/* Arrow up icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `1.5px solid ${SLIDE_RULE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: SLIDE_MUTED,
        }}
      >
        &uarr;
      </div>

      <div
        style={{
          fontSize: 13,
          fontFamily: SANS,
          color: SLIDE_MUTED,
          marginTop: 14,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          opacity: 0.6,
        }}
      >
        Link in bio
      </div>

      {/* Bottom progress dots */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          display: "flex",
          gap: 6,
        }}
      >
        {Array.from({ length: slide.totalSlides || 0 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === slide.slideNumber ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background:
                i + 1 === slide.slideNumber ? SLIDE_ACCENT : SLIDE_RULE,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function SlideRenderer({ slide }: { slide: SlideData }) {
  switch (slide.type) {
    case "title":
      return <SlideTitle slide={slide} />;
    case "content":
      return <SlideContent slide={slide} />;
    case "cta":
      return <SlideCTA slide={slide} />;
  }
}
