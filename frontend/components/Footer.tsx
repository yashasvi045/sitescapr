/**
 * Footer.tsx
 * ----------
 * Site-wide footer for SiteScapr.
 */

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-cream">
      <div className="max-w-screen-xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </span>
            <span className="font-bold text-lg tracking-tight">SiteScapr</span>
          </div>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            SaaS intelligence for entrepreneurs making high-stakes location decisions. Currently in beta for Kolkata.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-semibold">
              Kolkata Beta
            </span>
            <span className="text-xs text-gray-400">More cities coming in 2026</span>
          </div>
        </div>

        {/* Product links */}
        <div>
          <p className="text-xs font-bold text-black uppercase tracking-wider mb-4">Product</p>
          <ul className="flex flex-col gap-3 text-sm text-gray-500">
            <li><Link href="/app" className="hover:text-black transition-colors">Analyze a Location</Link></li>
            <li><Link href="/compare" className="hover:text-black transition-colors">Compare Locations</Link></li>
            <li><Link href="/methodology" className="hover:text-black transition-colors">Methodology</Link></li>
            <li><Link href="/status" className="hover:text-black transition-colors">System Status</Link></li>
            <li><Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link></li>
            <li><span className="text-gray-300 cursor-not-allowed">Dashboard (soon)</span></li>
          </ul>
        </div>

        {/* Company links */}
        <div>
          <p className="text-xs font-bold text-black uppercase tracking-wider mb-4">Company</p>
          <ul className="flex flex-col gap-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-black transition-colors">About</a></li>
            <li><a href="mailto:hello@sitescapr.com" className="hover:text-black transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2026 SiteScapr. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Built for{" "}
            <span className="font-semibold text-gray-500">MSMEs & More</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
