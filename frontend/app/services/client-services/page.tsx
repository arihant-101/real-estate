import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Services and Compliance",
  description:
    "Licensing, legal documentation, and regulatory support for ASTA landlords, aligned with NRLA standards.",
};

export default function ClientServicesPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative page-banner flex min-h-[60vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/service-client-services-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
        
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 lg:pb-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Client Services and Compliance
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
              Navigating lettings legislation can be complex. ASTA simplifies it.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12">
              We support landlords with
            </h2>
            
            <div className="space-y-4">
              {[
                "Licensing and registration for HMOs, short-lets, and selective schemes",
                "Legal compliance documentation and renewals",
                "Section 8/21 notices and dispute guidance",
                "Tenancy renewals and terminations",
                "GDPR-aligned document handling",
                "NRLA-compliant tenancy agreements and updates"
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
              Our client support team is your expert partner in risk management, always one step ahead of regulatory change.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}