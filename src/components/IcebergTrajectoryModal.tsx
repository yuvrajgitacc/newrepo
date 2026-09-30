import React from 'react';
import {
  X,
  Compass,
  AlertTriangle,
  Wind,
  Waves,
  Disc,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Iceberg } from '../types';

interface IcebergTrajectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  iceberg: Iceberg | null;
}

export const IcebergTrajectoryModal: React.FC<IcebergTrajectoryModalProps> = ({
  isOpen,
  onClose,
  iceberg,
}) => {
  if (!isOpen || !iceberg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#0a1224] border border-[#233d6b] rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0d172e] border-b border-[#1b2f52] flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-400">
            <Compass className="w-5 h-5 text-pink-400" />
            <h2 className="text-sm font-bold tracking-wider uppercase font-mono-code">
              Iceberg Trajectory Model — {iceberg.id} ({iceberg.name})
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
          {/* Target Characteristics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-[#0e1933] border border-[#1b2f54] text-xs font-mono-code">
            <div>
              <span className="text-slate-400 text-[10px] block">Target Type</span>
              <span className="text-pink-300 font-bold">{iceberg.size}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Dimensions</span>
              <span className="text-slate-200 font-bold">{iceberg.dimensionsMeters}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Drift Velocity</span>
              <span className="text-cyan-300 font-bold">{iceberg.velocityKnots} kn @ {iceberg.directionCompass}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">ML Confidence</span>
              <span className="text-emerald-400 font-bold">{iceberg.confidencePercent}%</span>
            </div>
          </div>

          {/* Hydrodynamic Drift Physics Model */}
          <div className="p-3.5 rounded-lg bg-[#081021] border border-[#162744]">
            <div className="text-xs font-mono-code uppercase font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="text-cyan-400">Dynamical Drift Formulation</span>
              <span className="text-slate-500 text-[10px]">PyTorch ODE Integration</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono-code">
              Drift acceleration is computed via coupled Navier-Stokes drag:
            </p>
            <div className="my-2 p-2 rounded bg-[#050b17] border border-[#14233e] text-center font-mono-code text-cyan-300 text-xs">
              M · (dVi / dt) = F_wind(Ca, Asail) + F_water(Cw, Akeel) - f(k × Vi) + F_sea-ice
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono-code mt-2">
              <div className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span>Wind drag component: 1.1 kn @ 045°</span>
              </div>
              <div className="flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 text-blue-400" />
                <span>Ekman current drift: 0.7 kn @ 070°</span>
              </div>
            </div>
          </div>

          {/* 24-Hour Projected Trajectory Points Table */}
          <div>
            <h3 className="text-xs font-mono-code uppercase font-bold text-slate-400 tracking-wider mb-2">
              Predicted Spatiotemporal Trajectory (0h → +24h)
            </h3>
            <div className="border border-[#1b2f52] rounded-lg overflow-hidden font-mono-code text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0e1933] text-slate-400 text-[10px] border-b border-[#1b2f52]">
                    <th className="p-2">Timeline</th>
                    <th className="p-2">Coordinates</th>
                    <th className="p-2">Distance to RV</th>
                    <th className="p-2">Uncertainty Radius</th>
                    <th className="p-2">Route Threat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172744]">
                  {iceberg.trajectory.map((pt, i) => (
                    <tr key={pt.timeLabel} className="hover:bg-[#0c162b] transition-colors">
                      <td className="p-2 font-bold text-pink-300">{pt.timeLabel}</td>
                      <td className="p-2 text-slate-200">
                        {Math.abs(pt.lat).toFixed(3)}° S, {Math.abs(pt.lng).toFixed(3)}° E
                      </td>
                      <td className="p-2 text-cyan-300">
                        {(18.6 - (i * 2.1)).toFixed(1)} NM
                      </td>
                      <td className="p-2 text-slate-400">
                        ±{pt.uncertaintyRadiusNM} NM
                      </td>
                      <td className="p-2">
                        {i >= 2 ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-700/60 font-bold">
                            APPROACHING ROUTE A
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                            CLEAR
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d172e] border-t border-[#1b2f52] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs transition-colors"
          >
            Close Trajectory Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
