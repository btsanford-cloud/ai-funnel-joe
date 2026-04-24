"use client";

import { useState } from "react";

// ⬇️ Same affiliate URL as the bridge page. Keep them in sync.
const AFFILIATE_URL =
  process.env.NEXT_PUBLIC_AFFILIATE_URL || "https://example.com?ref=affiliate";

export default function BonusPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
    } catch (err) {
      console.error("Subscribe request failed:", err);
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 pt-24 pb-20 sm:pt-28 sm:pb-24">
      <section className="w-full text-center">
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Get the AI Business Build Breakdown
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-neutral-200 sm:text-xl sm:leading-8">
          I&rsquo;ll send you a simple step-by-step summary of how the AI
          dashboard and system are set up so you can follow and apply it
          yourself.
        </p>

        {status !== "success" ? (
          <form onSubmit={handleSubmit} className="mt-12 space-y-5">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-5 text-lg text-neutral-100 placeholder-neutral-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-emerald-500 px-6 py-5 text-xl font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Sending..." : "Send Me the Step-by-Step Breakdown"}
            </button>

            {status === "error" && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-left text-base text-red-300 sm:text-lg"
              >
                {errorMsg || "Something went wrong. Please try again."}
              </div>
            )}
          </form>
        ) : (
          <div className="mt-12 space-y-6">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-6 text-emerald-300">
              <p className="text-lg font-medium sm:text-xl">
                You&rsquo;re in. Check your email after watching the demo.
              </p>
            </div>

            <a
              href={AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full rounded-xl bg-emerald-500 px-8 py-5 text-xl font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 sm:text-2xl"
            >
              Now Go Watch the Live Build →
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
