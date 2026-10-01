"use client";

/** Last-resort boundary: replaces the root layout, so it must bring its own <html> and inline styles. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F5F6FA", color: "#14163A", display: "grid", minHeight: "100dvh", placeItems: "center", textAlign: "center", padding: 24 }}>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#585C7E", fontSize: 18, lineHeight: 1.5 }}>The shop hit an unexpected problem. Please try again.</p>
          <button onClick={reset} style={{ marginTop: 16, background: "#2E36A0", color: "#fff", border: 0, borderRadius: 12, padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
