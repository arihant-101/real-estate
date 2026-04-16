import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { FAQAccordion } from "./FAQAccordion";
import ContactSupportPanel from "@/components/ContactSupportPanel";

export const metadata: Metadata = buildMetadata({
  title: "Property Management FAQs | Landlords & Tenants",
  description:
    "Answers to common questions about renting property, tenant rights, landlord responsibilities, and property management services.",
  path: "/faqs",
});

const faqs = [
  {
    q: "How do I apply for a property with ASTA Property Management?",
    a: "Begin by completing our secure online Rental Application Form, available via the individual listing or on our Tenants page. You’ll be asked for full contact and identification details, proof of employment and income, references from your current or most recent landlord, consent for a credit and affordability check, and proof of Right to Rent. Once information is verified and you meet our criteria, a holding deposit will secure the property while the tenancy agreement is prepared. We typically provide a decision within 1–3 working days.",
  },
  {
    q: "What documents will I receive before moving in?",
    a: "All tenants receive a legally compliant documentation pack, including your signed Assured Shorthold Tenancy Agreement (AST), the latest How to Rent guide, EPC, Gas Safety Certificate, Electrical Installation Condition Report (EICR), and confirmation of your deposit registration with a government-approved scheme, plus emergency contact details and property-specific information. These are provided digitally via our secure portal.",
  },
  {
    q: "What is included in your property management service for tenants?",
    a: "Our full-service tenancy management covers 24/7 maintenance request handling, prompt response from vetted tradespeople, regular inspections with follow-up reports, legal compliance monitoring for safety certifications, secure rent payment systems and arrears monitoring, personalised tenant support, and clear renewal or end-of-tenancy procedures with proper notice periods.",
  },
  {
    q: "What happens if I need to report a maintenance issue?",
    a: "All maintenance issues should be submitted via our Maintenance Request Form through your tenant portal. You’ll be asked to describe the issue clearly and upload photos or a short video, including how long the issue has been present and your preferred access times. For urgent or emergency repairs, you should also call our emergency number provided at move-in. We aim to resolve most issues within 24–72 hours depending on severity.",
  },
  {
    q: "What is the deposit process, and how is my deposit protected?",
    a: "All deposits are held in accordance with the Tenancy Deposit Protection (TDP) scheme. We register your deposit with a government-approved provider, issue a certificate and scheme information, securely store the deposit for the duration of your tenancy, and only make lawful deductions related to rent arrears, damage, or breach of agreement (where applicable). At the end of your tenancy, subject to property condition and cleared rent, deposits are usually returned within 10 days, with access to the scheme’s dispute resolution service if needed.",
  },
  {
    q: "How does ASTA ensure its properties meet safety standards?",
    a: "Every ASTA-managed property must comply with current UK housing legislation. We arrange annual gas safety checks by certified engineers, electrical safety checks (EICR) at least every five years, EPCs with at least the legal minimum rating, smoke alarms on every floor and CO detectors where required, and ensure furniture meets fire safety regulations. Regular inspections and tenant walkthroughs help identify and address risks early.",
  },
  {
    q: "Can I renew my tenancy, and how does the process work?",
    a: "Yes. We usually contact you 8–12 weeks before your tenancy end date to discuss renewal options. If both landlord and tenant agree, we prepare a new fixed-term or periodic contract, update terms including any rental adjustments, and issue revised documentation via your portal. If you plan to move out instead, we’ll guide you through providing notice, checkout inspections, and final steps.",
  },
  {
    q: "Are pets allowed in ASTA-managed properties?",
    a: "Some ASTA properties are pet-friendly, but policies vary by landlord and property. If you have or plan to acquire a pet, let us know at application stage. Where permitted, a Pet Agreement Form may be issued, additional cleaning clauses may apply, and you may need to cover damage beyond fair wear and tear. We’ll help you find a suitable pet-friendly home where possible.",
  },
  {
    q: "What is expected of me at the end of my tenancy?",
    a: "Before you vacate, we’ll provide a Move-Out Checklist. You’ll be expected to return all keys, remove personal belongings, ensure the property is clean with rubbish removed, report any known maintenance issues, provide a forwarding address, and be available for a final inspection. Clear communication helps ensure a fair, stress-free end to your tenancy and timely return of your deposit.",
  },
];

export default function FAQsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="section-heading">Frequently Asked Questions</h1>
      <p className="section-subheading mt-4">
        Common questions from landlords and tenants.
      </p>
      <FAQAccordion items={faqs} />
      <ContactSupportPanel />
    </div>
  );
}
