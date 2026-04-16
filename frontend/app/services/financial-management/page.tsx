import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Rental Income & Financial Management Services",
  description:
    "Rent collection, financial reporting, and landlord income management services designed to simplify property ownership.",
  path: "/services/financial-management",
});

export default function FinancialManagementPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative page-banner flex min-h-[60vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/services-financial-management-custom.png)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
        
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 lg:pb-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Financial Management and Reporting
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
              Your property portfolio is an investment — and we treat it as such. ASTA's financial management services are designed for transparency, accuracy, and convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12">
              Our financial services include
            </h2>
            
            <div className="space-y-4">
              {[
                "Monthly rent collection and secure transfers",
                "Digital income and expenditure reports",
                "Automated arrears tracking and formal notices",
                "Year-end statements for tax reporting",
                "Deposit handling in compliance with government regulations",
                "Advice on rental increases and yield optimisation"
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
              All financial data is available through your secure client portal, so you can track performance and plan with confidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}