import React from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  Clock,
  Waves,
  Shield,
  ArrowRight,
  TrendingDown,
  HelpCircle,
} from 'lucide-react';
import { RouteOption } from '../types';

interface RouteAnalysisViewProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (id: 'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C') => void;
  onOpenWhyThisRoute: () => void;
}

export const RouteAnalysisView: React.FC<RouteAnalysisViewProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onOpenWhyThisRoute,
}) => {
  return (
    <div className="absolute inset-0 z-30 bg-[#06131F]/90 backdrop-blur-md p-6 overflow-y-auto font-mono-code text-slate-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#173F59] pb-3">
          <div>
            <h2 className="text-base font-bold uppercase text-[#EAF4FA] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#59C7F3]" />
              <span>Multi-Objective Polar Route Optimization Analysis</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Comparison matrix evaluated across hydrodynamics, hull safety, and fuel consumption under IMO Polar Code PC-5 standards.
            </p>
          </div>
          <button
            onClick={onOpenWhyThisRoute}
            className="px-3 py-1.5 rounded bg-[#12364D] hover:bg-[#173F59] text-[#59C7F3] border border-[#25B7D3]/60 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Why This Route?</span>
          </button>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isRec = route.status === 'RECOMMENDED';

            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`rounded-lg p-4 cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#081C2A] border-[#25B7D3] shadow-lg ring-1 ring-[#25B7D3]'
                    : 'bg-[#06131F] border-[#173F59] hover:bg-[#081C2A]'
                }`}
              >
                <div className="flex items-center justify-between mb-3 border-b border-[#12364D] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                    <span className="font-bold text-sm text-white">{route.name}</span>
                  </div>
                  {isRec && (
                    <span className="px-2 py-0.5 rounded bg-[#39B57A]/20 text-[#39B57A] border border-[#39B57A]/40 text-[9px] font-bold">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Distance:</span>
                    <span className="font-bold text-white">{route.distanceNM} NM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Transit:</span>
                    <span className="font-bold text-white">{route.etaString}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel Consumption Index:</span>
                    <span className="font-bold text-[#39B57A]">{route.fuelIndex.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sea-Ice Exposure:</span>
                    <span className={route.iceExposurePercent > 30 ? 'text-[#E56A54]' : 'text-slate-200'}>
                      {route.iceExposurePercent}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Iceberg CPA Margin:</span>
                    <span
                      className={
                        route.icebergClosestApproachNM < 5
                          ? 'text-[#C93B4B] font-bold'
                          : 'text-[#59C7F3] font-bold'
                      }
                    >
                      {route.icebergClosestApproachNM} NM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Calculated Risk Score:</span>
                    <span
                      className={`font-bold ${
                        route.riskScore > 50 ? 'text-[#E56A54]' : 'text-[#39B57A]'
                      }`}
                    >
                      {route.riskScore} / 100
                    </span>
                  </div>
                </div>

                {/* Score Comparison Bars */}
                <div className="mt-4 pt-3 border-t border-[#12364D] space-y-2 text-[10px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Safety Score</span>
                      <span className="text-[#39B57A] font-bold">{route.safetyScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded bg-[#12364D]">
                      <div
                        className="h-full bg-[#39B57A] rounded"
                        style={{ width: `${route.safetyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Efficiency Score</span>
                      <span className="text-[#59C7F3] font-bold">{route.efficiencyScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded bg-[#12364D]">
                      <div
                        className="h-full bg-[#59C7F3] rounded"
                        style={{ width: `${route.efficiencyScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-[#081C2A] border border-[#173F59] rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-[#0a2336] border-b border-[#173F59] font-bold text-xs text-[#EAF4FA] uppercase">
            Comparative Navigation Metrics
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#12364D] text-slate-400 text-[10px]">
                <th className="p-3">Route Profile</th>
                <th className="p-3">Distance</th>
                <th className="p-3">ETA</th>
                <th className="p-3">Fuel Index</th>
                <th className="p-3">Ice Exposure</th>
                <th className="p-3">Closest Berg CPA</th>
                <th className="p-3">Composite Risk</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#12364D]">
              {routes.map((r) => (
                <tr
                  key={r.id}
                  className={`hover:bg-[#0c263a] transition-colors ${
                    r.id === selectedRouteId ? 'bg-[#12364D]/50 font-bold' : ''
                  }`}
                >
                  <td className="p-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-white">{r.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({r.type})</span>
                  </td>
                  <td className="p-3">{r.distanceNM} NM</td>
                  <td className="p-3">{r.etaString}</td>
                  <td className="p-3 text-[#39B57A]">{r.fuelIndex.toFixed(2)}</td>
                  <td className="p-3">{r.iceExposurePercent}%</td>
                  <td className="p-3">{r.icebergClosestApproachNM} NM</td>
                  <td className="p-3">
                    <span className={r.riskScore > 50 ? 'text-[#E56A54]' : 'text-[#39B57A]'}>
                      {r.riskScore}%
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onSelectRoute(r.id)}
                      className="px-2 py-0.5 rounded bg-[#173F59] hover:bg-[#25B7D3] hover:text-[#06131F] text-[#59C7F3] text-[10px] transition-colors"
                    >
                      {r.id === selectedRouteId ? 'ACTIVE' : 'SELECT'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
