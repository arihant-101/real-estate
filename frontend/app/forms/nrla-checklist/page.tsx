"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, CheckSquare, AlertTriangle, FileText, Home, Users, Loader2 } from "lucide-react";
import { nrlaChecklistData, nrlaChecklistCategories, countNrlaChecklistItems } from "@/data/nrla-checklist";
import { downloadNrlaChecklistPdfWithLogo } from "@/lib/nrla-checklist-pdf";

export default function NRLAChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloadError(null);
    setDownloading(true);
    try {
      await downloadNrlaChecklistPdfWithLogo(checkedItems);
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : "Could not create PDF. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  const [activeCategory, setActiveCategory] = useState<(typeof nrlaChecklistCategories)[number]>("landlord");

  const handleCheck = (itemId: string) => {
    setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const categories = [
    { id: "landlord" as const, title: "Landlord Checklist", icon: Home },
    { id: "tenant" as const, title: "Tenant Checklist", icon: Users },
    { id: "legal" as const, title: "Legal Requirements", icon: FileText },
    { id: "safety" as const, title: "Safety & Compliance", icon: AlertTriangle },
  ];

  const checklistData = nrlaChecklistData;

  const currentData = checklistData[activeCategory];
  const totalItems = countNrlaChecklistItems();
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Link
              href="/forms"
              className="text-elegant-muted hover:text-primary flex items-center gap-2 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Forms</span>
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-white">NRLA Checklist</h1>
              <p className="text-elegant-muted">
                Comprehensive checklist for landlords and tenants to ensure compliance and smooth tenancy setup
              </p>
              <p className="text-elegant-muted mt-2 text-sm">
                Download saves this checklist as a PDF with the ASTA logo at the top left and your ticked progress.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 flex shrink-0 items-center gap-2 self-start rounded-lg border px-4 py-2 transition disabled:opacity-60"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="text-sm font-medium">{downloading ? "Preparing PDF…" : "Download PDF"}</span>
            </button>
          </div>

          {downloadError ? (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
              {downloadError}
            </p>
          ) : null}

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-elegant-muted text-sm">Overall Progress</span>
              <span className="text-primary text-sm">
                {completedItems}/{totalItems} items completed
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="from-primary to-secondary h-full bg-gradient-to-r transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isActive = activeCategory === category.id;
                const categoryItems = checklistData[category.id].items.reduce(
                  (acc, section) => acc + section.items.length,
                  0
                );
                const categoryCompleted = checklistData[category.id].items.reduce(
                  (acc, section) =>
                    acc + section.items.filter((_, index) => checkedItems[`${section.id}-${index}`]).length,
                  0
                );

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? "border border-primary/30 bg-primary/20 text-primary"
                        : "border border-white/10 text-elegant-muted hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-4 w-4 shrink-0" />
                      <span>{category.title}</span>
                    </div>
                    <span className="text-xs">
                      {categoryCompleted}/{categoryItems}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-panel/50 p-8">
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-semibold text-white">{currentData.title}</h2>
                <p className="text-elegant-muted">{currentData.description}</p>
              </div>

              <div className="space-y-8">
                {currentData.items.map((section) => (
                  <div key={section.id} className="bg-surface/50 rounded-xl border border-white/10 p-6">
                    <h3 className="mb-4 text-lg font-medium text-white">{section.title}</h3>
                    <div className="space-y-3">
                      {section.items.map((item, index) => {
                        const itemId = `${section.id}-${index}`;
                        const isChecked = checkedItems[itemId] || false;

                        return (
                          <label key={itemId} className="group flex cursor-pointer items-start gap-3">
                            <div className="relative mt-0.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheck(itemId)}
                                className="sr-only"
                              />
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${
                                  isChecked
                                    ? "border-primary bg-primary"
                                    : "border-white/30 group-hover:border-primary/50"
                                }`}
                              >
                                {isChecked ? <CheckSquare className="h-3 w-3 text-black" /> : null}
                              </div>
                            </div>
                            <span
                              className={`text-sm leading-relaxed transition ${
                                isChecked
                                  ? "text-white line-through opacity-75"
                                  : "text-elegant-muted group-hover:text-white"
                              }`}
                            >
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button type="button" className="btn-primary">
            Save Progress
          </button>
          <button type="button" className="btn-outline">
            Print Checklist
          </button>
          <Link href="/contact-us" className="btn-outline">
            Need Help?
          </Link>
        </div>

        {progressPercentage === 100 ? (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/20 px-6 py-3 text-green-400">
              <CheckSquare className="h-5 w-5" />
              <span className="font-medium">Checklist Complete!</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
