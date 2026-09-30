import React from 'react';
import {
  TrendingUp,
  Waves,
  Compass,
  Wind,
  Thermometer,
  Clock,
  Layers,
  Database,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { SeaIceForecastPoint, Iceberg } from '../types';
import { LAYER_METADATA_CATALOG } from '../services/polarGeoData';

interface EnvironmentalForecastViewProps {
  forecastSeries: SeaIceForecastPoint[];
  icebergs: Iceberg[];
}

export const EnvironmentalForecastView: React.FC<EnvironmentalForecastViewProps> = ({
  forecastSeries,
  icebergs,
}) => {
  return (
    <div className="absolute inset-0 z-30 bg-[#06131F]/90 backdrop-blur-md p-6 overflow-y-auto font-mono-code text-slate-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-[#173F59] pb-3">
          <h2 className="text-base font-bold uppercase text-[#EAF4FA] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#25B7D3]" />
            <span>24-Hour Environmental Forecast & Spatiotemporal Trends</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Coupled sea-ice growth models, Ekman hydrodynamic drift vectors, and atmospheric wind forcing derived from Sentinel-1 SAR, AMSR2, and ECMWF ERA5.
          </p>
        </div>

        {/* Forecast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sea-Ice Forecast Curve */}
          <div className="bg-[#081C2A] border border-[#173F59] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#12364D] pb-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#59C7F3]">
                <Waves className="w-4 h-4 text-[#59C7F3]" />
                <span>Sea-Ice Concentration Expansion Trend</span>
              </div>
              <span className="text-[10px] text-slate-400">AMSR2 / Sentinel-1</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastSeries} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#173F59' }} />
                  <YAxis domain={[30, 75]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={{ stroke: '#173F59' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#06131F', borderColor: '#173F59', fontSize: '11px' }}
                    formatter={(v: any) => [`${v}%`, 'Concentration']}
                  />
                  <Line type="monotone" dataKey="concentration" stroke="#25B7D3" strokeWidth={2.5} dot={{ r: 3, fill: '#25B7D3' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10.5px] text-slate-400 leading-relaxed">
              Forecast indicates progressive pack ice expansion of +22% across the eastern Larsemann approach corridor due to sustained southerly katabatic winds.
            </div>
          </div>

          {/* Iceberg Trajectory Drift Field */}
          <div className="bg-[#081C2A] border border-[#173F59] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#12364D] pb-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#E56A54]">
                <Compass className="w-4 h-4 text-[#E56A54]" />
                <span>Tracked Iceberg Drift Velocities</span>
              </div>
              <span className="text-[10px] text-slate-400">YOLOv11-OBB / CFAR</span>
            </div>

            <div className="space-y-2 text-xs">
              {icebergs.map((berg) => (
                <div key={berg.id} className="p-2 rounded bg-[#06131F] border border-[#12364D] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white mr-2">{berg.id}</span>
                    <span className="text-[10px] text-slate-400 font-sans">({berg.size})</span>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="text-[#59C7F3] font-bold">{berg.velocityKnots} kn</span>
                    <span className="text-slate-400 ml-1">@ {berg.directionCompass}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10.5px] text-slate-400 leading-relaxed pt-1">
              Primary tabular hazard IB-042 (2.8 km length) is propelled by 1.1 kn ocean current and 24 kn south-westerly wind forcing, converging on Route A.
            </div>
          </div>
        </div>

        {/* Environmental Metadata Ledger */}
        <div className="bg-[#081C2A] border border-[#173F59] rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase text-slate-300 border-b border-[#12364D] pb-2">
            <Database className="w-4 h-4 text-[#39B57A]" />
            <span>Copernicus & ECMWF Operational Data Feed Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
            {Object.entries(LAYER_METADATA_CATALOG).map(([key, meta]) => (
              <div key={key} className="p-2.5 rounded bg-[#06131F] border border-[#12364D] space-y-1">
                <div className="font-bold text-[#59C7F3] text-[11px]">{meta.name}</div>
                <div className="text-[10px] text-slate-400">Source: <span className="text-slate-200">{meta.source}</span></div>
                <div className="text-[10px] text-slate-400">Timestamp: <span className="text-slate-200">{meta.timestamp}</span></div>
                <div className="text-[10px] text-slate-400">Resolution: <span className="text-slate-200">{meta.resolution}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
