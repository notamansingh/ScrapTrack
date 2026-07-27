import React, { useState } from 'react';

export default function LedgerTable() {
  const [selectedGrade, setSelectedGrade] = useState('All');

  // Mock data structure aligning with our FastAPI models
  const initialHauls = [
    { id: 101, grade: "Bright Copper", site: "Warehouse A", weight: "120 kg", value: "$960.00", status: "In Bin", color: "bg-amber-100 text-amber-900 border-amber-200" },
    { id: 102, grade: "Insulated Wire", site: "Job Site #401", weight: "450 kg", value: "$1,125.00", status: "In Transit", color: "bg-blue-100 text-blue-900 border-blue-200" },
    { id: 103, grade: "Mixed Brass", site: "Warehouse A", weight: "85 kg", value: "$412.25", status: "Disposed", color: "bg-emerald-100 text-emerald-900 border-emerald-200" },
    { id: 104, grade: "Bright Copper", site: "Job Site #102", weight: "310 kg", value: "$2,480.00", status: "In Bin", color: "bg-amber-100 text-amber-900 border-amber-200" },
  ];

  const grades = ['All', 'Bright Copper', 'Insulated Wire', 'Mixed Brass'];

  const filteredHauls = selectedGrade === 'All' 
    ? initialHauls 
    : initialHauls.filter(h => h.grade === selectedGrade);

  return (
    <div className="w-full py-4 border-t border-gray-100 mt-4">
      
      {/* Horizontal Pill Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2">Filter Grades:</span>
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              selectedGrade === grade
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-white text-zinc-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* Directory Table Matrix */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-6">Material Grade</th>
                <th className="py-4 px-6">Current Location</th>
                <th className="py-4 px-6 text-right">Net Weight</th>
                <th className="py-4 px-6 text-right">Est. Value (AUD)</th>
                <th className="py-4 px-6 text-center">Tracking Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-zinc-900">
              {filteredHauls.map((haul) => (
                <tr key={haul.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      haul.grade.includes('Copper') ? 'bg-amber-600' : haul.grade.includes('Wire') ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                    <span>{haul.grade}</span>
                  </td>
                  <td className="py-4 px-6 text-zinc-500">{haul.site}</td>
                  <td className="py-4 px-6 text-right font-mono">{haul.weight}</td>
                  <td className="py-4 px-6 text-right font-mono text-emerald-600">{haul.value}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-md border ${haul.color}`}>
                      {haul.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Counter */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-zinc-500">
          <span>Showing {filteredHauls.length} entry metrics</span>
          <span className="text-zinc-400">System updated in real-time</span>
        </div>
      </div>
    </div>
  );
}