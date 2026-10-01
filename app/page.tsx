'use client'

import SectionBreadcrumb from "@/components/shared/breadcrumb/SectionBreadcrumb";
import LinkButton from "@/components/shared/button/LinkButton";
import Footer from "@/components/shared/Footer";
import PublicNavbar from "@/components/shared/navbar/PublicNavbar";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      <PublicNavbar />
      <section className="page-padding h-screen flex flex-col justify-center gap-10 max-md:items-center max-md:text-center">
        <SectionBreadcrumb title="Healthcare Innovation" />
        <h1 className="font-extrabold max-w-2xl text-9xl text-foreground max-md:text-7xl max-sm:text-5xl">Transform Healthcare Together</h1>
        <p className="text-muted-foreground text-xl max-w-2xl">Medstaq is the unified platform connecting hospitals, doctors, and patients to build the future of digital healthcare.</p>
        <div className="flex items-center gap-4">
          <LinkButton 
            to="#"
            size="lg"
          >
            <p className="text-foreground">Get Started</p>
            <ArrowRight className="h-5 w-5 text-foreground ml-2" />
          </LinkButton>
          <LinkButton 
            to="#"
            variant="outline"
            size="lg"
          >
            <p className="text-foreground">Learn More</p>
          </LinkButton>
        </div>
      </section>

      <section className="page-padding h-screen flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <SectionBreadcrumb title="Our Ecosystem" />
          <h2 className="font-bold text-7xl text-foreground max-md:text-5xl max-sm:text-2xl">Projects Built on Medstaq</h2>
          <p className="text-muted-foreground text-lg">Innovative healthcare solutions powered by our unified platform</p>
        </div>
      </section>

      <section className="page-padding h-[70dvh] flex items-center justify-center">
        <div className="h-[40dvh] p-10 border border-primary rounded-2xl flex flex-col items-center justify-center gap-10 text-center bg-muted/30">
          <h3 className="font-bold text-5xl text-foreground max-md:text-3xl max-sm:text-xl">Ready to Transform Healthcare?</h3>
          <p className="text-muted-foreground text-lg">Join hundreds of healthcare organizations building the future with MedStaq</p>
          <div className="flex items-center gap-4 max-sm:flex-col">
            <LinkButton 
              to="#"
              size="lg"
              className="max-sm:w-full"
            >
              <p className="text-foreground">Contact Us</p>
              <ArrowRight className="h-5 w-5 text-foreground ml-2" />
            </LinkButton>
            <LinkButton 
              to="#"
              variant="outline"
              size="lg"
              className="max-sm:w-full"
            >
              <p className="text-foreground">Schedule Demo</p>
            </LinkButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
