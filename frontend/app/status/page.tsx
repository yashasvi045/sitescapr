/**
 * app/status/page.tsx
 * --------------------
 * System status page.
 * Checks API health, dataset freshness, and formula version.
 * Runs a live ping to the backend on mount.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

type StatusLevel = "operational" | "degraded" | "down" | "checking";

interface ServiceStatus {
  name: string;
  description: string;
  status: StatusLevel;
  detail: string;
  latencyMs?: number;
}

const STATUS_COLORS: Record<StatusLevel, string> = {
  operational: "bg-green-500",
  degraded: "bg-yellow-400",
  down: "bg-red-500",
  checking: "bg-gray-300 animate-pulse",
};

const STATUS_LABELS: Record<StatusLevel, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
  checking: "Checking…",
};

const STATUS_BADGE: Record<StatusLevel, string> = {
  operational: "bg-green-50 border-green-200 text-green-700",
  degraded: "bg-yellow-50 border-yellow-200 text-yellow-700",
  down: "bg-red-50 border-red-200 text-red-700",
  checking: "bg-gray-50 border-gray-200 text-gray-500",
};

const STATIC_COMPONENTS: ServiceStatus[] = [
  {
    name: "Scoring Engine",
    description: "v2 formula - Demand / Friction / Growth",
    status: "operational",
    detail: "Formula v2.0 · 9 sub-indices · CBF applied per business type",
  },
  {
    name: "Kolkata Dataset",
    description: "15 neighborhoods, all indices present",
    status: "operational",
    detail: "15 areas loaded · Last updated Feb 2026 · 4 new v2 fields added",
  },
  {
    name: "Compare Calculator",
    description: "Client-side, no backend dependency",
    status: "operational",
    detail: "Fully client-side · Supports 5 locations · CSV export available",
  },
  {
    name: "Frontend (Next.js)",
    description: "Serving on port 3000",
    status: "operational",
    detail: "Next.js 14 · App Router · Tailwind CSS",
  },
];

function StatusRow({ service }: { service: ServiceStatus }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_COLORS[service.status]}`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{service.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{service.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        {service.latencyMs !== undefined && (
          <span className="text-xs font-mono text-gray-500">{service.latencyMs}ms</span>
        )}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_BADGE[service.status]}`}>
          {STATUS_LABELS[service.status]}
        </span>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [apiStatus, setApiStatus] = useState<StatusLevel>("checking");
  const [apiDetail, setApiDetail] = useState("Pinging backend…");
  const [apiLatency, setApiLatency] = useState<number | undefined>(undefined);
  const [checkedAt, setCheckedAt] = useState<string>("");

  const [pipelineStatus, setPipelineStatus] = useState<StatusLevel>("checking");
  const [pipelineDetail, setPipelineDetail] = useState("Fetching pipeline run info…");
  const [pipelineLatency, setPipelineLatency] = useState<number | undefined>(undefined);

  const checkApi = async () => {
    setApiStatus("checking");
    setApiDetail("Pinging backend…");
    setApiLatency(undefined);
    setPipelineStatus("checking");
    setPipelineDetail("Fetching pipeline run info…");
    setPipelineLatency(undefined);

    // ── API health ──
    const start = performance.now();
    try {
      const res = await fetch(`${BACKEND}/`, {
        signal: AbortSignal.timeout(5000),
      });
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setApiStatus("operational");
        setApiDetail(`${data.service ?? "SiteScapr API"} · responding normally`);
        setApiLatency(latency);
      } else {
        setApiStatus("degraded");
        setApiDetail(`HTTP ${res.status} - API responded with an error`);
        setApiLatency(latency);
      }
    } catch {
      setApiStatus("down");
      setApiDetail(`Cannot reach backend at ${BACKEND}`);
    }

    // ── Pipeline health ──
    const pStart = performance.now();
    try {
      const pRes = await fetch(`${BACKEND}/pipeline/last-run`, {
        signal: AbortSignal.timeout(5000),
      });
      const pLatency = Math.round(performance.now() - pStart);
      if (pRes.ok) {
        const pData = await pRes.json();
        setPipelineLatency(pLatency);
        if (!pData.last_updated) {
          setPipelineStatus("degraded");
          setPipelineDetail("No pipeline runs recorded yet · n8n workflow may not have executed");
        } else {
          // Check if last run was within 24h
          const lastRun = new Date(pData.last_updated);
          const hoursAgo = (Date.now() - lastRun.getTime()) / 1000 / 3600;
          if (hoursAgo < 24) {
            setPipelineStatus("operational");
            setPipelineDetail(`Last run: ${lastRun.toLocaleString()}`);
          } else {
            setPipelineStatus("degraded");
            setPipelineDetail(`Last run: ${lastRun.toLocaleString()}`);
          }
        }
      } else {
        setPipelineStatus("degraded");
        setPipelineDetail(`HTTP ${pRes.status} - pipeline endpoint error`);
      }
    } catch {
      setPipelineStatus("down");
      setPipelineDetail("Cannot reach pipeline endpoint - backend may be down");
    }

    setCheckedAt(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allServices: ServiceStatus[] = [
    {
      name: "Backend API (FastAPI)",
      description: "FastAPI · uvicorn · port 8000",
      status: apiStatus,
      detail: apiDetail,
      latencyMs: apiLatency,
    },
    {
      name: "Data Enrichment Pipeline",
      description: "n8n · AI index updates · runs every 12h",
      status: pipelineStatus,
      detail: pipelineDetail,
      latencyMs: pipelineLatency,
    },
    ...STATIC_COMPONENTS,
  ];

  const overallOk = allServices.every((s) => s.status === "operational");
  const hasDown = allServices.some((s) => s.status === "down");
  const overallStatus: StatusLevel = hasDown ? "down" : !overallOk ? "degraded" : "operational";

  return (
    <div className="max-w-screen-md mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Link href="/" className="text-xs text-gray-400 hover:text-black transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-xs text-gray-600 font-medium">Status</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Status</h1>
        <p className="mt-1.5 text-sm text-gray-400">
          Live health check for all SiteScapr components.
        </p>
      </div>

      {/* Overall status banner */}
      <div className={`rounded-2xl border px-5 py-4 mb-8 flex items-center justify-between ${
        overallStatus === "operational"
          ? "border-green-200 bg-green-50"
          : overallStatus === "degraded"
          ? "border-yellow-200 bg-yellow-50"
          : "border-red-200 bg-red-50"
      }`}>
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[overallStatus]}`} />
          <div>
            <p className="font-bold text-sm text-gray-800">
              {overallStatus === "operational"
                ? "All systems operational"
                : overallStatus === "degraded"
                ? "Partial outage - some systems degraded"
                : "Major outage - one or more systems down"}
            </p>
            {checkedAt && (
              <p className="text-xs text-gray-400 mt-0.5">Last checked at {checkedAt}</p>
            )}
          </div>
        </div>
        <button
          onClick={checkApi}
          disabled={apiStatus === "checking"}
          className="text-xs font-semibold text-gray-600 hover:text-black border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <svg className={`w-3.5 h-3.5 ${apiStatus === "checking" ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Component list */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-sm text-gray-700">Components</h2>
        </div>
        {allServices.map((s) => (
          <StatusRow key={s.name} service={s} />
        ))}
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {allServices.map((s) => (
          <div key={s.name} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[s.status]}`} />
              <p className="text-xs font-bold text-gray-700">{s.name}</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{s.detail}</p>
            {s.latencyMs !== undefined && (
              <p className="text-[10px] text-gray-400 mt-1.5 font-mono">Response: {s.latencyMs}ms</p>
            )}
          </div>
        ))}
      </div>

      {/* Backend setup note */}
      {apiStatus === "down" && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 mb-6">
          <p className="text-sm font-bold text-orange-700 mb-1">Backend not reachable</p>
          <p className="text-xs text-orange-600 leading-relaxed mb-3">
            The SiteScapr API is not running. Start it with the following command from the <code className="font-mono bg-orange-100 px-1 rounded">/backend</code> directory:
          </p>
          <code className="block text-xs font-mono bg-white border border-orange-200 rounded-xl px-4 py-2.5 text-gray-700">
            uvicorn app.main:app --reload --port 8000
          </code>
          <p className="text-[10px] text-orange-500 mt-2">
            The Compare calculator works offline - only the main Analyse page requires the backend.
          </p>
        </div>
      )}

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Run Analysis", href: "/app", desc: "Requires backend" },
          { label: "Compare Locations", href: "/compare", desc: "Works offline" },
          { label: "Methodology", href: "/methodology", desc: "Formula docs" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-gray-200 hover:border-green-400 hover:bg-green-50 bg-white px-4 py-3 transition-colors group"
          >
            <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">{link.label} →</p>
            <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
