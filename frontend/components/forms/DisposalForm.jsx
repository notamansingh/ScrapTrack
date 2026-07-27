import React, { useState } from 'react';

export default function DisposalForm({ onClose }) {
  const [driverName, setDriverName] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Mock list of logs available in the warehouse awaiting yard clearing
  const availableLogs = [
    { id: 101, grade: "Bright Copper", weight: "120 kg", site: "Warehouse A" },
    { id: 102, grade: "Insulated Wire", weight: "450 kg", site: "Job Site #401" },
    { id: 104, grade: "Bright Copper", weight: "310 kg", site: "Job Site #102" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleLogSelection = (id) => {
    setSelectedLogs(prev => 
      prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Process Yard Drop-off</h3>
            <p className="text-xs text-zinc-500">Create an atomic disposal transaction event.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors text-sm font-semibold">
            ✕
          </button>
        </div>

        {/* Input Fields */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Driver Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Driver Identity</label>
            <input 
              type="text" 
              placeholder="e.g., John Doe" 
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Scale Weight Entry */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Gross Scale Weight (kg)</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Multi-Select Item Linker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Select Grouped Logs to Transition</label>
            <div className="space-y-2 max-h-36 overflow-y-auto border border-gray-100 rounded-lg p-2 bg-gray-50/50">
              {availableLogs.map((log) => (
                <div 
                  key={log.id} 
                  onClick={() => toggleLogSelection(log.id)}
                  className={`flex items-center justify-between p-2 rounded-md border text-xs font-medium cursor-pointer transition-all ${
                    selectedLogs.includes(log.id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                      : 'bg-white border-gray-200 text-zinc-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">Log #{log.id} — {log.grade}</span>
                  <span className="font-mono text-zinc-400">{log.weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Binary Image Upload Stream Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Scale Scale Receipt or Asset Photo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100/50 transition-colors relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="Upload preview" className="max-h-24 mx-auto rounded border border-gray-200 shadow-sm object-cover" />
                  <p className="text-xs text-emerald-600 font-semibold">{imageFile?.name}</p>
                </div>
              ) : (
                <div className="space-y-1 text-zinc-500">
                  <p className="text-xs font-semibold">Click to stream file or drop media here</p>
                  <p className="text-[10px] text-zinc-400">PNG, JPG up to 10MB (Uploads via R2 Async Pipeline)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Tray */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-3">
          <button onClick={onClose} className="text-xs font-bold text-zinc-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
            Cancel
          </button>
          <button className="bg-zinc-950 text-white text-xs font-bold px-4 py-2 rounded-lg border border-zinc-900 hover:bg-zinc-800 shadow-sm transition-all">
            Commit Atomic Transaction
          </button>
        </div>

      </div>
    </div>
  );
}