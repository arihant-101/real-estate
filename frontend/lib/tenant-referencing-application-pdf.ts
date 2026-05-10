import jsPDF from "jspdf";
import { formatFilenameWithLondonDate, getLondonDate } from "./date-utils";
import {
  employmentLabel,
  type TenantReferencingGoogleStyleForm,
} from "@/data/tenant-referencing-application-form";
import { DEFAULT_FORM_LOGO_SRC, loadLogoDataUrl, naturalLogoSize } from "./form-pdf-branding";

function yn(v: string): string {
  if (v === "yes") return "Yes";
  if (v === "no") return "No";
  if (v === "maybe") return "Maybe";
  return "";
}

/** Format YYYY-MM-DD (from date inputs) as DD/MM/YYYY for the PDF; pass through anything else. */
function formatPickedDateForPdf(value: string): string {
  const t = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const [y, m, d] = t.split("-");
  return `${d}/${m}/${y}`;
}

export async function downloadTenantReferencingApplicationPdf(
  data: TenantReferencingGoogleStyleForm,
  options?: { logoSrc?: string }
): Promise<void> {
  const logoSrc = options?.logoSrc ?? DEFAULT_FORM_LOGO_SRC;
  const [logoDataUrl, dims] = await Promise.all([loadLogoDataUrl(logoSrc), naturalLogoSize(logoSrc)]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const maxW = pageW - margin * 2;
  let y = 10;

  const logoMaxW = 42;
  const logoH = logoMaxW * (dims.h / dims.w);

  const drawLogo = (w: number, h: number, logoY: number) => {
    doc.addImage(logoDataUrl, "PNG", margin, logoY, w, h);
  };

  drawLogo(logoMaxW, logoH, y);
  y += logoH + 5;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageH - 14) {
      doc.addPage();
      y = 12;
      const cw = 32;
      const ch = cw * (dims.h / dims.w);
      drawLogo(cw, ch, y);
      y += ch + 6;
    }
  };

  const line = (text: string, opts?: { bold?: boolean; size?: number }) => {
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(opts?.size ?? 10);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    for (const ln of lines) {
      ensureSpace(5.5);
      doc.text(ln, margin, y);
      y += 4.8;
    }
  };

  const pair = (label: string, value: string) => {
    const v = (value || "").trim() || "—";
    line(`${label}: ${v}`, { bold: false });
    y += 1.5;
  };

  line("Residential Tenancy Application", { bold: true, size: 15 });
  y += 2;
  line(
    "Please complete this form accurately and completely. All applications are subject to approval, background, and credit checks.",
    { size: 9 }
  );
  y += 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  line(`ASTA Property Management · Exported ${getLondonDate("display")} (London)`, { size: 8.5 });
  doc.setTextColor(0, 0, 0);
  y += 4;
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  if (data.listingContext.trim()) {
    line("Property / listing context", { bold: true });
    pair("Notes", data.listingContext);
    y += 2;
  }

  line("Contact", { bold: true, size: 11 });
  pair("Email", data.email);
  pair("Primary & secondary phone number(s)", data.phones);
  pair("Email address(es) for correspondence (include second applicant if applicable)", data.correspondenceEmails);
  y += 2;

  line("Applicants", { bold: true, size: 11 });
  pair("Applicant 1 — full legal name", data.applicant1LegalName);
  pair("Applicant 2 — full legal name (N/A if single applicant)", data.applicant2LegalName);
  pair("Current residential address", data.currentResidentialAddress);
  pair("Date of birth", formatPickedDateForPdf(data.dateOfBirth));
  y += 2;

  line("Tenancy", { bold: true, size: 11 });
  pair("Proposed tenancy start date", formatPickedDateForPdf(data.proposedTenancyStartDate));
  pair("Desired lease term", data.desiredLeaseTermMonths ? `${data.desiredLeaseTermMonths} months` : "");
  pair("Six-month break clause required", yn(data.sixMonthBreakClause));
  pair("Furniture / special requirements", data.furnitureSpecialRequirements);
  pair("Total number of occupants (including applicant(s))", data.totalOccupants);
  y += 2;

  line("Pets", { bold: true, size: 11 });
  pair("Do you own any pets?", yn(data.ownsPets));
  if (data.ownsPets === "yes") {
    pair("Pet details (type, breed, weight, age)", data.petsDescription);
  }
  y += 2;

  line("Employment", { bold: true, size: 11 });
  pair("Applicant 1 — current employment status", employmentLabel(data.applicant1Employment));
  pair("Applicant 2 — current employment status", employmentLabel(data.applicant2Employment));
  pair("Guarantor (if required — name, phone, email)", data.guarantorDetails);
  y += 2;

  line("Declarations", { bold: true, size: 11 });
  pair("Ever evicted or asked to leave a rental?", yn(data.everEvicted));
  pair("Ever filed for bankruptcy?", yn(data.everBankruptcy));
  pair("In a position to proceed immediately if successful?", yn(data.proceedImmediately));
  pair(
    "Prepared to pay the agreed holding deposit to secure the property if selected (amount as quoted for the listing)",
    yn(data.willingToPayHoldingDeposit)
  );
  if (data.holdingDepositAmount.trim()) {
    pair("Holding deposit amount quoted / agreed", data.holdingDepositAmount);
  }
  y += 2;

  line(
    `Authorization for referencing: ${data.authorizeChecks ? "I agree — landlord/agent may conduct necessary background and credit checks." : "Not ticked on export."}`,
    { size: 9.5 }
  );

  doc.save(formatFilenameWithLondonDate("Residential-tenancy-application", "pdf"));
}
