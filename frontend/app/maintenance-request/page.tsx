import type { Metadata } from "next";
import { MaintenanceForm } from "@/components/forms/MaintenanceForm";
import { buildMetadata } from "@/lib/metadata";
import ContactSupportPanel from "@/components/ContactSupportPanel";

export const metadata: Metadata = buildMetadata({
  title: "Report a Property Maintenance Issue",
  description:
    "Submit maintenance requests quickly through our secure portal and track repair progress for your rental property.",
  path: "/maintenance-request",
});

export default function MaintenanceRequestPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Maintenance Request</h1>
      <p className="mt-4 text-muted">
        Tenants: use this form to report a maintenance issue. We&apos;ll respond and coordinate repairs as needed.
      </p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-panel/60 p-6 shadow-xl shadow-black/40">
        <MaintenanceForm />
      </div>
      <ContactSupportPanel />
    </div>
  );
}
