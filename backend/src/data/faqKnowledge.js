/** Static facts the FAQ assistant may use — keep in sync with the public site. */
export const FAQ_KNOWLEDGE = {
  company: "ASTA Property Management",
  tagline: "Full-service property management for landlords and tenants in London.",
  email: "hello@astapropertymanagement.co.uk",
  phone: "07452 766766",
  phoneTel: "+447452766766",
  hours: "Monday to Friday, 9:00 – 17:30",
  address: "36 Northumberland Avenue, London, E12 5HD, United Kingdom",
  website: "https://www.astapropertymanagement.co.uk",
  contactPath: "/contact-us",
  repairsPath: "/repairs",
  maintenanceFormPath: "/maintenance-request",
  faqsPath: "/faqs",
  portalPath: "/login",
  services: [
    "Property and tenancy management for landlords",
    "Tenant placement and referencing",
    "Financial management and rent reporting",
    "Maintenance coordination and repairs reporting",
    "Holiday lettings management",
    "Landlord and tenant portal access",
  ],
  repairs:
    "Tenants can report repairs via the Repairs page (/repairs) when logged in, or use the maintenance request form (/maintenance-request). For emergencies, tenants should also call the emergency number provided at move-in.",
  responseTime:
    "We usually respond to enquiries within one working day. Maintenance issues are typically addressed within 24–72 hours depending on severity.",
};

/** Site FAQ entries — used by fallback matching and the AI system prompt. */
export const FAQ_ENTRIES = [
  {
    q: "What services does ASTA offer?",
    a: `ASTA Property Management offers:\n\n${FAQ_KNOWLEDGE.services.map((s) => `• ${s}`).join("\n")}\n\nBrowse our Services pages on the website for more detail.`,
    keywords: ["service", "services", "offer", "management", "landlord", "holiday", "financial", "what do you do"],
  },
  {
    q: "How can I contact ASTA?",
    a: `You can reach us at:\n\n• Email: ${FAQ_KNOWLEDGE.email}\n• Phone: ${FAQ_KNOWLEDGE.phone}\n• Hours: ${FAQ_KNOWLEDGE.hours}\n• Office: ${FAQ_KNOWLEDGE.address}\n\nContact form: ${FAQ_KNOWLEDGE.website}${FAQ_KNOWLEDGE.contactPath}`,
    keywords: ["contact", "email", "phone", "call", "reach", "office", "address", "where"],
  },
  {
    q: "How do I report a repair?",
    a: `${FAQ_KNOWLEDGE.repairs}\n\nMaintenance form: ${FAQ_KNOWLEDGE.website}${FAQ_KNOWLEDGE.maintenanceFormPath}\nRepairs portal: ${FAQ_KNOWLEDGE.website}${FAQ_KNOWLEDGE.repairsPath}`,
    keywords: ["repair", "repairs", "maintenance", "fix", "broken", "leak", "issue", "report"],
  },
  {
    q: "What are your office hours?",
    a: `Our office hours are ${FAQ_KNOWLEDGE.hours}.\n\nEmail: ${FAQ_KNOWLEDGE.email}\nPhone: ${FAQ_KNOWLEDGE.phone}\n\n${FAQ_KNOWLEDGE.responseTime}`,
    keywords: ["hour", "hours", "open", "opening", "when", "time", "available", "closed"],
  },
  {
    q: "How do I apply for a property?",
    a: "Begin by completing our secure online Rental Application Form, available via the individual listing or on our Tenants page. You'll need contact and ID details, proof of employment and income, landlord references, consent for a credit check, and proof of Right to Rent. A holding deposit secures the property while the tenancy agreement is prepared. We typically provide a decision within 1–3 working days.",
    keywords: ["apply", "application", "apply for", "rental application", "holding deposit", "right to rent"],
  },
  {
    q: "What documents will I receive before moving in?",
    a: "All tenants receive a legally compliant documentation pack, including your Assured Shorthold Tenancy Agreement (AST), the latest How to Rent guide, EPC, Gas Safety Certificate, EICR, deposit registration confirmation, emergency contact details, and property-specific information — provided digitally via our secure portal.",
    keywords: ["document", "documents", "paperwork", "moving in", "move-in", "ast", "epc", "gas safety", "eicr", "pack"],
  },
  {
    q: "What is included in your property management service for tenants?",
    a: "Our full-service tenancy management covers 24/7 maintenance request handling, prompt response from vetted tradespeople, regular inspections with follow-up reports, legal compliance monitoring for safety certifications, secure rent payment systems and arrears monitoring, personalised tenant support, and clear renewal or end-of-tenancy procedures.",
    keywords: ["included", "tenant service", "tenancy management", "what do tenants get", "support"],
  },
  {
    q: "What is the deposit process?",
    a: "All deposits are held under a Tenancy Deposit Protection (TDP) scheme. We register your deposit with a government-approved provider, issue a certificate, securely store the deposit for the tenancy, and only make lawful deductions where applicable. Deposits are usually returned within 10 days after checkout, subject to property condition and cleared rent.",
    keywords: ["deposit", "tdp", "protection", "return deposit", "deduction"],
  },
  {
    q: "How does ASTA ensure properties meet safety standards?",
    a: "Every ASTA-managed property must comply with UK housing legislation. We arrange annual gas safety checks, EICR at least every five years, EPCs at the legal minimum rating, smoke alarms on every floor, CO detectors where required, and fire-safe furniture. Regular inspections help identify risks early.",
    keywords: ["safety", "gas", "electrical", "eicr", "epc", "smoke alarm", "compliance", "standards", "certificate"],
  },
  {
    q: "Can I renew my tenancy?",
    a: "Yes. We usually contact you 8–12 weeks before your tenancy end date to discuss renewal. If both landlord and tenant agree, we prepare a new fixed-term or periodic contract and issue revised documentation via your portal. If you plan to move out, we'll guide you through notice, checkout, and final steps.",
    keywords: ["renew", "renewal", "extend", "tenancy end", "notice", "move out"],
  },
  {
    q: "Are pets allowed?",
    a: "Some ASTA properties are pet-friendly, but policies vary by landlord and property. Tell us at application stage if you have or plan to get a pet. Where permitted, a Pet Agreement may apply and additional cleaning clauses may be included.",
    keywords: ["pet", "pets", "dog", "cat", "animal", "pet-friendly"],
  },
  {
    q: "What is expected at the end of my tenancy?",
    a: "Before you vacate, we'll provide a Move-Out Checklist. You'll need to return all keys, remove belongings, clean the property, report any maintenance issues, provide a forwarding address, and be available for a final inspection. This helps ensure a fair checkout and timely deposit return.",
    keywords: ["end of tenancy", "move out", "checkout", "vacate", "leaving", "checklist"],
  },
  {
    q: "How do I access the tenant or landlord portal?",
    a: `Sign in at ${FAQ_KNOWLEDGE.website}${FAQ_KNOWLEDGE.portalPath} with the account you registered. Landlords can manage properties and view maintenance; tenants can report repairs, view applications, and access tenancy documents.`,
    keywords: ["portal", "login", "log in", "sign in", "account", "register", "password"],
  },
];

export function buildFaqSystemPrompt() {
  const k = FAQ_KNOWLEDGE;
  const faqBlock = FAQ_ENTRIES.map((e) => `Q: ${e.q}\nA: ${e.a}`).join("\n\n");

  return `You are the ASTA Property Management website FAQ assistant.

You help visitors with questions about ASTA's property management services, tenancy processes, contact details, repairs, deposits, safety, portal access, and related topics covered on our website.

COMPANY FACTS:
- Company: ${k.company}
- Email: ${k.email}
- Phone: ${k.phone} (${k.hours})
- Office: ${k.address}
- Website: ${k.website}
- Contact form: ${k.website}${k.contactPath}
- Repairs: ${k.website}${k.repairsPath}
- Maintenance form: ${k.website}${k.maintenanceFormPath}
- FAQs page: ${k.website}${k.faqsPath}
- Portal: ${k.website}${k.portalPath}

OFFICIAL FAQ ANSWERS (prefer these when relevant):
${faqBlock}

RULES:
1. Answer using the FAQ knowledge above when the question matches. You may rephrase briefly but do not invent facts.
2. Be warm, professional, and concise (2–4 short paragraphs max).
3. Do NOT give legal advice, quote specific rent amounts, or discuss unrelated topics.
4. If the question is outside ASTA property management topics, direct them to the contact form: ${k.website}${k.contactPath}
5. Plain text only. URLs may be included as full links.
6. Never claim to be human or make binding commitments.`;
}
