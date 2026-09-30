import React from 'react';
import {
  X,
  CheckCircle2,
  HelpCircle,
  Shield,
  Gauge,
  Compass,
  Fuel,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { RouteOption, PriorityLevel } from '../types';

interface WhyThisRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedRoute: RouteOption;
  alternativeRoute: RouteOption;
  safetyPriority: PriorityLevel;
  fuelPriority: PriorityLevel;
}

export const WhyThisRouteModal: React.FC<WhyThisRouteModalProps> = ({
  isOpen,
  onClose,
  recommendedRoute,
  alternativeRoute,
  safetyPriority,
  fuelPriority,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#0a1224] border border-[#233d6b] rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0d172e] border-b border-[#1b2f52] flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wider uppercase">
              Explainable Decision Support — Why This Route?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Main Selected Recommendation Banner */}
          <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-base text-white font-mono-code flex items-center gap-2">
                <span>{recommendedRoute.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  OPTIMAL PARETO SELECTION
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Selected by Multi-Objective Polar Path Optimization under current environmental constraints, balancing hull structural safety and fuel efficiency.
              </p>
            </div>
          </div>

          {/* Decision Factors Checklist */}
          <div>
            <h3 className="text-xs font-mono-code uppercase font-bold text-slate-400 tracking-wider mb-2.5">
              Verified Decision Factors
            </h3>
            <div className="space-y-2">
              {recommendedRoute.explanation.points.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 rounded bg-[#0e1933] border border-[#1b2f54] text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Weights & Objective Functions */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#182a4a]">
            {/* Safety Assessment */}
            <div className="bg-[#0b1428] border border-[#1c3157] rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Safety Priority Evaluation ({safetyPriority})</span>
              </div>
              <div className="space-y-1 text-xs font-mono-code">
                <div className="flex justify-between text-slate-400">
                  <span>Safety Score:</span>
                  <span className="text-emerald-400 font-bold">{recommendedRoute.safetyScore}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Iceberg CPA Margin:</span>
                  <span className="text-cyan-300 font-bold">{recommendedRoute.icebergClosestApproachNM} NM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Pack Ice Exposure:</span>
                  <span className="text-slate-200">{recommendedRoute.iceExposurePercent}%</span>
                </div>
              </div>
            </div>

            {/* Fuel & ETA Assessment */}
            <div className="bg-[#0b1428] border border-[#1c3157] rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                <Fuel className="w-4 h-4 text-emerald-400" />
                <span>Fuel & Transit Evaluation ({fuelPriority})</span>
              </div>
              <div className="space-y-1 text-xs font-mono-code">
                <div className="flex justify-between text-slate-400">
                  <span>Fuel Consumption Index:</span>
                  <span className="text-emerald-400 font-bold">{recommendedRoute.fuelIndex.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Transit Time:</span>
                  <span className="text-white font-bold">{recommendedRoute.etaString}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Net Voyage Distance:</span>
                  <span className="text-slate-200">{recommendedRoute.distanceNM} NM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Formulation Note */}
          <div className="p-3 rounded bg-[#091021] border border-[#162744] text-[11px] text-slate-400 font-mono-code">
            <span className="text-cyan-400 font-bold">Optimization Model:</span>{' '}
            Objective Function: Minimize <code className="text-slate-200">J = w_safety · R_hull + w_fuel · F_exp + w_time · T_transit</code> subject to IMO Polar Code PC-5 hull thickness thresholds and CPA ≥ 5 NM.
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d172e] border-t border-[#1b2f52] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
