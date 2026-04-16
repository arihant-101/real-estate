interface Feature {
  title: string;
  description: string;
  icon: string;
  image?: string;
}

interface FeatureShowcaseProps {
  title: string;
  description?: string;
  features: Feature[];
  layout?: 'grid' | 'alternating';
  backgroundImage?: string;
}

export default function FeatureShowcase({
  title,
  description,
  features,
  layout = 'grid',
  backgroundImage
}: FeatureShowcaseProps) {
  return (
    <section className="relative py-16 sm:py-20">
      {/* Background */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/95 to-surface" />
        </>
      )}
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-white/80">
              {description}
            </p>
          )}
        </div>
        
        {/* Features */}
        <div className="mt-16">
          {layout === 'alternating' ? (
            <div className="space-y-20">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-12 lg:flex-row lg:items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-2xl text-primary">{feature.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-lg text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Image */}
                  {feature.image && (
                    <div className="flex-1">
                      <div className="relative overflow-hidden rounded-2xl border border-white/10">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="h-64 w-full object-cover sm:h-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-white/20 hover:bg-white/10"
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  
                  <div className="relative">
                    {/* Icon */}
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 transition-colors group-hover:bg-primary/20">
                      <span className="text-2xl text-primary">{feature.icon}</span>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Feature image */}
                    {feature.image && (
                      <div className="mt-6 overflow-hidden rounded-lg">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}