"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomSelect } from "./ui/CustomSelect";

type Area = { id: string; name: string; slug: string };

export function HeroSearch({ areas = [] }: { areas?: Area[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("");
  const [areaId, setAreaId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (listingType) params.set("listingType", listingType);
    if (areaId) params.set("areaId", areaId);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    params.set("page", "1");
    router.push(`/property-listings?${params.toString()}`);
  }

  const inputClass =
    "rounded border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/50 focus:border-white/40 focus:outline-none [&>option]:bg-panel";

  const typeOptions = [
    { value: "RENTAL", label: "Rental" },
    { value: "HOLIDAY_LET", label: "Holiday Let" },
  ];
  const areaOptions = areas.map((a) => ({ value: a.id, label: a.name }));
  const bedsOptions = [1, 2, 3, 4, 5].map((n) => ({
    value: String(n),
    label: `${n}+`,
  }));

  return (
    <div className="rounded-xl border border-white/10 bg-overlay/50 p-4 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Location or search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`min-w-[140px] flex-1 ${inputClass}`}
          aria-label="Search location"
        />
        <CustomSelect
          value={listingType}
          onChange={setListingType}
          options={typeOptions}
          placeholder="Type"
          aria-label="Listing type"
        />
        <CustomSelect
          value={areaId}
          onChange={setAreaId}
          options={areaOptions}
          placeholder="Area"
          aria-label="Area"
          className="min-w-[160px]"
        />
        <input
          type="number"
          placeholder="Min. price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min={0}
          className={`w-24 ${inputClass}`}
        />
        <CustomSelect
          value={beds}
          onChange={setBeds}
          options={bedsOptions}
          placeholder="Beds"
          aria-label="Number of beds"
          className="min-w-[140px]"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="rounded border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-black transition hover:bg-primary-light hover:border-primary-light"
        >
          Search
        </button>
      </div>
    </div>
  );
}
