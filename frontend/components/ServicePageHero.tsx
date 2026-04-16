import Link from "next/link";

interface ServicePageHeroProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  stats?: {
    value: string;
    label: string;
  }[];
  ctaText?: string;
  ctaHref?: string;
}

export default function ServicePageHero({
  title,
  subtitle,
  description,
  backgroundImage,
  stats,
  ctaText = "Get Started",
  ctaHref = "/contact-us",
}: ServicePageHeroProps) {
  return (
    <section className="relative page-banner flex min-h-[60vh] flex-col justify-end overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
      
      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:pb-24">
        <div className="max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            {subtitle}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {description}
          </p>
          
          {/* CTA Button */}
          <div className="mt-8">
            <Link href={ctaHref} className="btn-hero">
              {ctaText}
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center sm:text-left">
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wider text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}