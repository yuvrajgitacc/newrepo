import React from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Compass,
  Shield,
  Navigation,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { TimelineHour, Vessel, MissionStatusChecklist } from '../types';

interface ForecastTimelineBarProps {
  timelineHour: TimelineHour;
  onChangeHour: (h: TimelineHour) => void;
  vessel: Vessel;
  seaIcePct: number;
  icebergsCount: number;
  closestHazardNM: number;
  missionChecklist: MissionStatusChecklist;
}

const HOURS: TimelineHour[] = [0, 6, 12, 18, 24];

export const ForecastTimelineBar: React.FC<ForecastTimelineBarProps> = ({
  timelineHour,
  onChangeHour,
  vessel,
  seaIcePct,
  icebergsCount,
  closestHazardNM,
  missionChecklist,
}) => {
  const currentIndex = HOURS.indexOf(timelineHour);

  const handlePrev = () => {
    if (currentIndex > 0) onChangeHour(HOURS[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < HOURS.length - 1) onChangeHour(HOURS[currentIndex + 1]);
  };

  return (
    <div className="bg-[#06131F] border-t border-[#12364D] px-3.5 py-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs select-none shrink-0 z-20">
      {/* 1. INTERACTIVE FORECAST TIMELINE SLIDER */}
      <div className="w-full md:w-5/12 flex flex-col gap-1">
        <div className="flex items-center justify-between font-mono-code text-[11px]">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[#59C7F3]">
            <Clock className="w-3.5 h-3.5 text-[#59C7F3]" />
            <span>Forecast Timeline</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-0.5 rounded hover:bg-[#12364D] disabled:opacity-30 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-white px-2 py-0.5 rounded bg-[#081C2A] border border-[#173F59] text-[#59C7F3]">
              {timelineHour === 0 ? 'NOW (T+0)' : `+${timelineHour}H FORECAST`}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === HOURS.length - 1}
              className="p-0.5 rounded hover:bg-[#12364D] disabled:opacity-30 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <div className="relative pt-0.5">
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={currentIndex}
            onChange={(e) => onChangeHour(HOURS[parseInt(e.target.value)])}
            className="w-full h-1.5 bg-[#0B2435] rounded appearance-none cursor-pointer accent-[#25B7D3] focus:outline-none"
          />
          <div className="flex justify-between text-[9px] font-mono-code text-slate-400 mt-1">
            {HOURS.map((h) => (
              <button
                key={h}
                onClick={() => onChangeHour(h)}
                className={`transition-colors ${
                  timelineHour === h ? 'text-[#59C7F3] font-bold' : 'hover:text-slate-200'
                }`}
              >
                {h === 0 ? 'NOW' : `+${h}H`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME VESSEL NAVIGATION TELEMETRY HUD */}
      <div className="hidden lg:flex items-center gap-4 px-3 py-1.5 bg-[#081C2A] rounded border border-[#173F59] font-mono-code text-[10.5px]">
        <div>
          <span className="text-slate-500 text-[8.5px] block">VESSEL SPEED</span>
          <span className="text-white font-bold">{vessel.speedKnots.toFixed(1)} kn</span>
        </div>
        <div className="w-px h-5 bg-[#173F59]" />
        <div>
          <span className="text-slate-500 text-[8.5px] block">HEADING</span>
          <span className="text-[#59C7F3] font-bold">{vessel.headingDegrees.toString().padStart(3, '0')}°</span>
        </div>
        <div className="w-px h-5 bg-[#173F59]" />
        <div>
          <span className="text-slate-500 text-[8.5px] block">REMAINING DIST</span>
          <span className="text-[#39B57A] font-bold">{vessel.distanceToDestNM} NM</span>
        </div>
        <div className="w-px h-5 bg-[#173F59]" />
        <div>
          <span className="text-slate-500 text-[8.5px] block">ICE CLEARANCE</span>
          <span
            className={`font-bold ${
              vessel.iceClearanceNM < 5 ? 'text-[#C93B4B]' : 'text-slate-200'
            }`}
          >
            {vessel.iceClearanceNM} NM
          </span>
        </div>
        <div className="w-px h-5 bg-[#173F59]" />
        <div>
          <span className="text-slate-500 text-[8.5px] block">CLOSEST HAZARD</span>
          <span
            className={`font-bold ${
              closestHazardNM < 5 ? 'text-[#C93B4B]' : 'text-[#F0B84B]'
            }`}
          >
            {closestHazardNM} NM (IB-042)
          </span>
        </div>
      </div>

      {/* 3. MISSION PIPELINE STATUS CHECKLIST */}
      <div className="hidden xl:flex items-center gap-3 text-[10px] font-mono-code text-slate-300">
        <span className="text-slate-500 uppercase text-[9px] font-bold">Pipeline:</span>
        {[
          { label: 'Data', state: missionChecklist.environmentalData },
          { label: 'Ice Forecast', state: missionChecklist.seaIceForecast },
          { label: 'Berg Drift', state: missionChecklist.icebergPrediction },
          { label: 'Risk Model', state: missionChecklist.riskAssessment },
          { label: 'Optimization', state: missionChecklist.routeOptimization },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-1">
            {item.state === 'Completed' ? (
              <CheckCircle2 className="w-3 h-3 text-[#39B57A]" />
            ) : item.state === 'Running' ? (
              <Loader2 className="w-3 h-3 text-[#25B7D3] animate-spin" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            )}
            <span className={item.state === 'Completed' ? 'text-slate-200' : 'text-slate-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
