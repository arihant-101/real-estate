"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FAQItem = { q: string; a: string };

export function FAQAccordion({
  items,
  className,
}: {
  items: FAQItem[];
  /** e.g. margin top; defaults to mt-8 */
  className?: string;
}) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <dl className={`space-y-6 ${className ?? "mt-8"}`}>
      {items.map((faq, i) => {
        const isOpen = open.has(i);
        const panelId = `faq-panel-${i}`;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-white/10 bg-panel"
          >
            <dt>
              <button
                type="button"
                id={`faq-trigger-${i}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-start justify-between gap-4 p-6 text-left font-semibold text-white transition hover:bg-white/5 active:bg-white/[0.07]"
              >
                <span>
                  Q{i + 1}: {faq.q}
                </span>
                <ChevronDown
                  className={`mt-0.5 h-5 w-5 shrink-0 text-elegant-muted transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
            </dt>
            <dd
              id={panelId}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              hidden={!isOpen}
              className="border-t border-white/10 px-6 pb-6 pt-4 text-elegant-muted"
            >
              {faq.a}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
