type HeroContactMiniProps = {
  className?: string;
};

export default function HeroContactMini({ className = "" }: HeroContactMiniProps) {
  return (
    <aside className={`hidden md:block text-right ${className}`} aria-label="Contact details">
      <div className="inline-flex flex-col items-end gap-1 text-sm text-white/90 lg:text-base">
        <a href="mailto:hello@astaone.co.uk" className="inline-flex items-center gap-1.5 hover:text-primary">
          <svg className="h-4 w-4 text-primary/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>hello@astaone.co.uk</span>
        </a>

        <a href="tel:07452766766" className="inline-flex items-center gap-1.5 hover:text-primary">
          <svg className="h-4 w-4 text-primary/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>07452 766766</span>
        </a>

        <p className="inline-flex items-center gap-1.5 text-white/75">
          <svg className="h-4 w-4 text-primary/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Mon-Fri, 9:00 AM-5:30 PM</span>
        </p>
      </div>
    </aside>
  );
}
