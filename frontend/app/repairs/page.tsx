import type { Metadata } from "next";
import { RepairsWizard } from "@/components/repairs/RepairsWizard";
import { buildMetadata } from "@/lib/metadata";
import ContactSupportPanel from "@/components/ContactSupportPanel";

export const metadata: Metadata = buildMetadata({
  title: "Report a Repair",
  description:
    "Step-by-step repair reporting for tenants: choose the issue type, your building and room, then submit to our team.",
  path: "/repairs",
});

export default function RepairsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Repairs</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Tenants: use this guided flow to report a repair. You will need to sign in with your tenant account before
        submitting.
      </p>
      <div className="mt-8">
        <RepairsWizard />
      </div>
      <ContactSupportPanel />
    </div>
  );
}
