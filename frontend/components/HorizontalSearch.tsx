"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomSelect } from "./ui/CustomSelect";

type Area = { id: string; name: string; slug: string };

export function HorizontalSearch({ areas = [] }: { areas?: Area[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("");
  const [areaId, setAreaId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [beds, setBeds] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (listingType) params.set("listingType", listingType);
    if (areaId) params.set("areaId", areaId);
    if (minPrice) params.set("minPrice", minPrice);
    if (beds) params.set("beds", beds);
    params.set("page", "1");
    router.push(`/property-listings?${params.toString()}`);
  }

  const inputClass =
    "rounded-none border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-sm transition-all duration-200";

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
    <div className="w-full max-w-6xl mx-auto">
      <div className="rounded-none border border-white/20 bg-black/35 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            Search Properties
          </p>
          <p className="mt-2 text-sm text-white/80">
            Whether you're searching for property management services in East London,
            listing a holiday home near the Essex coast, or looking for a tenant-ready flat to
            let in Islington, start by exploring our current listings.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex-1 max-w-[160px] min-w-[100px]">
            <input
              type="text"
              placeholder="Location or search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full ${inputClass}`}
              aria-label="Search location"
            />
          </div>
          <div className="w-[5.5rem]">
            <CustomSelect
              value={listingType}
              onChange={setListingType}
              options={typeOptions}
              placeholder="Type"
              aria-label="Listing type"
              className="w-full"
            />
          </div>
          <div className="flex-1 max-w-[100px] min-w-[80px]">
            <CustomSelect
              value={areaId}
              onChange={setAreaId}
              options={areaOptions}
              placeholder="Area"
              aria-label="Area"
              className="w-full"
            />
          </div>
          <div className="w-[5.5rem]">
            <input
              type="number"
              placeholder="Min. price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min={0}
              className={`w-full ${inputClass}`}
            />
          </div>
          <div className="w-[4.5rem]">
            <CustomSelect
              value={beds}
              onChange={setBeds}
              options={bedsOptions}
              placeholder="Beds"
              aria-label="Number of beds"
              className="w-full"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-none bg-primary px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25 shrink-0"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}