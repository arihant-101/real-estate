import type { Metadata } from "next";
import { TestimonialForm } from "@/components/forms/TestimonialForm";
import { buildMetadata } from "@/lib/metadata";
import { STATIC_TESTIMONIALS } from "@/lib/testimonials";
import HeroContactMini from "@/components/HeroContactMini";

export const metadata: Metadata = buildMetadata({
  title: "Client Reviews | Property Management London",
  description:
    "Read testimonials from landlords and tenants who trust our professional property management services.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero with subtle background */}
      <section className="relative page-banner flex min-h-[35vh] flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage:
              "url(/images/testimonials-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/85 to-black" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-24 sm:px-6 lg:pb-16">
          <HeroContactMini className="absolute right-4 top-4 sm:right-6 sm:top-6" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            Testimonials
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            What our clients say
          </h1>
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/80">
            Our clients are at the heart of everything we do. ASTA Property Management is proud to
            share real stories from landlords and tenants who have experienced our professional,
            reliable, and personal service first-hand. These testimonials reflect the quality, care,
            and attention that define our approach — from long-term lettings to holiday homes and
            full-service property management across London.
          </p>
        </div>
      </section>

      {/* Testimonials + form */}
      <section className="border-t border-white/5 bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div>
              <h2 className="text-xl font-semibold text-white">Client Testimonials</h2>
              <div className="mt-6 space-y-4">
                {STATIC_TESTIMONIALS.map((t) => (
                  <blockquote
                    key={t.name}
                    className="rounded-2xl border border-white/10 bg-panel/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.6)]"
                  >
                    <p className="text-sm text-muted">&ldquo;{t.quote}&rdquo;</p>
                    <footer className="mt-3 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                      <cite className="text-sm font-semibold not-italic text-white">
                        {t.name}
                      </cite>
                      <span className="text-xs uppercase tracking-[0.16em] text-muted">
                        {t.role}
                      </span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-white/10 bg-panel/70 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
              <h2 className="text-lg font-semibold text-white">Share Your Experience</h2>
              <p className="mt-1 text-sm text-muted">
                We value every client and tenant relationship — and your feedback helps us grow,
                improve, and continue delivering exceptional property management across London and
                beyond.
              </p>
              <p className="mt-3 text-sm text-muted">
                If you’ve had a positive experience with ASTA, we’d love to hear from you. Kindly
                use the form below to share your story. Selected testimonials may appear on our
                website or future marketing materials (with your permission, of course).
              </p>
              <div className="mt-4">
                <TestimonialForm />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
