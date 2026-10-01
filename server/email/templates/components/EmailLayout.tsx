import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

/** Brand tokens, inlined: email clients ignore stylesheets and web fonts. */
export const mail = {
  bg: "#F5F6FA",
  surface: "#FFFFFF",
  ink: "#14163A",
  muted: "#585C7E",
  border: "#DADCEB",
  primary: "#2E36A0",
  accent: "#F0B429",
  soft: "#E6E8FA",
  success: "#1F7A55",
  danger: "#B52B43",
  font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'SFMono-Regular', Menlo, Consolas, monospace",
} as const;

export function EmailLayout({ preview, children, appUrl }: { preview: string; children: ReactNode; appUrl: string }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: mail.bg, margin: 0, padding: "24px 12px", fontFamily: mail.font, color: mail.ink }}>
        <Container style={{ maxWidth: 600, margin: "0 auto" }}>
          <Section style={{ backgroundColor: mail.primary, borderRadius: "16px 16px 0 0", padding: "22px 32px" }}>
            <Text style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
              Ọjà <span style={{ color: mail.accent }}>●</span>
            </Text>
          </Section>
          <Section style={{ backgroundColor: mail.surface, border: `1px solid ${mail.border}`, borderTop: 0, borderRadius: "0 0 16px 16px", padding: "32px" }}>
            {children}
          </Section>
          <Section style={{ padding: "20px 8px", textAlign: "center" }}>
            <Text style={{ margin: 0, fontSize: 13, lineHeight: "20px", color: mail.muted }}>
              Ọjà · Handmade goods from Lagos
              <br />
              <a href={`${appUrl}/contact`} style={{ color: mail.muted }}>Contact us</a> ·{" "}
              <a href={`${appUrl}/shipping-returns`} style={{ color: mail.muted }}>Shipping &amp; returns</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const h1 = { margin: "0 0 12px", fontSize: 28, lineHeight: "34px", fontWeight: 700, letterSpacing: "-0.02em", color: mail.ink } as const;
export const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "24px", color: mail.muted } as const;
export const label = { margin: "0 0 4px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: mail.muted } as const;

export function Rule() {
  return <Hr style={{ border: 0, borderTop: `1px solid ${mail.border}`, margin: "24px 0" }} />;
}

export function CtaButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      style={{ display: "inline-block", backgroundColor: mail.primary, color: "#FFFFFF", padding: "14px 28px", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none" }}
    >
      {children}
    </a>
  );
}
