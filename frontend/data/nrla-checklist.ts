export type NrlaChecklistSection = {
  id: string;
  title: string;
  items: string[];
};

export type NrlaChecklistCategory = {
  title: string;
  description: string;
  items: NrlaChecklistSection[];
};

export const nrlaChecklistCategories = ["landlord", "tenant", "legal", "safety"] as const;
export type NrlaCategoryId = (typeof nrlaChecklistCategories)[number];

export const nrlaChecklistData: Record<NrlaCategoryId, NrlaChecklistCategory> = {
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
        ],
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
        ],
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
        ],
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
        ],
      },
    ],
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
        ],
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
        ],
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
        ],
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
        ],
      },
    ],
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
        ],
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
        ],
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
        ],
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
        ],
      },
    ],
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
        ],
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
        ],
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
        ],
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
        ],
      },
    ],
  },
};

export function countNrlaChecklistItems(): number {
  return nrlaChecklistCategories.reduce(
    (acc, id) =>
      acc + nrlaChecklistData[id].items.reduce((s, sec) => s + sec.items.length, 0),
    0
  );
}
