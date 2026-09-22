import React, { useState } from 'react';

const GRADE_DOT = {
  "Bright Copper": "bg-amber-500",
  "Insulated Wire": "bg-blue-500",
  "Mixed Brass": "bg-yellow-500",
  "Aluminum": "bg-slate-400",
  "Stainless Steel": "bg-zinc-400",
};

export default function LedgerTable({ disposals = [] }) {
  const [selectedGrade, setSelectedGrade] = useState('All');

  const grades = ['All', ...new Set(disposals.map((d) => d.metal_grade))];
  const filtered = selectedGrade === 'All'
    ? disposals
    : disposals.filter((d) => d.metal_grade === selectedGrade);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Filter Grades:</span>
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              selectedGrade === grade
                ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {grade}
          </button>
        ))}
      </div>

      <div className="border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Material Grade</th>
                <th className="py-4 px-6">Driver</th>
                <th className="py-4 px-6 text-right">Net Weight</th>
                <th className="py-4 px-6 text-right">Est. Value (AUD)</th>
                <th className="py-4 px-6 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-semibold flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${GRADE_DOT[d.metal_grade] || 'bg-slate-500'}`} />
                    <span>{d.metal_grade}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{d.driver_name}</td>
                  <td className="py-4 px-6 text-right font-mono">{d.total_weight_kg} kg</td>
                  <td className="py-4 px-6 text-right font-mono text-emerald-400">
                    ${d.estimated_payout_aud.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {d.receipt_url ? (
                      <a href={d.receipt_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-400 hover:underline">
                        View
                      </a>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-6 text-center text-sm text-slate-500">
                    No disposals recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Showing {filtered.length} entries</span>
          <span className="text-slate-600">Synced from ScrapTrack API</span>
        </div>
      </div>
    </div>
  );
}
