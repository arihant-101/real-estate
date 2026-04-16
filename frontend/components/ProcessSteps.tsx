interface ProcessStep {
  title: string;
  description: string;
  icon?: string;
}

interface ProcessStepsProps {
  title: string;
  description?: string;
  steps: ProcessStep[];
  variant?: 'default' | 'numbered' | 'timeline';
}

export default function ProcessSteps({
  title,
  description,
  steps,
  variant = 'numbered'
}: ProcessStepsProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
        
        {/* Steps */}
        <div className="mt-16">
          {variant === 'timeline' ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
              
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <div key={index} className="relative flex gap-6">
                    {/* Timeline dot */}
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-black">
                      {step.icon ? (
                        <span className="text-2xl">{step.icon}</span>
                      ) : (
                        <span className="text-xl font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-white/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step number/icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary">
                    {step.icon ? (
                      <span className="text-2xl text-primary">{step.icon}</span>
                    ) : (
                      <span className="text-xl font-bold text-primary">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Connector line (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-16 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent md:block lg:block" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}