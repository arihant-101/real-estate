/** Set NEXT_PUBLIC_API_BASE in production when frontend and backend are on different origins. */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export type User = { id: string; email: string; name: string | null; role: string };
export type Property = {
  id: string;
  title: string;
  description: string | null;
  address: string;
  city: string;
  postCode: string;
  listingType: "RENTAL" | "HOLIDAY_LET";
  beds: number;
  baths: number;
  areaSqFt: number;
  pricePerMonth: string | number;
  isFeatured: boolean;
  images?: { id: string; url: string; order: number }[];
  area?: { id: string; name: string; slug: string } | null;
};
export type Area = { id: string; name: string; slug: string; imageUrl: string | null; description: string | null };
export type BlogPost = { id: string; title: string; slug: string; excerpt: string | null; publishedAt: string | null; author: string | null };
export type Testimonial = {
  id: string;
  authorName: string;
  role: string;
  content: string;
  rating: number | null;
  includeNameLocation?: boolean;
  photoData?: string | null;
};
export type EnquirySummary = { id: string; name: string; email: string; subject: string | null; source: string; createdAt: string };
export type MaintenanceSummary = {
  id: string;
  tenantName: string;
  tenantEmail: string;
  propertyAddressOrRef: string;
  issueCategory: string;
  urgency: string;
  status: string;
  channel?: string;
  createdAt: string;
};

export type MaintenanceRequestDetail = {
  id: string;
  tenantName: string;
  tenantEmail: string;
  propertyAddressOrRef: string;
  issueCategory: string;
  description?: string;
  urgency: string;
  status: string;
  channel?: string;
  photoAttachments?: string | null;
  createdAt: string;
  property?: { id: string; title: string; address: string; city?: string };
  tenant?: { id: string; name: string | null; email: string };
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function api<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string | number | undefined> } = {}
): Promise<T> {
  const { params, ...init } = options;
  const cleaned: Record<string, string> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") cleaned[k] = String(v);
    }
  }
  const url = Object.keys(cleaned).length ? `${API_BASE}${path}?${new URLSearchParams(cleaned)}` : `${API_BASE}${path}`;
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as object),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || res.statusText || "Request failed");
  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<{ user: User; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, name?: string, role?: "LANDLORD" | "TENANT") =>
    api<{ user: User; token: string }>("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, name, role }) }),
  me: () => api<User>("/api/auth/me"),
};

export const propertiesApi = {
  list: (params?: { page?: number; limit?: number; search?: string; listingType?: string; areaId?: string; minPrice?: string; maxPrice?: string; beds?: string; featured?: string }) =>
    api<{ items: Property[]; total: number; page: number; limit: number }>("/api/properties", { params: params as Record<string, string> }),
  get: (id: string) => api<Property>(`/api/properties/${id}`),
  getAvailability: (id: string) =>
    api<{ items: Array<{ id: string; startDate: string; endDate: string }> }>(`/api/properties/${id}/availability`),
};

export const areasApi = {
  list: () => api<Area[]>("/api/areas"),
};

export const enquiriesApi = {
  submit: (body: { name: string; email: string; phone?: string; subject?: string; message: string; consent: boolean }) =>
    api<{ id: string }>("/api/enquiries", { method: "POST", body: JSON.stringify(body) }),
};

export const maintenanceApi = {
  submit: (body: { tenantName: string; tenantEmail: string; propertyAddressOrRef: string; issueCategory: string; description: string; urgency?: string; propertyId?: string }) =>
    api<{ id: string }>("/api/maintenance-requests", { method: "POST", body: JSON.stringify(body) }),
};

export const blogApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api<{ items: BlogPost[]; total: number }>("/api/blog", { params: params as Record<string, string> }),
  get: (slug: string) => api<BlogPost & { body: string }>(`/api/blog/${slug}`),
};

export const testimonialsApi = {
  list: () => api<Testimonial[]>("/api/testimonials"),
  submit: (body: {
    authorName: string;
    role: string;
    content: string;
    rating?: number;
    emailForVerification?: string;
    includeNameLocation: boolean;
    consent: boolean;
    photoData?: string | null;
  }) =>
    api<{ id: string }>("/api/testimonials", { method: "POST", body: JSON.stringify(body) }),
};

export const favoritesApi = {
  list: () => api<Property[]>("/api/users/me/favorites"),
  add: (propertyId: string) => api<{ message: string }>(`/api/users/me/favorites/${propertyId}`, { method: "POST" }),
  remove: (propertyId: string) => api<{ message: string }>(`/api/users/me/favorites/${propertyId}`, { method: "DELETE" }),
};

export type NotificationItem = {
  type: "maintenance" | "application";
  id: string;
  title: string;
  message: string;
  link: string;
  createdAt: string;
  updatedAt: string;
};

export const notificationsApi = {
  list: (limit?: number) =>
    api<{ items: NotificationItem[] }>("/api/users/me/notifications", { params: { limit } }),
};

export type AdminAnalytics = {
  landlordsCount: number;
  tenantsCount: number;
  propertiesCount: number;
  enquiriesCount: number;
  maintenance: { total: number; pending: number; in_progress: number; resolved: number };
  applications: { total: number; PENDING: number; APPROVED: number; REJECTED: number };
  recentMaintenance: Array<MaintenanceSummary & { property?: { id: string; title: string; address: string } }>;
  recentApplications: TenancyApplicationItem[];
  recentEnquiries: EnquirySummary[];
};

export const adminApi = {
  getAnalytics: () => api<AdminAnalytics>("/api/admin/analytics"),
  listEnquiries: (limit = 5) =>
    api<{ items: EnquirySummary[] }>("/api/enquiries", { params: { limit } }),
  listMaintenanceRequests: (limit = 5) =>
    api<{ items: MaintenanceSummary[] }>("/api/maintenance-requests", { params: { limit } }),
  listRepairsWizard: (limit = 100) =>
    api<{ items: MaintenanceRequestDetail[] }>("/api/admin/repairs", { params: { limit } }),
  updateRepairRequestStatus: (id: string, status: "pending" | "in_progress" | "resolved") =>
    api<MaintenanceRequestDetail>(`/api/admin/maintenance-requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  listPendingTestimonials: (limit = 50) =>
    api<{ items: Testimonial[] }>("/api/admin/testimonials", { params: { approved: "false", limit } }),
  updateTestimonialApproval: (id: string, isApproved: boolean) =>
    api<{ id: string; isApproved: boolean }>(`/api/admin/testimonials/${id}`, { method: "PATCH", body: JSON.stringify({ isApproved }) }),
};

export type LandlordProperty = Property & {
  status?: string;
  openMaintenanceCount?: number;
  activeTenanciesCount?: number;
};

export const landlordApi = {
  listProperties: (params?: { page?: number; limit?: number }) =>
    api<{ items: LandlordProperty[]; total: number; page: number; limit: number }>("/api/landlord/properties", { params: params as Record<string, string> }),
  getProperty: (id: string) => api<LandlordProperty>("/api/landlord/properties/" + id),
  createProperty: (body: Record<string, unknown>) =>
    api<LandlordProperty>("/api/landlord/properties", { method: "POST", body: JSON.stringify(body) }),
  updateProperty: (id: string, body: Record<string, unknown>) =>
    api<LandlordProperty>("/api/landlord/properties/" + id, { method: "PUT", body: JSON.stringify(body) }),
  listMaintenanceRequests: (limit?: number) =>
    api<{ items: MaintenanceRequestDetail[] }>("/api/landlord/maintenance-requests", { params: { limit } }),
  listPropertyMaintenance: (propertyId: string) =>
    api<{ items: MaintenanceRequestDetail[] }>(`/api/landlord/properties/${propertyId}/maintenance-requests`),
  updateMaintenanceStatus: (id: string, status: string) =>
    api<MaintenanceRequestDetail>(`/api/landlord/maintenance-requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  listApplications: (propertyId: string) =>
    api<{ items: TenancyApplicationItem[] }>(`/api/landlord/properties/${propertyId}/applications`),
  approveApplication: (id: string) =>
    api<unknown>(`/api/landlord/applications/${id}/approve`, { method: "POST" }),
  rejectApplication: (id: string) =>
    api<unknown>(`/api/landlord/applications/${id}/reject`, { method: "POST" }),
  getFinancialSummary: () =>
    api<{ dueThisMonth: number; collected: number; overdue: number }>("/api/landlord/financials/summary"),
  getPropertyFinancials: (propertyId: string) =>
    api<{ tenancies: Array<{ id: string; tenant: unknown; rentLedgerEntries: Array<{ id: string; dueDate: string; amount: string | number; type: string; status: string }> }> }>(`/api/landlord/properties/${propertyId}/financials`),
  getPropertyActivity: (propertyId: string) =>
    api<{ views: Array<{ id: string; viewedAt: string; user?: { id: string; name: string | null; email: string } }>; maintenanceRequests: MaintenanceRequestDetail[]; applications: TenancyApplicationItem[] }>(`/api/landlord/properties/${propertyId}/activity`),
  getPropertyAnalytics: (propertyId: string) =>
    api<{ views: { last7d: number; last30d: number; allTime: number }; maintenance: { open: number; resolved: number }; applications: { pending: number; approved: number; rejected: number }; favoritesCount: number }>(`/api/landlord/properties/${propertyId}/analytics`),
  listPropertyAvailability: (propertyId: string) =>
    api<{ items: Array<{ id: string; startDate: string; endDate: string }> }>(`/api/landlord/properties/${propertyId}/availability`),
  addPropertyAvailability: (propertyId: string, body: { startDate: string; endDate: string }) =>
    api<{ id: string; startDate: string; endDate: string }>(`/api/landlord/properties/${propertyId}/availability`, { method: "POST", body: JSON.stringify(body) }),
  removePropertyAvailability: (propertyId: string, availabilityId: string) =>
    api<void>(`/api/landlord/properties/${propertyId}/availability/${availabilityId}`, { method: "DELETE" }),
};

export type TenancyApplicationItem = {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  property?: { id: string; title: string; address: string; city?: string };
};

export type TenantMaintenanceSubmitBody = {
  issueCategory: string;
  description: string;
  urgency?: string;
  channel?: "GENERAL" | "REPAIRS_WIZARD";
  roomOrFlat?: string;
  /** Repairs wizard (POST /tenant/maintenance-requests): free-text building / property */
  buildingOrProperty?: string;
  /** Repairs wizard: tenant’s full postal / visit address */
  fullAddress?: string;
  /** Repairs wizard: best phone for follow-up */
  contactPhone?: string;
  /** Repairs wizard: access preference */
  repairsAccessPreference?: "ABSENT_OK" | "TENANT_PRESENT";
  repairsAlarmInfo?: string;
  repairsParkingInfo?: string;
  repairsPetInfo?: string;
  repairsFurtherNotes?: string;
  vulnerableOccupier?: boolean;
  /** Required true for REPAIRS_WIZARD (server-validated) */
  repairsConsentAccepted?: boolean;
  issuePath?: string[];
  /** Base64 data URLs (max 4); required for some repair types (see repairs taxonomy). */
  photoAttachments?: string[];
  repairLeafId?: string;
};

export const tenantApi = {
  listMaintenanceRequests: (limit?: number) =>
    api<{ items: MaintenanceRequestDetail[] }>("/api/tenant/maintenance-requests", { params: { limit } }),
  /** Portal: request tied to a known property */
  submitMaintenanceRequest: (propertyId: string, body: TenantMaintenanceSubmitBody) =>
    api<{ id: string; message: string }>(`/api/tenant/properties/${propertyId}/maintenance-requests`, { method: "POST", body: JSON.stringify(body) }),
  /** /repairs guided flow: no property dropdown — building is free text */
  submitRepairsWizardRequest: (body: TenantMaintenanceSubmitBody & { buildingOrProperty: string }) =>
    api<{ id: string; message: string }>("/api/tenant/maintenance-requests", { method: "POST", body: JSON.stringify(body) }),
  listApplications: () =>
    api<{ items: TenancyApplicationItem[] }>("/api/tenant/applications"),
  getFinancials: () =>
    api<{ tenancy: { id: string; property: unknown; rentAmount: string | number; startDate: string } | null; entries: Array<{ id: string; dueDate: string; amount: string | number; type: string; status: string }> }>("/api/tenant/financials"),
};

export const tenanciesApi = {
  submitApplication: (body: { propertyId: string; name: string; email: string; phone?: string; employment?: string; references?: string }) =>
    api<{ id: string; message: string }>("/api/tenancies/applications", { method: "POST", body: JSON.stringify(body) }),
};
