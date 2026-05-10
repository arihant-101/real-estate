/** Mirrors the public Google Form fields (Residential Tenancy Application). */

export const EMPLOYMENT_OPTIONS = [
  { value: "full-time", label: "Full-time employed" },
  { value: "part-time", label: "Part-time employed" },
  { value: "self-employed", label: "Self-employed" },
  { value: "student", label: "Student" },
  { value: "unemployed-other", label: "Unemployed / other" },
] as const;

export type EmploymentOption = (typeof EMPLOYMENT_OPTIONS)[number]["value"];

export type TenantReferencingGoogleStyleForm = {
  email: string;
  listingContext: string;
  applicant1LegalName: string;
  applicant2LegalName: string;
  currentResidentialAddress: string;
  dateOfBirth: string;
  phones: string;
  correspondenceEmails: string;
  proposedTenancyStartDate: string;
  desiredLeaseTermMonths: "" | "12" | "24" | "36";
  sixMonthBreakClause: "" | "yes" | "no";
  furnitureSpecialRequirements: string;
  totalOccupants: string;
  ownsPets: "" | "yes" | "no";
  petsDescription: string;
  applicant1Employment: "" | EmploymentOption;
  applicant2Employment: "" | EmploymentOption;
  guarantorDetails: string;
  everEvicted: "" | "yes" | "no";
  everBankruptcy: "" | "yes" | "no";
  proceedImmediately: "" | "yes" | "no" | "maybe";
  willingToPayHoldingDeposit: "" | "yes" | "no";
  holdingDepositAmount: string;
  authorizeChecks: boolean;
};

export function emptyTenantReferencingGoogleStyleForm(): TenantReferencingGoogleStyleForm {
  return {
    email: "",
    listingContext: "",
    applicant1LegalName: "",
    applicant2LegalName: "",
    currentResidentialAddress: "",
    dateOfBirth: "",
    phones: "",
    correspondenceEmails: "",
    proposedTenancyStartDate: "",
    desiredLeaseTermMonths: "",
    sixMonthBreakClause: "",
    furnitureSpecialRequirements: "",
    totalOccupants: "",
    ownsPets: "",
    petsDescription: "",
    applicant1Employment: "",
    applicant2Employment: "",
    guarantorDetails: "",
    everEvicted: "",
    everBankruptcy: "",
    proceedImmediately: "",
    willingToPayHoldingDeposit: "",
    holdingDepositAmount: "",
    authorizeChecks: false,
  };
}

export function employmentLabel(value: EmploymentOption | ""): string {
  if (!value) return "—";
  const row = EMPLOYMENT_OPTIONS.find((o) => o.value === value);
  return row?.label ?? value;
}
