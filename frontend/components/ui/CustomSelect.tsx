"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

const DROPDOWN_MAX_HEIGHT = 240; // max-h-60 = 15rem

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  "aria-label": ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  "aria-label"?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggle() {
    if (!open) {
      const rect = ref.current?.getBoundingClientRect();
      const spaceBelow = rect ? window.innerHeight - rect.bottom : DROPDOWN_MAX_HEIGHT;
      setOpenAbove(spaceBelow < DROPDOWN_MAX_HEIGHT);
    }
    setOpen((o) => !o);
  }

  const selected = options.find((o) => o.value === value);
  const display = selected?.label ?? placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? placeholder}
        className={`rounded-none border border-white/20 bg-white/10 px-3 py-2.5 text-left text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-sm min-w-0 ${className ?? ""}`}
      >
        {display}
      </button>
      {open && (
        <ul
          role="listbox"
          className={`absolute left-0 z-50 max-h-60 overflow-auto rounded-none border border-white/20 bg-overlay py-1 shadow-xl ${
            openAbove ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={value === opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white hover:bg-white/10 ${
                  value === opt.value ? "bg-primary/30" : ""
                }`}
              >
                {value === opt.value && (
                  <span className="text-primary" aria-hidden>
                    ✓
                  </span>
                )}
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
