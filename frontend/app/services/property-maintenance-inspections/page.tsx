import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Property Maintenance & Inspections London",
  description:
    "Reliable property maintenance and inspection services for landlords in London ensuring properties remain safe, compliant, and well maintained.",
  path: "/services/property-maintenance-inspections",
});

export default function PropertyMaintenanceInspectionsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative page-banner flex min-h-[60vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/services-maintenance-inspections-custom.png)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
        
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 lg:pb-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Property Maintenance and Inspections
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
              We manage your property like it's our own. Maintenance, both proactive and responsive, is at the core of a well-managed asset.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12">
              Our maintenance and inspection services include
            </h2>
            
            <div className="space-y-4">
              {[
                "24/7 online tenant maintenance request portal",
                "Pre-vetted local contractors with fast response times",
                "Emergency repair coordination",
                "Bi-annual property inspections with photographic reports",
                "End-of-tenancy maintenance audits",
                "EPC and gas safety scheduling",
                "Digital logs for all works completed for audit and insurance purposes"
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
              By preserving the condition of your property and ensuring tenant satisfaction, we extend the lifecycle of your asset and reduce vacancy rates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}