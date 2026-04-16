# Property Management Website – Production Completion Plan

This document is the full production plan including landlord/tenant product features. The canonical plan may also live in `.cursor/plans/`; this copy is in-repo for reference.

---

## Current state (summary)

- **Frontend:** Next.js 14 (App Router), Tailwind, custom components. All 17 routes exist (frontend/app/).
- **Backend:** Express, Prisma (PostgreSQL), JWT auth with roles `LANDLORD`, `TENANT`, `ADMIN`. Properties, areas, enquiries, maintenance requests, blog, testimonials (approved-only public API), favorites, user auth.
- **Portal:** Login/Register work; `/portal` shows a link to `NEXT_PUBLIC_PORTAL_URL` (external client portal/CRM). No in-app financial data; admin sees recent enquiries and maintenance requests only.

---

## 1. About Us – Company overview, mission, values, team

**Gap:** frontend/app/about/page.tsx has short text only; no team section and no visual structure.

**Implementation:** Add a **Team** section (static data or team.json). Restructure: Hero/overview, Mission, Values, Team. Optional JSON-LD for Organisation.

**Deliverables:** Updated About page with mission, values, and team block; consistent styling.

---

## 2. Property Maintenance and Inspections

**Gap:** Basic bullets; theme inconsistency. Needs richer content and CTA to maintenance-request.

**Implementation:** Align theme; expand content (process steps, inspection frequency, emergency handling, compliance); optional process diagram; CTA to maintenance-request page.

**Deliverables:** Themed, content-rich Maintenance & Inspections page with CTAs.

---

## 3. Property Listings (for landlords and tenants)

**Current:** List + detail with filters, one image, map. Backend supports slug/UUID.

**Gaps:** Image gallery on detail; maps docs; holiday-let pricing optional. **Landlord-owned listings:** Implemented in §10–11: landlords list their own properties; public listings show only LIVE; landlord portal has "My Properties" and full management.

**Deliverables:** Property detail image gallery; env/docs for maps; landlord listing and management in §11.

---

## 4. Financial Management and Reporting (screen for landlords)

**Current:** Informational page only; no in-app financial data.

**Implementation:** Expand financial-management page with sections (rent collection, deposit protection, statement frequency, landlord payouts, arrears, accounting support). Add **in-app financial summary** (see §14): RentLedgerEntry so landlords and tenants see rent due/paid/overdue in the portal; full payment processing can remain in external portal.

**Deliverables:** Richer Financial Management marketing page; in-app rent/ledger views in portal (§14); CTAs to external portal where applicable.

---

## 5. Owners / Landlords

**Implementation:** CTAs (Register, Sign in); "How it works" steps; compliance list; link to Slavery Statement and Contact. Role selection at register (Landlord/Tenant). See §16 for full alignment with portal features.

**Deliverables:** Owners page with portal CTAs and consistent layout.

---

## 6. Tenants – Resources, application procedures, tenancy guidance

**Implementation:** Step list for applying; "What you'll need" checklist; portal CTAs; tenancy guidance (deposit, repairs, notice periods). See §16 for portal alignment.

**Deliverables:** Tenants page with step-by-step application and tenancy guidance block.

---

## 7. Testimonials / Reviews (client = tenants)

**Implementation:** Copy as "Tenant & landlord feedback". Admin approval: in-app (§17) or external. Form keeps role selector and "reviewed before publishing" message.

**Deliverables:** Wording tuned; admin approval API and portal block (§17).

---

## 8. Login Portal – Secure access

**Implementation:** Clear "Portal for owners and tenants" copy; role selection at register; rate limiting; HTTPS and JWT_SECRET in prod; frontend `.env.example` and README. See §15 for role-aware dashboard.

**Deliverables:** Login/register/portal flow; role at registration; security and env docs.

---

## 9. Production hardening

SEO (metadata, sitemap, robots); error/loading states; accessibility; next/image for property/team images; security per §8 and §15.

---

## 10. Data model extensions (backend – Prisma)

**Goal:** Landlord-owned properties, tenancies, applications, maintenance linked to property/tenant, financial visibility.

**Schema changes:**

- **User:** role; relations for landlord properties and tenant tenancies.
- **Property:** `landlordId String?`, `status` (DRAFT | LIVE | ARCHIVED). Public list filter `status = "LIVE"`.
- **MaintenanceRequest:** optional `propertyId`, `tenantId`; keep text fields for public form.
- **TenancyApplication:** propertyId, applicant details, status (PENDING | APPROVED | REJECTED).
- **Tenancy:** propertyId, tenantId, startDate, endDate?, rentAmount, depositAmount, status (ACTIVE | NOTICE_GIVEN | ENDED).
- **RentLedgerEntry:** tenancyId, dueDate, amount, type, status (DUE | PAID | OVERDUE), paidAt?, reference?. Optional Statement for monthly summary.

**Deliverables:** Migrations; seed updates; all landlord/tenant routes scoped by ownership.

---

## 11. Landlord portal: list and manage properties

**APIs (LANDLORD only, filter by landlordId):** GET/POST/PUT landlord properties; optional admin approve (DRAFT → LIVE).

**Frontend:** Portal dashboard "My Properties"; `/portal/properties` (list, add property); `/portal/properties/[id]` with tabs: Overview, Tenant placement (§12), Maintenance (§13), Financials (§14).

**Deliverables:** Landlord property CRUD; portal list, create/edit form, property detail with tabs.

---

## 12. Tenant placement and applications

**APIs:** Tenant submit application; GET my applications. Landlord GET applications per property; approve (create Tenancy) / reject.

**Frontend:** "Apply for this property" (public or /apply/[propertyId]); landlord tab: list applications, Approve/Reject; tenant portal: "My applications".

**Deliverables:** TenancyApplication + Tenancy flow; landlord approve/reject; tenant "My applications".

---

## 13. Maintenance: landlord and tenant visibility

**Backend:** MaintenanceRequest.propertyId, tenantId; tenant submit from portal links property/tenant; public form unchanged.

**APIs:** Tenant: GET my requests, POST scoped. Landlord: GET all for their properties, GET by property, PATCH status/note. Admin: existing dashboard.

**Frontend:** Tenant portal: "My maintenance requests", "Report issue" (pre-fill from tenancy). Landlord portal: dashboard open count; property Maintenance tab (table, status update). Public /maintenance-request unchanged.

**Deliverables:** Maintenance linked to property/tenant; landlord view and status updates; tenant view and scoped submit.

---

## 14. Financial summary in-app (landlord and tenant)

**Backend:** RentLedgerEntry. Landlord: GET financials/summary, GET property/:id/financials. Tenant: GET tenant/financials (current tenancy).

**Frontend:** Landlord: dashboard cards (rent due, collected, overdue); property Financials tab. Tenant: "Rent" section (upcoming, history). Optional: actual payments via external portal; in-app is visibility.

**Deliverables:** RentLedgerEntry and APIs; landlord and tenant financial views; optional Statement generation.

---

## 15. Role-aware portal and auth

**Register:** "I am a: Landlord / Tenant" selector; backend accepts role (LANDLORD | TENANT), default TENANT.

**Portal by role:** ADMIN – enquiries, maintenance, testimonial approval (§17), optional draft moderation. LANDLORD – My Properties, maintenance count, financial summary. TENANT – Your home, rent summary, My maintenance requests, My applications.

**Security:** All landlord/tenant APIs enforce role and resource ownership; rate-limit auth and forms; HTTPS and strong JWT_SECRET; `.env.example` and README.

**Deliverables:** Role at register; portal dashboard branches; security and env docs.

---

## 16. Owners and Tenants marketing pages (alignment with portal)

**Owners:** "What you can do in your landlord portal" (list/manage properties, tenancies, maintenance, rent/statements); "How it works"; CTAs Create landlord account, Portal login.

**Tenants:** Portal explanation (tenancy, rent, maintenance); step-by-step application; CTAs Create account, Sign in.

**Deliverables:** Copy and CTAs reflect real portal capabilities.

---

## 17. Testimonials admin in portal

**Backend:** GET admin/testimonials?approved=false; PATCH admin/testimonials/:id (approve/reject). ADMIN only.

**Frontend:** Admin section on /portal: list pending; Approve/Reject. Optional "Tenant & landlord feedback" wording on testimonials page.

**Deliverables:** Admin testimonial approval API and portal UI.

---

## Suggested implementation order

**Phase 1 – Backend and portal product:** (1) §10 Data model. (2) §15 Auth and role-aware portal. (3) §11 Landlord properties. (4) §13 Maintenance visibility. (5) §12 Tenant placement. (6) §14 Financial summary. (7) §17 Testimonials admin.

**Phase 2 – Content and polish:** (8) About Us (§1). (9) Property detail gallery (§3). (10) Financial/Owners/Tenants pages (§4, §5, §6, §16). (11) Maintenance & Inspections (§2). (12) Testimonials wording (§7). (13) Production hardening (§9).

---

## Out of scope (unless requested)

- Building a full **external** client portal/CRM (this app provides the in-app portal; external link for payments/documents remains optional).
- Storing payment card/bank details; payment processing in external system; in-app is rent visibility and KPIs only.
- Blog and other existing pages left as-is except for cross-links and consistency.
