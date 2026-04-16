"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Download, Users, Home, CheckSquare, BookOpen } from "lucide-react";
import { formatFilenameWithLondonDate } from "@/lib/date-utils";
import ContactSupportPanel from "@/components/ContactSupportPanel";

export default function FormsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const handleDownload = (downloadUrl: string, originalFilename: string) => {
    // Extract the base filename without extension
    const baseName = originalFilename.replace(/\.[^/.]+$/, "");
    const extension = originalFilename.split('.').pop() || 'pdf';
    
    // Create filename with London date
    const filename = formatFilenameWithLondonDate(baseName, extension);
    
    // Create a temporary link element for download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const forms = [
    {
      id: "how-to-rent",
      title: "How to Rent Guide",
      description: "The official checklist for renting in England (October 2023). Essential guidance for tenants on rights, responsibilities, and the rental process.",
      icon: BookOpen,
      category: "Guidance",
      href: "/forms/how-to-rent",
      downloadable: true,
      downloadUrl: "/asta-forms/how-to-rent-october-2023.pdf",
    },
    {
      id: "nrla-checklist",
      title: "NRLA Checklist",
      description: "Comprehensive checklist for landlords and tenants to ensure all requirements are met during the tenancy process.",
      icon: CheckSquare,
      category: "Checklist",
      href: "/forms/nrla-checklist",
      downloadable: true,
      downloadUrl: "/asta-forms/NRLA%20Checklist.docx",
    },
    {
      id: "ast-room-only",
      title: "AST Room Only Agreement 2024",
      description: "Assured Shorthold Tenancy Agreement for room-only lettings. Ideal for HMO properties and shared accommodations.",
      icon: Home,
      category: "Tenancy Agreement",
      href: "/forms/ast-room-only",
      downloadable: true,
      downloadUrl: "/asta-forms/NRLA-AST-room-only-2024.pdf",
    },
    {
      id: "ast-room-instructions",
      title: "AST Room Only Completion Instructions",
      description: "Step-by-step instructions for completing the NRLA AST Room Only agreement (2025 edition).",
      icon: FileText,
      category: "Instructions",
      href: "/forms/ast-room-instructions",
      downloadable: true,
      downloadUrl: "/asta-forms/NRLA-AST-room-only-completion-instructions-2025.pdf",
    },
    {
      id: "joint-ast-instructions",
      title: "Joint AST Completion Instructions",
      description: "Comprehensive guide for completing joint tenancy agreements for multiple tenants (2025 edition).",
      icon: FileText,
      category: "Instructions",
      href: "/forms/joint-ast-instructions",
      downloadable: true,
      downloadUrl: "/asta-forms/NRLA-joint-AST-completion-instructions-2025.pdf",
    },
    {
      id: "joint-ast-agreement",
      title: "Joint AST Agreement",
      description: "Joint Assured Shorthold Tenancy Agreement for families, couples, and individuals sharing entire properties.",
      icon: Users,
      category: "Tenancy Agreement",
      href: "/forms/joint-ast-agreement",
      downloadable: true,
      downloadUrl: "/asta-forms/NRLA-joint-ast-family-couple-individual-2022.pdf",
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
                  {form.downloadable && form.downloadUrl && (
                    <button
                      onClick={() => handleDownload(form.downloadUrl, form.downloadUrl.split("/").pop() || 'document.pdf')}
                      className="rounded-lg border border-white/20 p-2 text-white transition hover:border-primary/50 hover:text-primary"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
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