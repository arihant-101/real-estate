import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Tenant Placement & Referencing Services London",
  description:
    "Professional tenant placement and screening services including referencing, affordability checks, and tenancy onboarding.",
  path: "/services/tenant-placement-screening",
});

export default function TenantPlacementScreeningPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative page-banner flex min-h-[60vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/service-tenant-placement-hero.png)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
        
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 lg:pb-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tenant Placement and Screening
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
              At ASTA, we understand that a successful tenancy starts with the right tenant. Our tenant placement service is comprehensive, ensuring a smooth and secure start to every rental agreement.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12">
              What we offer
            </h2>
            
            <div className="space-y-4">
              {[
                "Professional marketing across high-traffic platforms including Rightmove, Zoopla, and OnTheMarket",
                "High-resolution photography, virtual tours, and SEO-optimised property descriptions",
                "Thorough tenant screening — including ID verification, income checks, previous landlord references, and credit checks",
                "Preparation of compliant tenancy agreements in line with the Housing Act 1988 and the Renters Reform Bill",
                "Coordination of move-in documentation including deposit registration, EPC, EICR, How to Rent guide, and safety certificates"
              ].map((service, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-3"></div>
                  <p className="text-white/90 leading-relaxed text-lg">
                    {service}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-16 sm:py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xl text-white/90 leading-relaxed">
              This process ensures that your property is let quickly, legally, and with minimum risk — protecting your investment from the outset.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}