import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProperty, getPropertyAvailability } from "@/lib/server-api";
import { MaintenanceForm } from "@/components/forms/MaintenanceForm";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { PropertyMap } from "@/components/PropertyMap";
import { PropertyImageGallery } from "@/components/PropertyImageGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = await getProperty(params.id);
  if (!p) return { title: "Property | ASTA Property Management" };
  return {
    title: `${p.title} | ASTA Property Management`,
    description: p.description ?? undefined,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [property, availability] = await Promise.all([
    getProperty(params.id),
    getPropertyAvailability(params.id),
  ]);
  if (!property) notFound();

  const images = property.images ?? [];
  const availableRanges = availability?.items ?? [];
  const typeLabel =
    property.listingType === "HOLIDAY_LET" ? "Holiday Let" : "For Rent";

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          href="/property-listings"
          className="inline-flex items-center text-sm font-medium text-muted hover:text-white"
        >
          ← Back to listings
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-xl shadow-black/50">
          <div className="relative p-4 pt-4">
            <PropertyImageGallery images={images} title={property.title} />
            <div className="absolute left-6 top-6 flex gap-2">
              {property.isFeatured && (
                <span className="rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-black">
                  Featured
                </span>
              )}
              <span className="rounded-md border border-white/20 bg-overlay/70 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                {typeLabel}
              </span>
            </div>
          </div>

          <div className="border-t border-white/[0.06] p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {property.title}
            </h1>
            <p className="mt-2 text-muted">
              {property.address}, {property.city}
              {property.postCode && ` ${property.postCode}`}
            </p>
            <p className="mt-4 text-3xl font-bold text-white">
              £{Number(property.pricePerMonth).toLocaleString()}
              <span className="text-base font-normal text-muted">/month</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted">
              <span>{property.beds} bedrooms</span>
              <span>{property.baths} bathrooms</span>
              <span>{property.areaSqFt?.toLocaleString()} sq ft</span>
            </div>
            {property.description && (
              <p className="mt-6 leading-relaxed text-muted">
                {property.description}
              </p>
            )}
            {availableRanges.length > 0 && (
              <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <p className="text-sm font-medium text-green-400">Available for booking</p>
                <p className="mt-1 text-sm text-muted">
                  {availableRanges.map((r: { startDate: string; endDate: string }) => `${new Date(r.startDate).toLocaleDateString()} – ${new Date(r.endDate).toLocaleDateString()}`).join(" · ")}
                </p>
              </div>
            )}
          </div>
        </article>

        <PropertyMap
          address={`${property.address}, ${property.city}${property.postCode ? ` ${property.postCode}` : ""}`}
        />

        <section className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-panel/50 p-6">
          <h2 className="text-xl font-semibold text-white">Apply for this property</h2>
          <p className="mt-1 text-sm text-muted">
            Interested in renting? Submit your application and we&apos;ll get back to you.
          </p>
          <ApplicationForm propertyId={property.id} />
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-panel/50 p-6">
          <h2 className="text-xl font-semibold text-white">
            Report a maintenance issue
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tenants: submit a maintenance request for this property.
          </p>
          <MaintenanceForm
            defaultAddress={`${property.address}, ${property.city}`}
            propertyId={property.id}
          />
        </section>
      </div>
    </div>
  );
}
