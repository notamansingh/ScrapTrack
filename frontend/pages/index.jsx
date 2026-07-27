import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import MetricCards from '../components/dashboard/MetricCards';
import LedgerTable from '../components/dashboard/LedgerTable';
import DisposalForm from '../components/forms/DisposalForm'; // Import the form

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 text-zinc-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MetricCards />

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Material Ledger Registry</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Audit system transactions, verification keys, and dynamic scale metrics.</p>
            </div>
            
            {/* Click Handler Event */}
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-zinc-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-zinc-800 shadow-sm transition-all"
            >
              + Process Yard Drop-off
            </button>
          </div>

          <LedgerTable />
        </div>
      </main>

      {/* Render validation modal overlay state */}
      {isFormOpen && <DisposalForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}