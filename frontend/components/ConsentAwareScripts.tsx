"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getScriptPermissions, readConsent } from "@/lib/cookie-consent";

function safeGaMeasurementId(raw: string | undefined): string | null {
  if (!raw) return null;
  const id = raw.trim();
  return /^G-[A-Z0-9]+$/i.test(id) ? id : null;
}

function safeMetaPixelId(raw: string | undefined): string | null {
  if (!raw) return null;
  const id = raw.trim();
  return /^\d{5,20}$/.test(id) ? id : null;
}

/** Sends GA4 virtual page views on App Router client navigations (initial load is covered by gtag config). */
function GaRouteReporter({ gaId, active }: { gaId: string; active: boolean }) {
  const pathname = usePathname() || "/";
  const seenPath = useRef<string | null>(null);

  useEffect(() => {
    if (!active) return;

    const send = () => {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      if (typeof w.gtag !== "function") return false;
      w.gtag("config", gaId, { page_path: pathname });
      return true;
    };

    if (seenPath.current === null) {
      seenPath.current = pathname;
      return;
    }
    if (seenPath.current === pathname) return;
    seenPath.current = pathname;

    if (send()) return;
    const started = Date.now();
    const id = window.setInterval(() => {
      if (send() || Date.now() - started > 5000) window.clearInterval(id);
    }, 80);
    return () => window.clearInterval(id);
  }, [pathname, gaId, active]);

  return null;
}

function MetaRouteReporter({ active }: { active: boolean }) {
  const pathname = usePathname() || "/";
  const seenPath = useRef<string | null>(null);

  useEffect(() => {
    if (!active) return;
    if (seenPath.current === null) {
      seenPath.current = pathname;
      return;
    }
    if (seenPath.current === pathname) return;
    seenPath.current = pathname;
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    if (typeof w.fbq === "function") w.fbq("track", "PageView");
  }, [pathname, active]);

  return null;
}

export default function ConsentAwareScripts() {
  const [perms, setPerms] = useState({ analytical: false, marketing: false });

  const gaId = useMemo(() => safeGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID), []);
  const metaPixelId = useMemo(() => safeMetaPixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID), []);

  useEffect(() => {
    const sync = () => setPerms(getScriptPermissions(readConsent()));
    sync();
    window.addEventListener("asta-cookie-consent", sync);
    return () => window.removeEventListener("asta-cookie-consent", sync);
  }, []);

  return (
    <>
      {gaId && perms.analytical ? (
        <>
          <GaRouteReporter gaId={gaId} active />
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="asta-gtag-init" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: true });
            `.trim()}
          </Script>
        </>
      ) : null}

      {metaPixelId && perms.marketing ? (
        <>
          <MetaRouteReporter active />
          <Script id="asta-meta-pixel" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaPixelId}');
fbq('track','PageView');
          `.trim()}
          </Script>
        </>
      ) : null}
    </>
  );
}
