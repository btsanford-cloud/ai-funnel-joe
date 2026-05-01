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

      // Fire Meta Pixel Lead event
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "AI Joe Webinar Breakdown",
          content_category: "Lead Magnet",
        });
      }
    } catch (err) {
      console.error("Subscribe request failed:", err);
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[720px] flex-col items-center px-6 pt-20 pb-20 sm:pt-28 sm:pb-24">
      <section className="w-full text-center">
        <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
          Most people watch this AI demo… and completely miss what actually
          makes it work.
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-neutral-300 sm:text-xl sm:leading-8">
          This is why most people never get results from stuff like this.
        </p>
      </section>

      {status !== "success" && (
        <section className="mt-10 w-full text-center">
          <p className="text-lg leading-relaxed text-neutral-200 sm:text-xl sm:leading-8">
            They see the tools. They see the dashboards. But they don&rsquo;t
            understand how it actually connects into a system that produces
            results.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-neutral-200 sm:text-xl sm:leading-8">
            I sat through the entire build and pulled out the exact parts that
            actually matter—so you don&rsquo;t waste time trying to figure it
            out.
          </p>

          <p className="mt-12 text-lg font-semibold text-white sm:text-xl">
            Inside the breakdown:
          </p>

          <ul className="mx-auto mt-5 max-w-[520px] list-disc space-y-3 pl-6 text-left text-lg leading-8 text-neutral-200 marker:text-emerald-400 sm:text-xl sm:leading-9">
            <li>How the system connects marketing → leads → sales</li>
            <li>The exact flow it uses to capture and convert traffic</li>
            <li>
              Why most people overcomplicate this (and how this avoids it)
            </li>
          </ul>

          <p className="mt-12 text-lg leading-relaxed text-neutral-200 sm:text-xl sm:leading-8">
            Without this… the demo just looks impressive. With this…
            you&rsquo;ll actually understand how to use it.
          </p>
        </section>
      )}

      <section className="mt-10 w-full">
        {status !== "success" ? (
          <>
            <p className="mb-5 text-center text-lg font-medium text-white sm:text-xl">
              If you&rsquo;re going to watch this, don&rsquo;t do it without
              this breakdown.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full rounded-xl bg-emerald-500 px-6 py-5 text-lg font-bold leading-tight text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70 sm:text-xl"
              >
                {status === "loading"
                  ? "Sending..."
                  : "Send me the breakdown so I can follow this"}
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

            <p className="mt-5 text-center text-base text-neutral-400 sm:text-lg">
              No spam. Just the breakdown + the demo link.
            </p>
          </>
        ) : (
          <div className="space-y-6 text-center">
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
