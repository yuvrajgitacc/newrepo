import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Compass,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Bell,
  Eye,
  Fuel,
  Clock,
  Navigation,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  RiskAssessmentData,
  SeaIceForecastPoint,
  Iceberg,
  RouteOption,
  AlertItem,
  TimelineHour,
} from '../types';

interface RightIntelligencePanelProps {
  riskAssessment: RiskAssessmentData;
  forecastSeries: SeaIceForecastPoint[];
  selectedIceberg: Iceberg;
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (id: 'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C') => void;
  alerts: AlertItem[];
  timelineHour: TimelineHour;
  onFlyToIceberg: (iceberg: Iceberg) => void;
  onOpenTrajectoryModal: (iceberg: Iceberg) => void;
  onOpenWhyThisRoute: () => void;
}

export const RightIntelligencePanel: React.FC<RightIntelligencePanelProps> = ({
  riskAssessment,
  forecastSeries,
  selectedIceberg,
  routes,
  selectedRouteId,
  onSelectRoute,
  alerts,
  timelineHour,
  onFlyToIceberg,
  onOpenTrajectoryModal,
  onOpenWhyThisRoute,
}) => {
  const recommendedRoute = routes.find((r) => r.status === 'RECOMMENDED') || routes[0];

  const getRiskColor = (score: number) => {
    if (score < 25) return '#39B57A';
    if (score < 50) return '#F0B84B';
    if (score < 75) return '#E56A54';
    return '#C93B4B';
  };

  return (
    <aside className="w-[360px] xl:w-[380px] bg-[#06131F] border-l border-[#12364D] flex flex-col h-full overflow-y-auto select-none shrink-0 text-slate-200 text-xs">
      <div className="p-3 space-y-3">
        {/* 1. RISK ASSESSMENT SECTION */}
        <div className="bg-[#081C2A] border border-[#173F59] rounded p-3">
          <div className="flex items-center justify-between border-b border-[#12364D] pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 font-mono-code font-bold uppercase tracking-wider text-xs text-[#EAF4FA]">
              <ShieldAlert className="w-4 h-4 text-[#59C7F3]" />
              <span>Risk Assessment</span>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase"
              style={{
                backgroundColor: `${getRiskColor(riskAssessment.overallScore)}20`,
                color: getRiskColor(riskAssessment.overallScore),
                border: `1px solid ${getRiskColor(riskAssessment.overallScore)}60`,
              }}
            >
              {riskAssessment.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Overall Score Box */}
            <div className="w-20 h-20 rounded bg-[#06131F] border border-[#173F59] flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-bold font-mono-code text-white">
                {riskAssessment.overallScore}
              </span>
              <span className="text-[9px] font-mono-code text-slate-400">/ 100</span>
              <span className="text-[8px] uppercase tracking-wider text-slate-500">Overall</span>
            </div>

            {/* Breakdown Sub-Risks */}
            <div className="flex-1 space-y-1.5 font-mono-code text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sea-Ice Risk</span>
                <span className="font-bold text-white">{riskAssessment.seaIceRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Iceberg Risk</span>
                <span
                  className={`font-bold ${
                    riskAssessment.icebergRisk > 50 ? 'text-[#C93B4B]' : 'text-white'
                  }`}
                >
                  {riskAssessment.icebergRisk}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Weather Risk</span>
                <span className="font-bold text-white">{riskAssessment.weatherRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Route Risk</span>
                <span
                  className={`font-bold ${
                    riskAssessment.routeRisk > 50 ? 'text-[#E56A54]' : 'text-[#39B57A]'
                  }`}
                >
                  {riskAssessment.routeRisk}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-[#12364D] text-[9.5px] font-mono-code text-slate-400 leading-snug">
            {riskAssessment.formulaDescription}
          </div>
        </div>

        {/* 2. SEA-ICE FORECAST PANEL */}
        <div className="bg-[#081C2A] border border-[#173F59] rounded p-3">
          <div className="flex items-center justify-between border-b border-[#12364D] pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 font-mono-code font-bold uppercase tracking-wider text-xs text-[#EAF4FA]">
              <TrendingUp className="w-4 h-4 text-[#25B7D3]" />
              <span>Sea-Ice Forecast</span>
            </div>
            <span className="text-[10px] font-mono-code text-[#59C7F3]">
              Confidence: {riskAssessment.confidencePercent}%
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-[#06131F] rounded border border-[#12364D] text-center font-mono-code text-[10px] mb-2">
            <div>
              <div className="text-slate-500 text-[8.5px]">CURRENT</div>
              <div className="font-bold text-white">{forecastSeries[0]?.concentration}%</div>
            </div>
            <div>
              <div className="text-slate-500 text-[8.5px]">+6H</div>
              <div className="font-bold text-[#59C7F3]">{forecastSeries[1]?.concentration}%</div>
            </div>
            <div>
              <div className="text-slate-500 text-[8.5px]">+12H</div>
              <div className="font-bold text-[#F0B84B]">{forecastSeries[2]?.concentration}%</div>
            </div>
            <div>
              <div className="text-slate-500 text-[8.5px]">+24H</div>
              <div className="font-bold text-[#E56A54]">{forecastSeries[4]?.concentration}%</div>
            </div>
          </div>

          {/* Clean GIS Line Chart */}
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastSeries} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#173F59' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[30, 75]}
                  tick={{ fill: '#64748b', fontSize: 8, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#173F59' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#081C2A',
                    borderColor: '#173F59',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(v: any) => [`${v}%`, 'Concentration']}
                />
                <Line
                  type="monotone"
                  dataKey="concentration"
                  stroke="#25B7D3"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#25B7D3' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. ICEBERG TRAJECTORY PANEL */}
        <div className="bg-[#081C2A] border border-[#173F59] rounded p-3">
          <div className="flex items-center justify-between border-b border-[#12364D] pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 font-mono-code font-bold uppercase tracking-wider text-xs text-[#EAF4FA]">
              <Compass className="w-4 h-4 text-[#E56A54]" />
              <span>Iceberg Trajectory</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-[#06131F] border border-[#173F59] text-[#59C7F3] font-mono-code font-bold text-[10px]">
              {selectedIceberg.id}
            </span>
          </div>

          <div className="space-y-1.5 font-mono-code text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Target:</span>
              <span className="text-white font-bold">{selectedIceberg.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Distance:</span>
              <span className="text-[#59C7F3] font-bold">{selectedIceberg.distanceNM} NM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Velocity / Bearing:</span>
              <span className="text-white">
                {selectedIceberg.velocityKnots} kn @ {selectedIceberg.directionCompass} ({selectedIceberg.directionDegrees}°)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Predicted CPA:</span>
              <span
                className={
                  selectedIceberg.predictedClosestApproachNM < 5
                    ? 'text-[#C93B4B] font-bold'
                    : 'text-[#F0B84B] font-bold'
                }
              >
                {selectedIceberg.predictedClosestApproachNM} NM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Model Confidence:</span>
              <span className="text-[#39B57A]">{selectedIceberg.confidencePercent}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#12364D]">
            <button
              onClick={() => onFlyToIceberg(selectedIceberg)}
              className="py-1 px-2 rounded bg-[#06131F] hover:bg-[#12364D] border border-[#173F59] text-slate-200 font-mono-code text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-3 h-3 text-[#59C7F3]" />
              <span>VIEW ON MAP</span>
            </button>
            <button
              onClick={() => onOpenTrajectoryModal(selectedIceberg)}
              className="py-1 px-2 rounded bg-[#12364D] hover:bg-[#173F59] border border-[#25B7D3]/50 text-[#59C7F3] font-mono-code text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>PHYSICS MODEL</span>
            </button>
          </div>
        </div>

        {/* 4. RECOMMENDED ROUTE ENGINE */}
        <div className="bg-[#081C2A] border border-[#173F59] rounded p-3">
          <div className="flex items-center justify-between border-b border-[#12364D] pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 font-mono-code font-bold uppercase tracking-wider text-xs text-[#EAF4FA]">
              <CheckCircle2 className="w-4 h-4 text-[#39B57A]" />
              <span>Recommended Route</span>
            </div>
            <button
              onClick={onOpenWhyThisRoute}
              className="text-[10px] text-[#59C7F3] hover:underline flex items-center gap-0.5"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Why this route?</span>
            </button>
          </div>

          {/* Primary Recommended Route Card */}
          <div
            onClick={() => onSelectRoute(recommendedRoute.id)}
            className="p-2.5 rounded bg-[#06131F] border border-[#39B57A] cursor-pointer hover:border-[#39B57A]/80 transition-all mb-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold font-mono-code text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#39B57A]" />
                <span>{recommendedRoute.name}</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-[#39B57A]/20 text-[#39B57A] border border-[#39B57A]/40 font-mono-code text-[9px] font-bold">
                RECOMMENDED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#12364D] text-center font-mono-code text-[10px]">
              <div>
                <div className="text-slate-500 text-[8.5px]">Distance</div>
                <div className="font-bold text-white">{recommendedRoute.distanceNM} NM</div>
              </div>
              <div>
                <div className="text-slate-500 text-[8.5px]">Transit ETA</div>
                <div className="font-bold text-white">{recommendedRoute.etaString}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[8.5px]">Fuel Index</div>
                <div className="font-bold text-[#39B57A]">{recommendedRoute.fuelIndex.toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-1.5 pt-1.5 border-t border-[#12364D] text-center font-mono-code text-[9.5px]">
              <div>
                <span className="text-slate-500 block">Safety</span>
                <span className="text-[#39B57A] font-bold">{recommendedRoute.safetyScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Efficiency</span>
                <span className="text-[#59C7F3] font-bold">{recommendedRoute.efficiencyScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Risk</span>
                <span className="text-white font-bold">{recommendedRoute.riskScore}%</span>
              </div>
            </div>
          </div>

          {/* Alternative Route Selectors */}
          <div className="space-y-1">
            <div className="text-[9.5px] font-mono-code uppercase text-slate-500">
              Alternative Options
            </div>
            {routes
              .filter((r) => r.id !== recommendedRoute.id)
              .map((r) => {
                const isSelected = r.id === selectedRouteId;
                return (
                  <div
                    key={r.id}
                    onClick={() => onSelectRoute(r.id)}
                    className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between font-mono-code text-[10.5px] ${
                      isSelected
                        ? 'bg-[#12364D] border-[#25B7D3] text-white'
                        : 'bg-[#06131F] border-[#173F59] text-slate-300 hover:bg-[#0c2033]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                        <span>{r.name}</span>
                        <span className="text-[9px] text-slate-400 font-normal">({r.type})</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {r.distanceNM} NM | ETA {r.etaString}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-400">Fuel: {r.fuelIndex}</div>
                      <div className={`text-[9.5px] font-bold ${r.riskScore > 50 ? 'text-[#E56A54]' : 'text-[#39B57A]'}`}>
                        Risk: {r.riskScore}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 5. ACTIVE ALERTS */}
        <div className="bg-[#081C2A] border border-[#173F59] rounded p-3">
          <div className="flex items-center justify-between border-b border-[#12364D] pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 font-mono-code font-bold uppercase tracking-wider text-xs text-[#EAF4FA]">
              <Bell className="w-4 h-4 text-[#F0B84B]" />
              <span>Active Alerts</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-[#06131F] border border-[#173F59] text-slate-300 font-mono-code text-[9px]">
              {alerts.length} Total
            </span>
          </div>

          <div className="space-y-1.5">
            {alerts.map((alt) => {
              const borderBadge =
                alt.level === 'CRITICAL'
                  ? 'border-[#C93B4B]/60 bg-[#C93B4B]/10 text-[#C93B4B]'
                  : alt.level === 'WARNING'
                  ? 'border-[#F0B84B]/60 bg-[#F0B84B]/10 text-[#F0B84B]'
                  : 'border-[#59C7F3]/60 bg-[#59C7F3]/10 text-[#59C7F3]';

              return (
                <div key={alt.id} className={`p-2 rounded border ${borderBadge} text-xs font-mono-code`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[10px] uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{alt.title}</span>
                    </span>
                    <span className="text-[8.5px] text-slate-400">{alt.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-sans leading-snug">
                    {alt.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
