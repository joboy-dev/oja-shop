import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const ring = (d: number, w: number) => (
    <div style={{ position: "absolute", left: (180 - d) / 2, top: (180 - d) / 2, width: d, height: d, borderRadius: "50%", border: `${w}px solid #F5F6FA`, display: "flex" }} />
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#2E36A0" }}>
        {ring(132, 8)}
        {ring(78, 8)}
        <div style={{ position: "absolute", left: 69, top: 69, width: 42, height: 42, borderRadius: "50%", background: "#F0B429", display: "flex" }} />
      </div>
    ),
    size,
  );
}
