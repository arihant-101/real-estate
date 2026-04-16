import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = buildMetadata({
  title: "About Our London Property Management Company",
  description:
    "Learn about our London property management company, our mission, values, and experienced team supporting landlords and tenants.",
  path: "/about-us",
});


const TEAM = [
  {
    name: "Theresia Petersen",
    role: "Director",
    bio: "Founder and Director of ASTA Property Management, bringing decades of industry knowledge with a focus on integrity, precision, and long-term client relationships.",
  },
  {
    name: "Misha",
    role: "Senior Property Manager",
    bio: "Oversees day-to-day tenancy management, inspections, and maintenance coordination across London boroughs.",
  },
  {
    name: "Mariia",
    role: "Senior Property Manager",
    bio: "Specialises in complex portfolios, compliance-led processes, and high-standard tenant experiences.",
  },
  {
    name: "Anton",
    role: "Client & Compliance Specialist",
    bio: "Supports landlords with legal documentation, regulatory updates, and clear, proactive client communication.",
  },
];

const VALUES = [
  {
    title: "Transparency in every interaction",
    text: "We prioritise clear communication, straightforward documentation, and honest advice for both landlords and tenants.",
  },
  {
    title: "Proactive, compliant solutions",
    text: "From tenancy agreements to safety certificates, our processes are designed to stay ahead of legal reform and best practice.",
  },
  {
    title: "Exceptional customer care",
    text: "We blend modern digital tools with genuinely personal service, building long-term partnerships based on trust.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with London skyline */}
      <section className="relative page-banner flex min-h-[40vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(/images/about-us-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-14 pt-28 sm:px-6 lg:pb-20">
          <HeroContactMini className="absolute right-4 top-4 sm:right-6 sm:top-6" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            About
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Redefining London
            <br />
            property management
          </h1>
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/80">
            We are not simply caretakers — we are strategic partners helping landlords optimise
            their investments and tenants enjoy secure, well-managed homes across London and
            beyond.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="border-t border-white/5 bg-surface">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6 lg:flex-row lg:py-16">
          {/* Mission / Values */}
          <div className="flex-1 space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-white">Our mission</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                To deliver intelligent, compliant, and human-centred property management across
                London, helping clients maximise returns while minimising risk and stress.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Our values</h2>
              <ul className="mt-4 space-y-4">
                {VALUES.map((v) => (
                  <li key={v.title} className="rounded-xl border border-white/5 bg-panel/60 p-4">
                    <h3 className="text-sm font-semibold text-white">{v.title}</h3>
                    <p className="mt-1 text-sm text-muted">{v.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Team */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">Our team</h2>
            <p className="mt-3 text-sm text-muted">
              Our experienced team combines London market knowledge with a focus on service. We
              look after placements, inspections, maintenance and financial reporting so you can
              focus on the bigger picture.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {TEAM.map((m) => (
                <div
                  key={m.name}
                  className="rounded-xl border border-white/10 bg-panel/70 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.65)]"
                >
                  <h3 className="text-sm font-semibold text-white">{m.name}</h3>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    {m.role}
                  </p>
                  <p className="mt-2 text-xs text-muted">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

