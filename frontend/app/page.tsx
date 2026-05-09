/**
 * app/page.tsx
 * ------------
 * SiteScapr landing page - root route (/).
 * Sections: Hero (Three.js globe) → How it works → Features → Stats → CTA → Footer
 */

import Link from "next/link";
import Footer from "@/components/Footer";
import GlobeWrapper from "@/components/GlobeWrapper";
import { auth } from "@clerk/nextjs/server";

const steps = [
  {
    number: "01",
    title: "Describe your business",
    description: "Tell us your business type, target demographic, and budget range. Takes under 60 seconds.",
  },
  {
    number: "02",
    title: "AI scores every neighborhood",
    description: "Our engine analyzes income levels, foot traffic, competition density, rent costs, and population data across 15+ neighborhoods.",
  },
  {
    number: "03",
    title: "Review ranked results",
    description: "See your top-ranked locations on an interactive map with detailed score breakdowns and AI-generated reasoning.",
  },
];

const metrics = [
  { label: "Income Index", description: "Average household income and purchasing power of the area.", color: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
  { label: "Foot Traffic", description: "Estimated daily footfall from nearby transit, landmarks, and density.", color: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-500" },
  { label: "Competition Density", description: "Number of similar businesses already in the catchment area.", color: "bg-teal-50 border-teal-200 text-teal-700", dot: "bg-teal-500" },
  { label: "Commercial Rent", description: "Indexed cost of commercial space relative to your stated budget.", color: "bg-cyan-50 border-cyan-200 text-cyan-700", dot: "bg-cyan-500" },
  { label: "Population Density", description: "Residential and commercial density indicating market size potential.", color: "bg-lime-50 border-lime-200 text-lime-700", dot: "bg-lime-500" },
];

const stats = [
  { value: "15+", label: "Kolkata neighborhoods" },
  { value: "5", label: "Weighted metrics" },
  { value: "< 3s", label: "Analysis time" },
  { value: "12h", label: "Data refresh cycle" },
];

const pipelineSteps = [
  { label: "Data Signals", description: "Real-world signals are continuously gathered for each neighbourhood" },
  { label: "AI Analysis", description: "Signals are interpreted and translated into meaningful scores" },
  { label: "Score Update", description: "The backend quietly adjusts indices to reflect current conditions" },
  { label: "Your Results", description: "Every analysis you run is grounded in up-to-date neighbourhood data" },
];

export default async function LandingPage() {
  const { userId } = await auth();
  const ctaHref = userId ? "/app" : "/sign-up";
  return (
    <div className="bg-cream text-black">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-cream via-green-50/30 to-cream pointer-events-none" />
        <div aria-hidden className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-green-100 opacity-30 blur-[100px] pointer-events-none" />
        <div className="relative max-w-screen-xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-24">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 w-fit mb-7">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">AI-Powered · Live Data · Kolkata Beta</span>
            </div>
            <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.05] tracking-tight">
              Find the <span className="text-green-600">Right<br />Location</span>{" "}
              Before<br />You Sign One<span className="text-green-600">.</span>
            </h1>
            <p className="mt-6 text-gray-500 text-lg leading-relaxed max-w-md">
              Stop guessing. SiteScapr uses a scoring engine to rank Kolkata neighborhoods for your specific business: 
              scoring income, foot traffic, competition, and more.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={ctaHref} className="bg-black text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg text-sm tracking-wide">
                Start Free Analysis →
              </Link>
              <Link href="/pricing" className="border border-gray-200 text-black font-semibold px-7 py-3.5 rounded-2xl hover:bg-gray-50 transition-all text-sm tracking-wide">
                View Pricing
              </Link>
            </div>
            <p className="mt-5 text-xs text-gray-400 font-bold flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sign up free and run your first analysis today
            </p>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-100">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold tracking-tight">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full aspect-square max-w-[580px] mx-auto lg:mx-0 lg:ml-auto overflow-visible">
            <GlobeWrapper />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#f4f3ee] py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">How it works</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight">From idea to insight in minutes</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto text-base">No spreadsheets. No consultants. Just tell us about your business and let the AI do the heavy lifting.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="bg-[#f4f3ee] rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-gray-300 tracking-widest">{step.number}</span>
                <h3 className="mt-2 font-bold text-base tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-24 bg-cream">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">The scoring engine</span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight leading-tight">
                Five metrics.<br />One intelligent score.
              </h2>
              <p className="mt-4 text-gray-500 text-base leading-relaxed max-w-md">
                Each neighborhood is evaluated across five proprietary dimensions, weighted and combined into a single composite score tailored to your business type.
              </p>
              <Link href="/app" className="mt-8 inline-block bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all text-sm shadow-md hover:shadow-lg">
                Run an analysis
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {metrics.map((m) => (
                <div key={m.label} className={`flex items-start gap-4 p-4 rounded-xl border ${m.color}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${m.dot} mt-1 shrink-0`} />
                  <div>
                    <p className="font-semibold text-sm">{m.label}</p>
                    <p className="text-xs mt-0.5 opacity-80 leading-relaxed">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="bg-[#f4f3ee] py-24 border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Always current</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight">Scores that update themselves</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto text-base">
              Behind the scenes, an automated system keeps neighbourhood scores in sync with what&apos;s
              actually happening on the ground - so you never have to worry about stale data.
            </p>
          </div>

          {/* Flow */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {pipelineSteps.map((step, i) => (
              <div key={step.label} className="flex flex-col md:flex-row items-center">
                <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-52 hover:shadow-md transition-shadow">
                  <p className="font-bold text-sm tracking-tight">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{step.description}</p>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="hidden md:flex items-center mx-2 text-gray-300 text-2xl font-thin select-none">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Badge row */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              { label: "Automated", color: "bg-purple-50 border-purple-200 text-purple-700" },
              { label: "Real-world signals", color: "bg-blue-50 border-blue-200 text-blue-700" },
              { label: "AI-interpreted", color: "bg-orange-50 border-orange-200 text-orange-700" },
              { label: "Live indices", color: "bg-green-50 border-green-200 text-green-700" },
              { label: "15 neighbourhoods", color: "bg-teal-50 border-teal-200 text-teal-700" },
              { label: "Runs periodically", color: "bg-gray-50 border-gray-200 text-gray-600" },
            ].map((b) => (
              <span key={b.label} className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${b.color}`}>{b.label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-7">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-green-400 tracking-wide uppercase">Free to start</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Make your next location<br />decision with confidence.
          </h2>
          <p className="mt-5 text-gray-400 text-lg max-w-lg mx-auto">
            Join entrepreneurs already using SiteScapr to de-risk their most important business decision.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href={ctaHref} className="bg-white text-black font-semibold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-lg text-sm tracking-wide">
              Start Free Analysis →
            </Link>
            <Link href="/pricing" className="border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all text-sm tracking-wide">
              Compare Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
