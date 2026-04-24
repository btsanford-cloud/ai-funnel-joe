import Link from "next/link";

// ⬇️ REPLACE THIS with your real affiliate URL (or set NEXT_PUBLIC_AFFILIATE_URL in .env.local)
const AFFILIATE_URL =
  process.env.NEXT_PUBLIC_AFFILIATE_URL || "https://example.com?ref=affiliate";

export default function BridgePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[760px] flex-col items-center px-6 pt-24 pb-20 sm:pt-28 sm:pb-24">
      {/* HERO */}
      <section className="w-full text-center">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-emerald-400 sm:text-base">
          Free Live Demo — No Pitch, Just Watch It Happen
        </p>

        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
          Watch an AI Dashboard Build a Full Business in 60 Minutes — Live
        </h1>

        <p className="mt-8 text-xl leading-relaxed text-neutral-200 sm:text-2xl">
          I found a live demo where they actually build and run everything in
          real time — from ads to sales — in about 60 minutes.
        </p>

        <div className="mt-10 space-y-5 text-left text-lg leading-8 text-neutral-200 sm:text-xl sm:leading-9">
          <p>
            There are dozens of tools, platforms, dashboards, and things
            you&rsquo;re &ldquo;supposed&rdquo; to learn.
          </p>
          <p>That&rsquo;s where most people get stuck.</p>
          <p>What caught my attention about this was simple:</p>
          <p>It puts everything in ONE place.</p>
          <ul className="ml-6 list-disc space-y-2 text-neutral-200 marker:text-neutral-400">
            <li>your marketing</li>
            <li>your leads</li>
            <li>your sales</li>
            <li>your data</li>
            <li>even AI agents doing work for you</li>
          </ul>
          <p>All controlled from a single dashboard.</p>
          <p>But here&rsquo;s the part that made me actually pay attention…</p>
          <p>They&rsquo;re not just talking about it.</p>
          <p>They&rsquo;re showing it live.</p>
          <p>Instead of a pitch or theory, they literally sit down and:</p>
          <ul className="ml-6 list-disc space-y-2 text-neutral-200 marker:text-neutral-400">
            <li>build the offer</li>
            <li>set up the system</li>
            <li>run the marketing</li>
            <li>and show how it all connects</li>
          </ul>
          <p>in real time.</p>
          <p>No slides. No fluff. Just watching it happen.</p>
        </div>

        {/* PRIMARY CTA */}
        <div className="mt-12">
          <a
            href={AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full rounded-xl bg-emerald-500 px-10 py-5 text-xl font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 sm:w-auto sm:text-2xl"
          >
            Watch the AI Dashboard Live →
          </a>
          <p className="mt-5 text-base leading-relaxed text-neutral-300 sm:text-lg">
            It&rsquo;s free to watch, and there&rsquo;s no pitch upfront — just
            a real walkthrough of how the system works.
          </p>
        </div>
      </section>

      {/* BONUS SECTION - secondary, lighter emphasis */}
      <section className="mt-20 w-full border-t border-neutral-800 pt-12 text-center">
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-200 sm:text-lg sm:leading-8">
          I&rsquo;m also putting together a simple breakdown of exactly what
          they build and how the system is structured — so you can follow it
          later without guessing.
        </p>

        <div className="mt-8">
          <Link
            href="/bonus"
            className="inline-block rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-4 text-base font-medium text-neutral-100 transition hover:border-neutral-500 hover:bg-neutral-800 sm:text-lg"
          >
            Get the Breakdown &amp; Notes
          </Link>
        </div>
      </section>
    </main>
  );
}
