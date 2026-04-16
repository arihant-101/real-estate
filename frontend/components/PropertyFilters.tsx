"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Area = { id: string; name: string; slug: string };

export function PropertyFilters({
  areas,
  searchParams,
}: {
  areas: Area[];
  searchParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.search ?? "");
  const [listingType, setListingType] = useState(searchParams.listingType ?? "");
  const [areaId, setAreaId] = useState(searchParams.areaId ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice ?? "");
  const [beds, setBeds] = useState(searchParams.beds ?? "");

  const apply = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (listingType) params.set("listingType", listingType);
    if (areaId) params.set("areaId", areaId);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    params.set("page", "1");
    router.push(`/property-listings?${params.toString()}`);
  }, [search, listingType, areaId, minPrice, maxPrice, beds, router]);

  const inputClass = "rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none [&>option]:bg-panel";
  const selectClass = "!rounded-none appearance-none border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-white/40 focus:outline-none [&>option]:bg-panel";
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-panel/50 p-4 sm:gap-4 sm:p-5">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`min-w-[140px] ${inputClass}`}
      />
      <select
        value={listingType}
        onChange={(e) => setListingType(e.target.value)}
        className={selectClass}
      >
        <option value="">All types</option>
        <option value="RENTAL">Rental</option>
        <option value="HOLIDAY_LET">Holiday let</option>
      </select>
      <select
        value={areaId}
        onChange={(e) => setAreaId(e.target.value)}
        className={selectClass}
      >
        <option value="">All areas</option>
        {areas.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className={`w-28 ${inputClass}`}
      />
      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className={`w-28 ${inputClass}`}
      />
      <input
        type="number"
        placeholder="Beds"
        value={beds}
        onChange={(e) => setBeds(e.target.value)}
        min={1}
        className={`w-20 ${inputClass}`}
      />
      <button
        type="button"
        onClick={apply}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-primary-light"
      >
        Search
      </button>
    </div>
  );
}
