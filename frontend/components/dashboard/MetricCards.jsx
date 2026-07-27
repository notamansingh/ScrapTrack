import React from 'react';

export default function MetricCards() {
  // Mock data matching our Day 4 /dashboard/summary calculations structure
  const metrics = [
    { title: "Total Materials Tracked", value: "4,289 kg", detail: "+12% from last week", color: "border-zinc-200" },
    { title: "Carbon Mitigation", value: "12.4 Tons", detail: "CO2 equivalent saved", color: "border-emerald-200 bg-emerald-50/30" },
    { title: "Est. Payout Value", value: "$8,420.50", detail: "AUD live approximation", color: "border-blue-200 bg-blue-50/30" }
  ];

  return (
    <div className="w-full py-6">
      {/* Target Business Headline */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Recycling Management Ledger
        </h1>
        <p className="mt-2 text-zinc-600 max-w-2xl">
          Optimize operational workflows. Track industrial raw scrap aggregates seamlessly from active job sites straight to central warehouse hubs.
        </p>
      </div>

      {/* Structured Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((card, idx) => (
          <div key={idx} className={`p-6 border rounded-xl shadow-sm transition-all ${card.color}`}>
            <p className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
              {card.title}
            </p>
            <p className="text-3xl font-bold text-zinc-900 mt-2 tracking-tight">
              {card.value}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {card.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}