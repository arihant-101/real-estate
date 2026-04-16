"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function safeInternalPath(raw: string | null): string | null {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t.startsWith("/")) return null;
  if (t.startsWith("//")) return null;
  if (t.includes("://")) return null;
  return t;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      const from = safeInternalPath(searchParams.get("from"));
      if (from) {
        router.push(from);
      } else {
        router.push(user.role === "ADMIN" ? "/admin" : "/portal");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Portal Login</h1>
        <p className="mt-2 text-muted">
          Access your secure client portal for property management, payments, and documents.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-white/10 bg-panel/50 p-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email Address
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
            placeholder="Enter your registered email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-muted focus:border-white/40 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-black transition hover:bg-primary-light disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Access Portal"}
        </button>
      </form>

      <div className="mt-6 space-y-4 text-center text-sm">
        <div>
          <p className="text-muted">
            Forgot your password?{" "}
            <button type="button" className="text-primary hover:underline">
              Reset Password
            </button>
          </p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-muted">
            Need help accessing your portal?{" "}
            <Link href="/login-portal-help" className="text-primary hover:underline">
              View instructions & FAQ
            </Link>
          </p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>{" "}
            to get portal access.
          </p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <Link href="/login-portal" className="inline-flex items-center gap-1 text-primary hover:underline">
            Learn about our portal features
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
