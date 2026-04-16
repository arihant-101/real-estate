const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://realestate-u3vr.onrender.com";
const FETCH_TIMEOUT_MS = 8000;

async function fetchWithTimeout(
  url: string,
  opts: RequestInit & { next?: { revalidate: number } } = {}
) {
  const { next, ...rest } = opts;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...rest, signal: ctrl.signal, next });
  } finally {
    clearTimeout(t);
  }
}

export async function getAreas() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/areas`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getFeaturedProperties() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/properties?featured=true&limit=6`, { next: { revalidate: 60 } });
    if (!res.ok) return { items: [], total: 0, page: 1, limit: 6 };
    return res.json();
  } catch {
    return { items: [], total: 0, page: 1, limit: 6 };
  }
}

export async function getProperties(params: Record<string, string> = {}) {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetchWithTimeout(`${API_BASE}/api/properties?${q}`, { next: { revalidate: 30 } });
    if (!res.ok) return { items: [], total: 0, page: 1, limit: 12 };
    return res.json();
  } catch {
    return { items: [], total: 0, page: 1, limit: 12 };
  }
}

export async function getProperty(id: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/properties/${id}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getPropertyAvailability(id: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/properties/${id}/availability`, { next: { revalidate: 60 } });
    if (!res.ok) return { items: [] };
    return res.json();
  } catch {
    return { items: [] };
  }
}

export async function getBlogPosts(page = 1, limit = 10) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/blog?page=${page}&limit=${limit}`, { next: { revalidate: 60 } });
    if (!res.ok) return { items: [], total: 0 };
    return res.json();
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getBlogPost(slug: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getTestimonials() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/testimonials`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
