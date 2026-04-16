import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holiday Let Management",
  description:
    "Holiday let management for London and West Mersea properties, including licensing, guest experience, and compliance.",
};

export default function HolidayLettingsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative page-banner flex min-h-[60vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/service-holiday-lettings-hero.png)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
        
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 lg:pb-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Holiday Let Management
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
              Whether you're letting a luxury flat in East London or a beachside retreat in West Mersea, our holiday let management service delivers high occupancy, five-star guest reviews, and full regulatory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12">
              We offer
            </h2>
            
            <div className="space-y-4">
              {[
                "Short-let licensing and registration support",
                "Listing creation for Airbnb, Booking.com, and Vrbo",
                "Dynamic pricing and revenue optimisation",
                "Professional cleaning, linen rotation, and guest check-ins",
                "Local regulation compliance, including fire and safety standards",
                "Real-time guest messaging and review management"
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
              We create luxury holiday experiences that protect your property, enhance your returns, and uphold your reputation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}