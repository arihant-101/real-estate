"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, CheckSquare, AlertTriangle, FileText, Home, Users } from "lucide-react";
import { formatFilenameWithLondonDate } from "@/lib/date-utils";

export default function NRLAChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleDownload = () => {
    const filename = formatFilenameWithLondonDate('NRLA-Checklist', 'docx');
    const link = document.createElement('a');
    link.href = '/asta-forms/NRLA%20Checklist.docx';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [activeCategory, setActiveCategory] = useState("landlord");

  const handleCheck = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const categories = [
    { id: "landlord", title: "Landlord Checklist", icon: Home },
    { id: "tenant", title: "Tenant Checklist", icon: Users },
    { id: "legal", title: "Legal Requirements", icon: FileText },
    { id: "safety", title: "Safety & Compliance", icon: AlertTriangle },
  ];

  const checklistData = {
    landlord: {
      title: "Landlord Pre-Tenancy Checklist",
      description: "Essential tasks for landlords before letting a property",
      items: [
        {
          id: "l1",
          title: "Property Preparation",
          items: [
            "Property is clean and in good repair",
            "All fixtures and fittings are working",
            "Inventory completed with photos",
            "Meter readings recorded",
            "Keys and access devices prepared",
          ]
        },
        {
          id: "l2",
          title: "Legal Documentation",
          items: [
            "Valid gas safety certificate (if applicable)",
            "Electrical installation condition report (EICR)",
            "Energy Performance Certificate (EPC) - minimum rating E",
            "How to Rent guide provided to tenant",
            "Deposit protection scheme arranged",
          ]
        },
        {
          id: "l3",
          title: "Tenancy Setup",
          items: [
            "Tenancy agreement prepared and reviewed",
            "Right to rent checks completed",
            "Deposit amount calculated correctly (max 5-6 weeks)",
            "Rent payment method established",
            "Emergency contact details exchanged",
          ]
        },
        {
          id: "l4",
          title: "Insurance & Licensing",
          items: [
            "Landlord insurance policy active",
            "HMO license obtained (if required)",
            "Selective licensing checked (if applicable)",
            "Mortgage lender consent (if applicable)",
            "Freeholder consent (for leasehold properties)",
          ]
        },
      ]
    },
    tenant: {
      title: "Tenant Pre-Tenancy Checklist",
      description: "Important checks for tenants before signing a tenancy agreement",
      items: [
        {
          id: "t1",
          title: "Financial Preparation",
          items: [
            "Affordability calculated (max 35% of take-home pay)",
            "Deposit funds available (5-6 weeks' rent)",
            "First month's rent ready",
            "Moving costs budgeted",
            "Contents insurance arranged",
          ]
        },
        {
          id: "t2",
          title: "Documentation Ready",
          items: [
            "Right to rent documents prepared",
            "Employment references available",
            "Previous landlord references obtained",
            "Bank statements (last 3 months)",
            "Credit report checked",
          ]
        },
        {
          id: "t3",
          title: "Property Inspection",
          items: [
            "Property condition checked thoroughly",
            "Inventory reviewed and agreed",
            "Smoke and CO alarms tested",
            "Heating and hot water tested",
            "All appliances working",
          ]
        },
        {
          id: "t4",
          title: "Agreement Review",
          items: [
            "Tenancy agreement read completely",
            "Terms and conditions understood",
            "Deposit protection details received",
            "Landlord contact details confirmed",
            "Break clause terms (if any) understood",
          ]
        },
      ]
    },
    legal: {
      title: "Legal Requirements Checklist",
      description: "Mandatory legal obligations for landlords and tenants",
      items: [
        {
          id: "le1",
          title: "Landlord Legal Obligations",
          items: [
            "Right to rent checks completed within 28 days",
            "Deposit protected in approved scheme within 30 days",
            "Prescribed information provided to tenant",
            "Gas safety check completed annually",
            "Electrical safety check every 5 years",
          ]
        },
        {
          id: "le2",
          title: "Tenant Legal Requirements",
          items: [
            "Right to rent in UK established",
            "Accurate information provided in application",
            "Tenancy agreement signed and dated",
            "Deposit paid to designated account",
            "Council tax liability arranged",
          ]
        },
        {
          id: "le3",
          title: "Prohibited Practices",
          items: [
            "No prohibited fees charged (Tenant Fees Act 2019)",
            "No discrimination based on protected characteristics",
            "No harassment or illegal eviction",
            "No unlawful deposit amounts",
            "No unfair contract terms",
          ]
        },
        {
          id: "le4",
          title: "Notice Requirements",
          items: [
            "24 hours' notice for property inspections",
            "Proper notice periods for rent increases",
            "Correct notice for ending tenancy",
            "Written notices served correctly",
            "Statutory notice forms used where required",
          ]
        },
      ]
    },
    safety: {
      title: "Safety & Compliance Checklist",
      description: "Essential safety measures and compliance requirements",
      items: [
        {
          id: "s1",
          title: "Fire Safety",
          items: [
            "Smoke alarms on every floor (mains powered preferred)",
            "Carbon monoxide alarms in rooms with fuel-burning appliances",
            "Fire doors and escape routes clear",
            "Furniture meets fire safety regulations",
            "Fire blanket and extinguisher (if applicable)",
          ]
        },
        {
          id: "s2",
          title: "Gas Safety",
          items: [
            "Annual gas safety check by Gas Safe engineer",
            "Gas appliances serviced and certified",
            "Gas safety certificate provided to tenant",
            "Gas meter accessible and working",
            "Emergency gas shut-off valve identified",
          ]
        },
        {
          id: "s3",
          title: "Electrical Safety",
          items: [
            "5-yearly electrical installation condition report",
            "PAT testing for portable appliances",
            "RCD protection installed",
            "Electrical certificates provided",
            "Emergency electrical shut-off identified",
          ]
        },
        {
          id: "s4",
          title: "General Safety",
          items: [
            "Property structurally sound",
            "No Category 1 hazards present",
            "Water system safe and legionella-free",
            "Asbestos management (pre-1980s properties)",
            "Window safety (especially upper floors)",
          ]
        },
      ]
    }
  };

  const currentData = checklistData[activeCategory as keyof typeof checklistData];
  const totalItems = Object.values(checklistData).reduce((acc, category) => 
    acc + category.items.reduce((itemAcc, section) => itemAcc + section.items.length, 0), 0
  );
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/forms"
              className="flex items-center gap-2 text-elegant-muted hover:text-primary transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Forms</span>
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">NRLA Checklist</h1>
              <p className="text-elegant-muted">
                Comprehensive checklist for landlords and tenants to ensure compliance and smooth tenancy setup
              </p>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-elegant-muted">Overall Progress</span>
              <span className="text-sm text-primary">{completedItems}/{totalItems} items completed</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Category Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isActive = activeCategory === category.id;
                const categoryItems = checklistData[category.id as keyof typeof checklistData].items.reduce(
                  (acc, section) => acc + section.items.length, 0
                );
                const categoryCompleted = checklistData[category.id as keyof typeof checklistData].items.reduce(
                  (acc, section) => acc + section.items.filter((_, index) => 
                    checkedItems[`${section.id}-${index}`]
                  ).length, 0
                );

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? "bg-primary/20 border-primary/30 text-primary border"
                        : "border border-white/10 text-elegant-muted hover:text-white hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
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

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-panel/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">{currentData.title}</h2>
                <p className="text-elegant-muted">{currentData.description}</p>
              </div>

              <div className="space-y-8">
                {currentData.items.map((section) => (
                  <div key={section.id} className="rounded-xl border border-white/10 bg-surface/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">{section.title}</h3>
                    <div className="space-y-3">
                      {section.items.map((item, index) => {
                        const itemId = `${section.id}-${index}`;
                        const isChecked = checkedItems[itemId] || false;
                        
                        return (
                          <label
                            key={index}
                            className="flex items-start gap-3 cursor-pointer group"
                          >
                            <div className="relative mt-0.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheck(itemId)}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                                isChecked
                                  ? "bg-primary border-primary"
                                  : "border-white/30 group-hover:border-primary/50"
                              }`}>
                                {isChecked && (
                                  <CheckSquare className="w-3 h-3 text-black" />
                                )}
                              </div>
                            </div>
                            <span className={`text-sm leading-relaxed transition ${
                              isChecked 
                                ? "text-white line-through opacity-75" 
                                : "text-elegant-muted group-hover:text-white"
                            }`}>
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

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button className="btn-primary">
            Save Progress
          </button>
          <button className="btn-outline">
            Print Checklist
          </button>
          <Link href="/contact-us" className="btn-outline">
            Need Help?
          </Link>
        </div>

        {/* Completion Badge */}
        {progressPercentage === 100 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 border border-green-500/30 px-6 py-3 text-green-400">
              <CheckSquare className="h-5 w-5" />
              <span className="font-medium">Checklist Complete!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}