import { Text } from "@react-email/components";
import { CtaButton, EmailLayout, h1, p } from "./components/EmailLayout";

export function Welcome({ firstName, appUrl }: { firstName: string; appUrl: string }) {
  return (
    <EmailLayout appUrl={appUrl} preview="Welcome to Ọjà">
      <Text style={h1}>Welcome, {firstName}.</Text>
      <Text style={p}>
        Thanks for joining Ọjà. We work with dyers, potters and weavers across Nigeria, and everything we sell is made by hand in small batches.
      </Text>
      <Text style={p}>Save pieces you love, check out faster with saved addresses, and follow every order from our studio to your door.</Text>
      <CtaButton href={`${appUrl}/shop`}>Start browsing</CtaButton>
    </EmailLayout>
  );
}
