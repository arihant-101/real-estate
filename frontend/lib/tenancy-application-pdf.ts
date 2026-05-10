import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import { formatFilenameWithLondonDate } from "./date-utils";
import { fetchUint8, stampLogoTopLeftEveryPage } from "./form-pdf-branding";

export type ApplicantBlock = {
  name: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  specialRequirements: string;
  pets: string;
  employmentStatus: string;
};

export type TenancyApplicationFormData = {
  holdingDepositReceiptDate: string;
  propertyAddress: string;
  rentAmountAndPeriod: string;
  proposedStartDate: string;
  totalOccupants: string;
  applicant1: ApplicantBlock;
  applicant2: ApplicantBlock;
  guarantorIfRequired: string;
  holdingDepositWeeksRentUnderstood: boolean;
  proceedImmediatelyIfSuccessful: string;
  declarationTrueAndComplete: boolean;
};

function buildApplicationPdfBytes(data: TenancyApplicationFormData): Uint8Array {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const maxW = pageW - margin * 2;
  let y = 18;
  const bodySize = 10;
  const gap = 5;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageH - 14) {
      doc.addPage();
      y = 18;
    }
  };

  const paragraph = (text: string, opts?: { bold?: boolean; size?: number }) => {
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(opts?.size ?? bodySize);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    for (const line of lines) {
      ensureSpace(6);
      doc.text(line, margin, y);
      y += 5;
    }
  };

  const numbered = (n: number, label: string, value: string) => {
    const v = (value || "").trim() || "________________";
    paragraph(`${n}. ${label}: ${v}`);
    y += 1;
  };

  paragraph("Residential Tenancy Application Form", { bold: true, size: 15 });
  y += gap;
  paragraph(
    "Please complete this form accurately and completely. All applications are subject to approval, background, and credit checks."
  );
  y += gap;

  paragraph(
    `This agreement acknowledges the receipt of the Holding Deposit on ${data.holdingDepositReceiptDate.trim() || "________________"} and your application to be considered for a tenancy at the Property below for the Rent.`,
    { bold: true }
  );
  y += gap;

  let q = 1;
  numbered(q++, "Property address (the Property)", data.propertyAddress);
  numbered(q++, "Rent (the Rent — amount and period, e.g. £X per calendar month)", data.rentAmountAndPeriod);
  numbered(q++, "Proposed tenancy start date", data.proposedStartDate);
  numbered(q++, "Total number of occupants (including children)", data.totalOccupants);

  y += 2;
  paragraph("Applicant one", { bold: true, size: 11 });
  numbered(q++, "Applicant one — full name", data.applicant1.name);
  numbered(q++, "Applicant one — date of birth", data.applicant1.dob);
  numbered(q++, "Applicant one — phone number", data.applicant1.phone);
  numbered(q++, "Applicant one — email address", data.applicant1.email);
  numbered(q++, "Applicant one — current address", data.applicant1.address);
  numbered(q++, "Applicant one — any special requirements", data.applicant1.specialRequirements);
  numbered(q++, "Applicant one — pets (state none if not applicable)", data.applicant1.pets);
  numbered(q++, "Applicant one — employment status", data.applicant1.employmentStatus);

  y += 2;
  paragraph("Applicant two", { bold: true, size: 11 });
  numbered(q++, "Applicant two — full name", data.applicant2.name);
  numbered(q++, "Applicant two — date of birth", data.applicant2.dob);
  numbered(q++, "Applicant two — phone number", data.applicant2.phone);
  numbered(q++, "Applicant two — email address", data.applicant2.email);
  numbered(q++, "Applicant two — current address", data.applicant2.address);
  numbered(q++, "Applicant two — any special requirements", data.applicant2.specialRequirements);
  numbered(q++, "Applicant two — pets (state none if not applicable)", data.applicant2.pets);
  numbered(q++, "Applicant two — employment status", data.applicant2.employmentStatus);

  numbered(
    q++,
    "Guarantor — if we reasonably require a guarantor, will you provide one? (give name and contact if yes)",
    data.guarantorIfRequired
  );

  numbered(
    q++,
    "Holding deposit — I understand the holding deposit must be no more than one week's rent (1/52 of the annual rent) and agree to pay it to reserve the property, subject to the Holding Deposit Agreement",
    data.holdingDepositWeeksRentUnderstood ? "Yes" : "No / not confirmed"
  );

  numbered(
    q++,
    "If the application is successful, will you proceed to enter into the tenancy agreement immediately upon satisfactory completion of referencing?",
    data.proceedImmediatelyIfSuccessful
  );

  numbered(
    q++,
    "Declaration — I/we confirm the information in this application is true and complete to the best of my/our knowledge. I/we understand that false or misleading information may affect whether a tenancy is offered or may continue",
    data.declarationTrueAndComplete ? "Confirmed" : "Not confirmed"
  );

  y += 4;
  paragraph(
    "Note: This application form does not ask for a fixed lease term or break clause — those will be agreed in the tenancy agreement if a let proceeds."
  );

  return new Uint8Array(doc.output("arraybuffer") as ArrayBuffer);
}

export async function downloadResidentialTenancyApplicationPack(
  data: TenancyApplicationFormData,
  options?: { logoUrl?: string; holdingDepositPdfUrl?: string }
): Promise<void> {
  const logoUrl = options?.logoUrl ?? "/asta-logo.png";
  const holdingUrl = options?.holdingDepositPdfUrl ?? "/asta-forms/holding-deposit-agreement-england.pdf";

  const [applicationBytes, holdingBytes, logoBytes] = await Promise.all([
    Promise.resolve(buildApplicationPdfBytes(data)),
    fetchUint8(holdingUrl),
    fetchUint8(logoUrl),
  ]);

  const appDoc = await PDFDocument.load(applicationBytes);
  const holdDoc = await PDFDocument.load(holdingBytes);
  const merged = await PDFDocument.create();

  const appPages = await merged.copyPages(appDoc, appDoc.getPageIndices());
  appPages.forEach((p) => merged.addPage(p));

  const holdPages = await merged.copyPages(holdDoc, holdDoc.getPageIndices());
  holdPages.forEach((p) => merged.addPage(p));

  await stampLogoTopLeftEveryPage(merged, logoBytes);

  const out = await merged.save();
  const blob = new Blob([out.slice()], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = formatFilenameWithLondonDate("Residential-Tenancy-Application-and-Holding-Deposit", "pdf");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
