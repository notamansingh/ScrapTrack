import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import MetricCards from '../components/dashboard/MetricCards';
import LedgerTable from '../components/dashboard/LedgerTable';
import DisposalForm from '../components/forms/DisposalForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [disposals, setDisposals] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [online, setOnline] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [listRes, summaryRes] = await Promise.all([
        fetch(`${API_URL}/disposals/`),
        fetch(`${API_URL}/disposals/summary`),
      ]);
      if (!listRes.ok || !summaryRes.ok) throw new Error('API error');
      setDisposals(await listRes.json());
      setMetrics(await summaryRes.json());
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Navigation Header */}
      <Navbar online={online} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Brand Banner & Main Action Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="space-y-2">
            {/* Prominent Brand Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ScrapTrack Enterprise Platform
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              ScrapTrack Material Ledger
            </h1>

            <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
              Track industrial raw scrap aggregates seamlessly from active job sites to central warehouse hubs. Monitor real-time carbon mitigation and payout valuations.
            </p>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <svg
              className="w-5 h-5 mr-2.5 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Record New Disposal
          </button>
        </div>

        {/* Dynamic Analytics Overview */}
        <section aria-label="Analytics Overview" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
              ScrapTrack Live Metrics
            </h2>
          </div>
          <MetricCards metrics={metrics} />
        </section>

        {/* Live Ledger Table */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Disposal Activity Stream
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Real-time transaction log synced with Cloudflare R2 verified receipts.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-emerald-400 rounded-full border border-slate-700">
              Live Stream
            </span>
          </div>
          
          <LedgerTable disposals={disposals} />
        </section>
      </main>

      {/* Disposal Form Modal */}
      {isFormOpen && (
        <DisposalForm onClose={() => setIsFormOpen(false)} onCreated={refresh} />
      )}
    </div>
  );
}