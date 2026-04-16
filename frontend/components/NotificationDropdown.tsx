"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { notificationsApi, type NotificationItem } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.list(15);
      setItems(res.items);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  usePolling(fetchNotifications, 15000, open);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) fetchNotifications();
        }}
        className="relative rounded p-2 text-white/90 hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {items.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-black">
            {items.length > 9 ? "9+" : items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-none border border-white/10 bg-surface/95 shadow-xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <p className="text-xs text-muted">Maintenance & application updates</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted">No notifications yet</div>
            ) : (
              <ul className="divide-y divide-white/5">
                {items.map((n) => (
                  <li key={`${n.type}-${n.id}`}>
                    <Link
                      href={n.link}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 transition hover:bg-white/5"
                    >
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted line-clamp-2">{n.message}</p>
                      <p className="mt-1 text-[10px] text-muted">{formatTime(n.updatedAt)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {(items.length > 0 && (
            <div className="border-t border-white/10 px-4 py-2">
              <Link
                href="/portal"
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-medium text-primary hover:text-primary-light"
              >
                View portal
              </Link>
            </div>
          )) || null}
        </div>
      )}
    </div>
  );
}
