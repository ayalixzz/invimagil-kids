interface InvimagilKidsLogoProps {
  /** Logo height in px. All elements scale proportionally. */
  height?: number;
  className?: string;
}

/**
 * Invimágil Kids wordmark — built as HTML+CSS so the browser renders
 * the font natively. Only the mountain/A icon is an inline SVG.
 *
 * Structure: "Invi" (teal) + "m" (green) + [mountain-A] (green) + "gil" (teal)
 *            "Kids" coloured letters below-right.
 */
export default function InvimagilKidsLogo({
  height = 64,
  className = "",
}: InvimagilKidsLogoProps) {
  // Scale everything off height
  const fs   = Math.round(height * 0.62);   // main wordmark font-size (px)
  const kfs  = Math.round(height * 0.36);   // "Kids" font-size (px)
  const mtnW = Math.round(fs * 0.74);       // mountain width
  const mtnH = Math.round(fs * 1.18);       // mountain height (taller than cap-height)

  // "Kids" left offset: visually sits under the "m" → start of "Invi" width
  // Rough em-based estimate: "Invi" ≈ 1.85 × fs
  const kidsLeft = Math.round(fs * 1.82);

  const wordStyle: React.CSSProperties = {
    fontFamily: "var(--font-nunito), Nunito, sans-serif",
    fontWeight: 800,
    fontSize: fs,
    lineHeight: 1,
    display: "inline-block",
  };

  return (
    <div
      className={`inline-flex flex-col select-none ${className}`}
      style={{ height }}
      aria-label="Invimágil Kids"
      role="img"
    >
      {/* ── Row 1: Invi · m · [mountain-A] · gil ──────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
        {/* "Invi" — teal */}
        <span style={{ ...wordStyle, color: "#0091B3" }}>Invi</span>

        {/* "m" — green */}
        <span style={{ ...wordStyle, color: "#8BC53F" }}>m</span>

        {/* Mountain / A replacement — inline SVG */}
        <svg
          viewBox="0 0 32 50"
          width={mtnW}
          height={mtnH}
          aria-hidden="true"
          style={{ flexShrink: 0, marginBottom: 1 }}
        >
          {/* Triangle body (the "A") */}
          <polygon points="16,7 1,47 31,47" fill="#8BC53F" />
          {/* White cutout — simulates the A crossbar */}
          <polygon points="16,27 11,42 21,42" fill="white" />
          {/* Rays at the peak */}
          <g stroke="#8BC53F" strokeWidth="2.2" strokeLinecap="round">
            <line x1="16" y1="5"  x2="16" y2="0"  />
            <line x1="20" y1="7"  x2="23" y2="3"  />
            <line x1="12" y1="7"  x2="9"  y2="3"  />
            <line x1="23" y1="13" x2="27" y2="10" />
            <line x1="9"  y1="13" x2="5"  y2="10" />
          </g>
        </svg>

        {/* "gil" — teal */}
        <span style={{ ...wordStyle, color: "#0091B3" }}>gil</span>
      </div>

      {/* ── Row 2: "Kids" coloured letters ───────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          marginLeft: kidsLeft,
          marginTop: Math.round(height * -0.03),
          gap: 0,
        }}
      >
        {(
          [
            { ch: "K", color: "#8BC53F" },
            { ch: "i", color: "#D80215" },
            { ch: "d", color: "#FFC800" },
            { ch: "s", color: "#003189" },
          ] as const
        ).map(({ ch, color }) => (
          <span
            key={ch}
            style={{
              fontFamily: "var(--font-fredoka), Fredoka One, cursive",
              fontWeight: 700,
              fontSize: kfs,
              color,
              lineHeight: 1,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
