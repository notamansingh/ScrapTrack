import React from 'react';

export default function MetricCards({ metrics }) {
  const totalWeight = (metrics?.total_weight_kg ?? 0).toLocaleString();
  const carbonMitigation = (metrics?.carbon_mitigation_tons ?? 0).toFixed(2);
  const totalValuation = (metrics?.total_valuation_aud ?? 0).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Materials Tracked */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Total Materials Tracked
        </p>
        <p className="mt-3 text-3xl font-extrabold text-white">
          {totalWeight} <span className="text-lg font-medium text-emerald-400">kg</span>
        </p>
      </div>

      {/* Carbon Mitigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Carbon Mitigation
        </p>
        <p className="mt-3 text-3xl font-extrabold text-white">
          {carbonMitigation} <span className="text-lg font-medium text-emerald-400">Tons</span>
        </p>
        <p className="mt-2 text-xs font-medium text-slate-400">
          CO2 equivalent saved
        </p>
      </div>

      {/* Est. Payout Value */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Est. Payout Value
        </p>
        <p className="mt-3 text-3xl font-extrabold text-white">
          ${totalValuation}
        </p>
        <p className="mt-2 text-xs font-medium text-slate-400">
          AUD live approximation
        </p>
      </div>
    </div>
  );
}