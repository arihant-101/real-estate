import jsPDF from "jspdf";
import { formatFilenameWithLondonDate, getLondonDate } from "./date-utils";
import { DEFAULT_FORM_LOGO_SRC, loadLogoDataUrl, naturalLogoSize } from "./form-pdf-branding";

export type ASTRoomOnlyFormPdfInput = {
  landlordName: string;
  landlordAddress: string;
  landlordEmail: string;
  landlordPhone: string;
  tenantNames: string[];
  tenantEmails: string[];
  roomDescription: string;
  propertyAddress: string;
  sharedFacilities: string;
  allocatedParking: string;
  executionDate: string;
  rentAmount: string;
  rentPeriod: string;
  firstPaymentDate: string;
  subsequentPaymentDate: string;
  paymentMethod: string;
  fixedTermLength: string;
  commencementDate: string;
  permittedOccupiers: string;
  utilities: Record<string, string>;
  depositAmount: string;
  depositHolder: string;
  depositScheme: string;
  leadTenant: string;
};

function disp(s: string): string {
  const t = (s || "").trim();
  return t.length ? t : "—";
}

function rentPeriodLabel(p: string): string {
  if (!p) return "—";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function depositSchemeLabel(v: string): string {
  const m: Record<string, string> = {
    dps: "Deposit Protection Service (DPS)",
    mydeposits: "MyDeposits",
    tds: "Tenancy Deposit Scheme (TDS)",
  };
  return m[v] || disp(v);
}

export async function downloadASTRoomOnlyFormPdf(
  form: ASTRoomOnlyFormPdfInput,
  options?: { logoSrc?: string }
): Promise<void> {
  const logoSrc = options?.logoSrc ?? DEFAULT_FORM_LOGO_SRC;
  const [logoDataUrl, dims] = await Promise.all([loadLogoDataUrl(logoSrc), naturalLogoSize(logoSrc)]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const maxW = pageW - 2 * margin;
  let y = margin;

  const ensure = (need: number) => {
    if (y + need > pageH - 12) {
      doc.addPage();
      y = margin;
    }
  };

  const logoMaxW = 36;
  const logoH = logoMaxW * (dims.h / dims.w);
  doc.addImage(logoDataUrl, "PNG", margin, y, logoMaxW, logoH);
  y += logoH + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("AST Room Only Agreement 2024", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Assured Shorthold Tenancy — room only (form export). Generated ${getLondonDate("display")} (London).`, margin, y);
  doc.setTextColor(0, 0, 0);
  y += 8;
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  const heading = (t: string) => {
    ensure(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(t, margin, y);
    y += 6;
  };

  const field = (label: string, value: string) => {
    ensure(5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`${label}:`, margin, y);
    y += 4.6;
    doc.setFont("helvetica", "normal");
    const vlines = doc.splitTextToSize(disp(value), maxW) as string[];
    for (const vl of vlines) {
      ensure(5);
      doc.text(vl, margin, y);
      y += 4.5;
    }
    y += 1.5;
  };

  heading("Landlord details");
  field("Full Name(s)", form.landlordName);
  field("Email Address", form.landlordEmail);
  field("Address", form.landlordAddress);
  field("Phone Number", form.landlordPhone);
  y += 2;

  heading("Tenant details");
  form.tenantNames.forEach((name, i) => {
    field(`Tenant ${i + 1} — Full Name`, name);
    field(`Tenant ${i + 1} — Email Address`, form.tenantEmails[i] ?? "");
    y += 1;
  });
  y += 2;

  heading("Property details");
  field("Room Description", form.roomDescription);
  field("Property Address", form.propertyAddress);
  field("Shared Facilities", form.sharedFacilities);
  field("Allocated Parking", form.allocatedParking);
  field("Permitted Occupiers", form.permittedOccupiers);
  y += 2;

  heading("Tenancy terms");
  field("Rent Amount", form.rentAmount ? `£${form.rentAmount}` : "");
  field("Rent Period", rentPeriodLabel(form.rentPeriod));
  field("First Payment Date", form.firstPaymentDate);
  field("Subsequent Payment Date", form.subsequentPaymentDate);
  field("Fixed Term Length", form.fixedTermLength);
  field("Commencement Date", form.commencementDate);
  field("Payment Method Details", form.paymentMethod);
  y += 2;

  heading("Utilities & services (who pays)");
  const utilRows: [string, string][] = [
    ["Water Charges", "water"],
    ["Gas", "gas"],
    ["Electricity", "electricity"],
    ["Television Licence", "tv"],
    ["Broadband", "broadband"],
    ["Telephone", "telephone"],
  ];
  for (const [label, key] of utilRows) {
    const who = form.utilities[key];
    field(label, who === "landlord" ? "Landlord" : who === "tenant" ? "Tenant" : disp(who));
  }
  y += 2;

  heading("Deposit protection");
  field("Deposit Amount", form.depositAmount ? `£${form.depositAmount}` : "");
  field("Deposit Holder", form.depositHolder);
  field("Deposit Protection Scheme", depositSchemeLabel(form.depositScheme));
  field("Lead Tenant (for multiple tenants)", form.leadTenant);
  y += 2;

  heading("Review & sign");
  field("Execution Date", form.executionDate);

  doc.save(formatFilenameWithLondonDate("AST-Room-Only-Agreement-2024-form", "pdf"));
}
