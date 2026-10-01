import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rings = [
  { x: 840, y: 150, r: 150 },
  { x: 1090, y: 330, r: 110 },
  { x: 760, y: 470, r: 120 },
  { x: 1010, y: 560, r: 80 },
];

/** Default share card: the adire ring motif on indigo with the wordmark. Pages with their own image (products) override it. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#2E36A0", color: "#F5F6FA", fontFamily: "sans-serif" }}>
        {rings.map((ring, i) => (
          <div key={i} style={{ position: "absolute", left: ring.x - ring.r, top: ring.y - ring.r, width: ring.r * 2, height: ring.r * 2, display: "flex" }}>
            {[1, 0.72, 0.44].map((k, j) => (
              <div key={j} style={{ position: "absolute", left: ring.r * (1 - k), top: ring.r * (1 - k), width: ring.r * 2 * k, height: ring.r * 2 * k, borderRadius: "50%", border: "6px solid rgba(245,246,250,0.28)" }} />
            ))}
            <div style={{ position: "absolute", left: ring.r - ring.r * 0.14, top: ring.r - ring.r * 0.14, width: ring.r * 0.28, height: ring.r * 0.28, borderRadius: "50%", background: "#F0B429" }} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", width: 800 }}>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>{siteConfig.name}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, fontWeight: 700, letterSpacing: -2, whiteSpace: "nowrap" }}>Made by hand,</div>
            <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, fontWeight: 700, letterSpacing: -2, whiteSpace: "nowrap" }}>in small batches.</div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "rgba(245,246,250,0.85)" }}>Handmade goods from Lagos</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
