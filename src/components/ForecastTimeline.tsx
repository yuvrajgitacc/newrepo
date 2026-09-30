import React from 'react';
import {
  Clock,
  Waves,
  Compass,
  ShieldAlert,
  Navigation,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { TimelineHour } from '../types';

interface ForecastTimelineProps {
  timelineHour: TimelineHour;
  onChangeHour: (hour: TimelineHour) => void;
  seaIcePct: number;
  icebergsInArea: number;
  riskTrend: string;
  routeRiskStatus: string;
}

const HOURS: TimelineHour[] = [0, 6, 12, 18, 24];

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  timelineHour,
  onChangeHour,
  seaIcePct,
  icebergsInArea,
  riskTrend,
  routeRiskStatus,
}) => {
  const currentIndex = HOURS.indexOf(timelineHour);

  const handlePrev = () => {
    if (currentIndex > 0) onChangeHour(HOURS[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < HOURS.length - 1) onChangeHour(HOURS[currentIndex + 1]);
  };

  return (
    <div className="bg-[#090f1e] border-t border-[#172642] px-3.5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs select-none">
      {/* Left: Interactive Timeline Slider */}
      <div className="w-full md:w-3/5 lg:w-2/5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-slate-300 font-mono-code text-[11px]">
          <div className="flex items-center gap-1.5 font-bold uppercase text-cyan-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Forecast Timeline</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-0.5 rounded hover:bg-[#142340] disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-white px-2 py-0.5 rounded bg-[#101e38] border border-[#1e345e] text-cyan-300">
              {timelineHour === 0 ? 'NOW' : `+${timelineHour}H FORECAST`}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === HOURS.length - 1}
              className="p-0.5 rounded hover:bg-[#142340] disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline Slider Track */}
        <div className="relative pt-1 pb-1">
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={currentIndex}
            onChange={(e) => onChangeHour(HOURS[parseInt(e.target.value)])}
            className="w-full h-1.5 bg-[#172949] rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          {/* Time Labels under Track */}
          <div className="flex justify-between text-[10px] font-mono-code text-slate-400 mt-1">
            {HOURS.map((h) => (
              <button
                key={h}
                onClick={() => onChangeHour(h)}
                className={`transition-colors ${
                  timelineHour === h ? 'text-cyan-300 font-bold' : 'hover:text-slate-200'
                }`}
              >
                {h === 0 ? 'NOW' : `+${h}h`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Live Dynamic Parameter Preview Cards */}
      <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto">
        {/* Sea-Ice Thumbnail Card */}
        <div className="bg-[#0b1426] border border-[#1a2e50] rounded px-2.5 py-1.5 min-w-[110px] flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-cyan-950/70 border border-cyan-700/60 flex items-center justify-center shrink-0">
            <Waves className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-mono-code uppercase">Sea-Ice</div>
            <div className="text-xs font-bold text-white font-mono-code">{seaIcePct}%</div>
            <div className="text-[9px] text-cyan-400 font-mono-code flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>+{timelineHour === 0 ? '0' : Math.round(seaIcePct - 42)}%</span>
            </div>
          </div>
        </div>

        {/* Icebergs in Area Card */}
        <div className="bg-[#0b1426] border border-[#1a2e50] rounded px-2.5 py-1.5 min-w-[110px] flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-pink-950/70 border border-pink-700/60 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-mono-code uppercase">Icebergs</div>
            <div className="text-xs font-bold text-white font-mono-code">{icebergsInArea} in area</div>
            <div className="text-[9px] text-pink-400 font-mono-code">
              {timelineHour >= 12 ? 'IB-042 Alert' : 'Tracked'}
            </div>
          </div>
        </div>

        {/* Risk Zones Trend Card */}
        <div className="bg-[#0b1426] border border-[#1a2e50] rounded px-2.5 py-1.5 min-w-[110px] flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-amber-950/70 border border-amber-700/60 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-mono-code uppercase">Risk Zones</div>
            <div className={`text-xs font-bold font-mono-code ${timelineHour >= 12 ? 'text-rose-400' : 'text-amber-300'}`}>
              {riskTrend}
            </div>
            <div className="text-[9px] text-slate-400 font-mono-code">Dynamic Map</div>
          </div>
        </div>

        {/* Route Risk Status Card */}
        <div className="bg-[#0b1426] border border-[#1a2e50] rounded px-2.5 py-1.5 min-w-[110px] flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-950/70 border border-blue-700/60 flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-mono-code uppercase">Route Risk</div>
            <div className={`text-xs font-bold font-mono-code ${routeRiskStatus === 'High' ? 'text-rose-400' : routeRiskStatus === 'Moderate' ? 'text-amber-300' : 'text-emerald-400'}`}>
              {routeRiskStatus}
            </div>
            <div className="text-[9px] text-cyan-300 font-mono-code">
              {timelineHour >= 12 ? 'Route B Advised' : 'Route A Active'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
