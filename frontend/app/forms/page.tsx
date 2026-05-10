"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Download, Users, Home, CheckSquare, BookOpen, ClipboardList, Loader2, UserCheck } from "lucide-react";
import ContactSupportPanel from "@/components/ContactSupportPanel";
import { downloadStaticPdfWithTopLeftLogo } from "@/lib/branded-static-pdf-download";
import { downloadHowToRentBrandedPdf } from "@/lib/how-to-rent-pdf";
import { emptyTenantReferencingGoogleStyleForm } from "@/data/tenant-referencing-application-form";
import { downloadTenantReferencingApplicationPdf } from "@/lib/tenant-referencing-application-pdf";

type FormCardDownload =
  | { downloadable: false }
  | {
      downloadable: true;
      downloadKind: "branded-static";
      downloadUrl: string;
      downloadBaseName: string;
    }
  | {
      downloadable: true;
      downloadKind: "how-to-rent-packed";
    }
  | {
      downloadable: true;
      downloadKind: "tenant-referencing";
    };

type FormCard = {
  id: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  category: string;
  href: string;
} & FormCardDownload;

const EMPTY_HOW_TO_RENT_CHECKLIST = {
  beforeStart: false,
  lookingForHome: false,
  foundPlace: false,
  livingInHome: false,
  endOfPeriod: false,
  thingsGoWrong: false,
};

export default function FormsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleCardDownload = async (form: FormCard) => {
    if (!form.downloadable) return;
    setDownloadingId(form.id);
    try {
      if (form.downloadKind === "branded-static") {
        await downloadStaticPdfWithTopLeftLogo(form.downloadUrl, form.downloadBaseName);
      } else if (form.downloadKind === "how-to-rent-packed") {
        await downloadHowToRentBrandedPdf(EMPTY_HOW_TO_RENT_CHECKLIST);
      } else if (form.downloadKind === "tenant-referencing") {
        await downloadTenantReferencingApplicationPdf(emptyTenantReferencingGoogleStyleForm());
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const forms: FormCard[] = [
    {
      id: "how-to-rent",
      title: "How to Rent Guide",
      description:
        "Official How to Rent PDF (England) with ASTA logo on every page. From the form page you can also append your sidebar checklist ticks.",
      icon: BookOpen,
      category: "Guidance",
      href: "/forms/how-to-rent",
      downloadable: true,
      downloadKind: "how-to-rent-packed",
    },
    {
      id: "nrla-checklist",
      title: "NRLA Checklist",
      description:
        "Interactive checklist with PDF download (ASTA logo and your progress). Open the form and use Download PDF.",
      icon: CheckSquare,
      category: "Checklist",
      href: "/forms/nrla-checklist",
      downloadable: false,
    },
    {
      id: "tenant-referencing",
      title: "Tenant Referencing Guide",
      description:
        "Same fields as our Google Residential Tenancy Application. Complete on site, download a branded PDF, or submit on Google when ready.",
      icon: UserCheck,
      category: "Guidance",
      href: "/forms/tenant-referencing",
      downloadable: true,
      downloadKind: "tenant-referencing",
    },
    {
      id: "residential-tenancy-application",
      title: "Residential Tenancy Application",
      description:
        "NRLA-aligned application form with holding deposit acknowledgment (one week's rent). Download merges your answers with the England Holding Deposit Agreement and ASTA branding.",
      icon: ClipboardList,
      category: "Tenancy Agreement",
      href: "/forms/residential-tenancy-application",
      downloadable: false,
    },
    {
      id: "ast-room-only",
      title: "AST Room Only Agreement 2024",
      description:
        "Fill in the wizard on the form page, then Download PDF for a copy of your entries with ASTA branding (not the blank NRLA template).",
      icon: Home,
      category: "Tenancy Agreement",
      href: "/forms/ast-room-only",
      downloadable: false,
    },
    {
      id: "ast-room-instructions",
      title: "AST Room Only Completion Instructions",
      description:
        "NRLA completion instructions PDF with ASTA logo on every page (same document as the official instructions file).",
      icon: FileText,
      category: "Instructions",
      href: "/forms/ast-room-instructions",
      downloadable: true,
      downloadKind: "branded-static",
      downloadUrl: "/asta-forms/NRLA-AST-room-only-completion-instructions-2025.pdf",
      downloadBaseName: "NRLA-AST-room-only-completion-instructions-2025",
    },
    {
      id: "joint-ast-instructions",
      title: "Joint AST Completion Instructions",
      description:
        "NRLA joint AST completion instructions PDF with ASTA logo on every page (same document as the official instructions file).",
      icon: FileText,
      category: "Instructions",
      href: "/forms/joint-ast-instructions",
      downloadable: true,
      downloadKind: "branded-static",
      downloadUrl: "/asta-forms/NRLA-joint-AST-completion-instructions-2025.pdf",
      downloadBaseName: "NRLA-joint-AST-completion-instructions-2025",
    },
    {
      id: "joint-ast-agreement",
      title: "Joint AST Agreement",
      description:
        "Complete the joint wizard on the form page, then Download PDF for your filled summary with ASTA branding.",
      icon: Users,
      category: "Tenancy Agreement",
      href: "/forms/joint-ast-agreement",
      downloadable: false,
    },
  ];

  const categories = ["All", "Guidance", "Checklist", "Tenancy Agreement", "Instructions"];

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="section-label">Documentation</p>
          <h1 className="section-heading mt-2">Rental Forms & Documents</h1>
          <p className="section-subheading max-w-3xl mx-auto">
            Access essential rental documents, tenancy agreements, and guidance materials. 
            All forms are compliant with current UK housing legislation and NRLA standards.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium text-white transition hover:border-primary/50 hover:bg-primary/10 ${
                selectedCategory === category
                  ? "border-primary bg-primary/20"
                  : "border-white/20 bg-panel/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Forms Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms
            .filter((form) => selectedCategory === "All" || form.category === selectedCategory)
            .map((form) => {
            const IconComponent = form.icon;
            return (
              <div
                key={form.id}
                className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/50 p-6 transition hover:border-primary/30 hover:bg-panel/70"
              >
                {/* Category Badge */}
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                    {form.category}
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="line-clamp-2 text-lg font-semibold text-white group-hover:text-primary transition">
                  {form.title}
                </h3>
                <p className="mt-2 min-h-[4.5rem] flex-1 text-sm text-elegant-muted leading-relaxed line-clamp-4">
                  {form.description}
                </p>

                {/* Actions */}
                <div className="mt-6 flex shrink-0 items-center gap-3">
                  <Link
                    href={form.href}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-black transition hover:bg-primary-light"
                  >
                    View Form
                  </Link>
                  {form.downloadable ? (
                    <button
                      type="button"
                      onClick={() => handleCardDownload(form)}
                      disabled={downloadingId === form.id}
                      className="rounded-lg border border-white/20 p-2 text-white transition hover:border-primary/50 hover:text-primary disabled:opacity-50"
                      title="Download PDF with logo"
                    >
                      {downloadingId === form.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        <ContactSupportPanel />
      </div>
    </div>
  );
}