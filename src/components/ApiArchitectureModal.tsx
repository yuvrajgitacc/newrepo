import React, { useState } from 'react';
import { X, Server, Code, CheckCircle, Database, Cpu } from 'lucide-react';
import { API_CATALOG } from '../services/simulationApi';

interface ApiArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiArchitectureModal: React.FC<ApiArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_CATALOG[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#0a1224] border border-[#233d6b] rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0d172e] border-b border-[#1b2f52] flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <Server className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase font-mono-code">
                Simulated Backend Architecture & API Specification
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Smart India Hackathon 2026 — Ready for FastAPI, PyTorch & PostGIS integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Endpoint List */}
          <div className="w-full md:w-2/5 border-r border-[#172744] bg-[#070e1c] p-3 space-y-1.5 overflow-y-auto">
            <div className="text-[10px] font-mono-code uppercase text-slate-500 font-bold mb-2">
              FastAPI Endpoint Catalog
            </div>
            {API_CATALOG.map((ep) => {
              const isSelected = selectedEndpoint.path === ep.path;
              return (
                <button
                  key={ep.path}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`w-full text-left p-2 rounded border transition-all text-xs font-mono-code flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-[#101f3b] border-cyan-400 text-white shadow-sm'
                      : 'bg-[#091224] border-[#182742] text-slate-300 hover:bg-[#0d1933]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        ep.method === 'GET'
                          ? 'bg-blue-950 text-blue-300 border border-blue-700/60'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-semibold truncate">{ep.path}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans truncate">
                    {ep.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Endpoint Details & JSON Preview */}
          <div className="w-full md:w-3/5 p-4 flex flex-col overflow-y-auto bg-[#0a1224] space-y-3">
            <div>
              <div className="flex items-center gap-2 font-mono-code text-sm text-cyan-300 font-bold">
                <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-600 text-xs">
                  {selectedEndpoint.method}
                </span>
                <span>{selectedEndpoint.path}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{selectedEndpoint.description}</p>
            </div>

            {/* Target ML / Backend Stack */}
            <div className="p-2.5 rounded bg-[#0e1a33] border border-[#1b2f54] text-xs">
              <div className="text-[10px] font-mono-code uppercase text-slate-400 flex items-center gap-1.5 mb-1 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Backend ML & Geospatial Pipeline</span>
              </div>
              <div className="text-cyan-200 font-mono-code text-[11px]">
                {selectedEndpoint.backendStack}
              </div>
            </div>

            {/* Sample JSON Payload */}
            <div className="flex-1 flex flex-col">
              <div className="text-[10px] font-mono-code uppercase text-slate-400 font-semibold mb-1 flex items-center justify-between">
                <span>Simulated Response JSON</span>
                <span className="text-emerald-400 text-[9px] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> 200 OK
                </span>
              </div>
              <div className="bg-[#050b17] border border-[#182a4a] rounded p-3 font-mono-code text-[10.5px] text-slate-300 overflow-x-auto max-h-64">
                <pre>{JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d172e] border-t border-[#1b2f52] flex justify-between items-center text-xs text-slate-400 font-mono-code">
          <span>Simulation Engine API Layer</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
          >
            Close API Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
