import React, { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const METAL_GRADES = [
  "Bright Copper",
  "Insulated Wire",
  "Mixed Brass",
  "Aluminum",
  "Stainless Steel",
];

export default function DisposalForm({ onClose, onCreated }) {
  const [driverName, setDriverName] = useState('');
  const [metalGrade, setMetalGrade] = useState(METAL_GRADES[0]);
  const [weight, setWeight] = useState('');
  const [payout, setPayout] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const canSubmit = driverName && weight && payout && imageFile && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('metadata', JSON.stringify({
        driver_name: driverName,
        metal_grade: metalGrade,
        total_weight_kg: parseFloat(weight),
        estimated_payout_aud: parseFloat(payout),
      }));

      const res = await fetch(`${API_URL}/disposals/create_disposal`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${res.status})`);
      }

      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Process Yard Drop-off</h3>
            <p className="text-xs text-slate-400">Create a disposal transaction record.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-semibold">
            ✕
          </button>
        </div>

        {/* Input Fields */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Driver Identity</label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Material Grade</label>
            <select
              value={metalGrade}
              onChange={(e) => setMetalGrade(e.target.value)}
              className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              {METAL_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Scale Weight (kg)</label>
              <input
                type="number"
                placeholder="0.00"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Payout (AUD)</label>
              <input
                type="number"
                placeholder="0.00"
                value={payout}
                onChange={(e) => setPayout(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Scale Receipt or Asset Photo</label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-950/50 hover:bg-slate-950 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="Upload preview" className="max-h-24 mx-auto rounded border border-slate-700 shadow-sm object-cover" />
                  <p className="text-xs text-emerald-400 font-semibold">{imageFile?.name}</p>
                </div>
              ) : (
                <div className="space-y-1 text-slate-400">
                  <p className="text-xs font-semibold">Click to select a receipt photo</p>
                  <p className="text-[10px] text-slate-500">PNG, JPG — uploaded to Cloudflare R2</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Action Tray */}
        <div className="px-6 py-3 bg-slate-950/40 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button onClick={onClose} className="text-xs font-bold text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Commit Transaction'}
          </button>
        </div>

      </div>
    </div>
  );
}
