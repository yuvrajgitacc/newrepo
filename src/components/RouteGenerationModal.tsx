import React from 'react';
import {
  CheckCircle2,
  Loader2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Navigation,
} from 'lucide-react';
import { RouteOption } from '../types';

interface RouteGenerationModalProps {
  isOpen: boolean;
  stageIndex: number;
  stages: string[];
  recommendedRoute: RouteOption | null;
  onClose: () => void;
}

export const RouteGenerationModal: React.FC<RouteGenerationModalProps> = ({
  isOpen,
  stageIndex,
  stages,
  recommendedRoute,
  onClose,
}) => {
  if (!isOpen) return null;

  const isCompleted = stageIndex >= stages.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#0a1224] border border-[#233d6b] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0d172e] border-b border-[#1b2f52] flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: isCompleted ? '0s' : '4s' }} />
            <h2 className="text-sm font-bold tracking-wider uppercase font-mono-code">
              {isCompleted ? 'Route Generated Successfully' : 'AI Polar Route Optimization Engine'}
            </h2>
          </div>
          {isCompleted && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              Close
            </button>
          )}
        </div>

        {/* Stages Checklist */}
        <div className="p-5 space-y-3 font-mono-code text-xs">
          <div className="text-[11px] text-slate-400 font-sans mb-3">
            Executing multi-objective path planning with ConvLSTM sea-ice forecasts, hydrodynamic iceberg drift fields, and IMO Polar Code hull constraints:
          </div>

          <div className="space-y-2">
            {stages.map((stageName, idx) => {
              const isPast = idx < stageIndex;
              const isCurrent = idx === stageIndex;

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded border transition-all flex items-center justify-between ${
                    isPast
                      ? 'bg-[#0b172d] border-emerald-500/40 text-slate-200'
                      : isCurrent
                      ? 'bg-[#102242] border-cyan-400 text-white shadow-sm'
                      : 'bg-[#070e1c] border-[#162744] text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0 flex items-center justify-center text-[9px] text-slate-500">
                        {idx + 1}
                      </div>
                    )}
                    <span className="text-[11px] font-medium">{stageName}</span>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase ${
                      isPast
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-cyan-300 animate-pulse'
                        : 'text-slate-600'
                    }`}
                  >
                    {isPast ? 'COMPLETED' : isCurrent ? 'RUNNING...' : 'WAITING'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Results Summary once completed */}
          {isCompleted && recommendedRoute && (
            <div className="mt-4 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/60 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 font-bold text-sm">
                  {recommendedRoute.name} SELECTED
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  RECOMMENDED
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-800/40 text-center">
                <div>
                  <div className="text-[9px] text-slate-400">Distance</div>
                  <div className="font-bold text-white">{recommendedRoute.distanceNM} NM</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400">Transit ETA</div>
                  <div className="font-bold text-white">{recommendedRoute.etaString}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400">Safety Score</div>
                  <div className="font-bold text-emerald-400">{recommendedRoute.safetyScore}%</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isCompleted && (
          <div className="px-5 py-3 bg-[#0d172e] border-t border-[#1b2f52] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs transition-colors shadow"
            >
              Apply to Navigation Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
