import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Modern Slavery Statement | Ethical Business Practices",
  description:
    "Our commitment to preventing modern slavery and maintaining ethical practices across our property management operations.",
  path: "/slavery-and-human-trafficking-statement",
});

export default function SlaveryAndHumanTraffickingStatementPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Slavery and Human Trafficking Statement</h1>
      <p className="mt-4 text-muted">
        ASTA Property Management is firmly committed to preventing slavery and human trafficking in
        all areas of our operations, supply chains, and business partnerships. We recognise our
        responsibility under the Modern Slavery Act 2015 to identify, prevent, and address any
        forms of modern slavery within our sphere of influence.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">Our commitment</h2>
      <p className="mt-2 text-muted">
        As a London-based property management company providing residential lettings, landlord
        services, and short-term holiday accommodation, we operate with a zero-tolerance approach
        to modern slavery, forced labour, child labour, and human trafficking in any form.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">Organisational structure and supply chains</h2>
      <p className="mt-2 text-muted">
        Our business model includes the direct employment of property managers, administrative
        staff, and contractors, as well as engagement with third-party suppliers such as cleaners,
        tradespeople, photographers, software providers, and letting platforms. We acknowledge that
        some outsourced services present higher risks of labour exploitation, so we apply enhanced
        due diligence in these areas.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">Due diligence measures</h2>
      <p className="mt-2 text-muted">
        To prevent slavery and human trafficking within our operations and those of our suppliers,
        ASTA undertakes a range of steps including vetting new service providers, requiring
        contractual assurances of compliance with anti-slavery legislation, conducting risk
        assessments of high-exposure areas such as subcontracted labour and cleaning, and
        investigating any reports of unethical conduct with corrective action where necessary.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">Training and awareness</h2>
      <p className="mt-2 text-muted">
        We are committed to providing training so employees and key contractors understand their
        responsibilities under the Modern Slavery Act, how to identify potential signs of modern
        slavery, and how to report concerns. Leadership and operational staff undertake ongoing
        compliance training to reinforce our commitment to ethical practices.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">Policies and monitoring</h2>
      <p className="mt-2 text-muted">
        Our Code of Conduct, Whistleblowing Policy, Equality and Diversity Policy, Anti-Bribery and
        Corruption Policy, and Supplier Code of Practice are designed to promote lawful, safe, and
        fair working conditions. We are establishing key performance indicators (KPIs) to monitor
        the effectiveness of our anti-slavery measures and will publicly report progress through
        updates to this statement.
      </p>

      <p className="mt-8 text-sm text-muted">
        This statement has been approved by the Director of ASTA Property Management and is
        reviewed and updated annually. Last updated: {new Date().getFullYear()}.
      </p>
    </div>
  );
}

