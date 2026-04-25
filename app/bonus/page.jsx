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
    <main className="mx-auto flex min-h-screen max-w-[760px] flex-col items-center px-6 pt-24 pb-20 sm:pt-28 sm:pb-24">
      <section className="w-full text-center">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-emerald-400 sm:text-base">
          Free AI Business Breakdown
        </p>

        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Watch How an AI System Builds a Full Business in 60 Minutes — Step by
          Step
        </h1>

        <p className="mt-6 text-xl leading-relaxed text-neutral-200 sm:text-2xl">
          No coding. No hiring. No overwhelm.
        </p>
      </section>

      {/* VALUE PREVIEW (only visible before submit) */}
      {status !== "success" && (
        <section className="mt-12 w-full text-left">
          <div className="space-y-5 text-lg leading-8 text-neutral-200 sm:text-xl sm:leading-9">
            <p>
              Last week, I watched something that completely changed how I
              think about building a business.
            </p>
            <p>Not another tool. Not another course.</p>
            <p>An actual system working together.</p>
            <p>Marketing. Leads. Sales.</p>
            <p>All running from one place.</p>
            <p>Here&rsquo;s the problem most people run into:</p>
            <p>
              There are too many tools. Too many platforms. Too many things
              you&rsquo;re &ldquo;supposed&rdquo; to learn.
            </p>
            <p>And it keeps you stuck.</p>
            <p>What caught my attention about this was simple:</p>
            <p>
              It puts everything in ONE place. And you can watch it get built
              live.
            </p>
            <p>No guessing. No piecing things together.</p>
            <p>
              Before you watch the full demo, I put together a simple
              breakdown so you can actually understand what&rsquo;s happening
              as you watch.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-lg font-semibold text-white sm:text-xl">
              Quick preview:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-3 text-lg leading-8 text-neutral-200 marker:text-emerald-400 sm:text-xl sm:leading-9">
              <li>
                How the system connects marketing → leads → sales
              </li>
              <li>The flow it uses to capture and convert traffic</li>
              <li>
                Why most people overcomplicate this and how this avoids it
              </li>
            </ul>
          </div>

          <div className="mt-10">
            <p className="text-lg leading-8 text-neutral-200 sm:text-xl sm:leading-9">
              Enter your email below and I&rsquo;ll send you:
            </p>
            <ul className="mt-3 ml-6 list-disc space-y-2 text-lg leading-8 text-neutral-200 marker:text-emerald-400 sm:text-xl sm:leading-9">
              <li>The step-by-step breakdown</li>
              <li>PLUS access to the full live demo</li>
            </ul>
          </div>
        </section>
      )}

      {/* FORM / SUCCESS STATE */}
      <section className="mt-10 w-full">
        {status !== "success" ? (
          <>
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
                className="w-full rounded-xl bg-emerald-500 px-6 py-5 text-xl font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading"
                  ? "Sending..."
                  : "Send Me the Breakdown + Demo"}
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

            <p className="mt-5 text-center text-base leading-relaxed text-neutral-400 sm:text-lg">
              No spam. Just the breakdown and the link so you can see it for
              yourself.
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
