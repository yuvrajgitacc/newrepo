import React from 'react';
import {
  Navigation,
  Compass,
  AlertTriangle,
  Clock,
  Waves,
  Shield,
  Fuel,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { Vessel, RouteOption, Iceberg, AlertItem } from '../types';

interface TacticalMonitorViewProps {
  vessel: Vessel;
  activeRoute: RouteOption;
  closestIceberg: Iceberg;
  alerts: AlertItem[];
  seaIceExposurePct: number;
}

export const TacticalMonitorView: React.FC<TacticalMonitorViewProps> = ({
  vessel,
  activeRoute,
  closestIceberg,
  alerts,
  seaIceExposurePct,
}) => {
  return (
    <div className="absolute top-3 left-3 z-30 w-80 bg-[#081C2A]/95 border border-[#173F59] rounded p-3 text-xs text-slate-200 shadow-2xl backdrop-blur-md font-mono-code space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#12364D] pb-1.5">
        <div className="flex items-center gap-1.5 font-bold uppercase text-[#59C7F3]">
          <Navigation className="w-4 h-4 text-[#59C7F3]" />
          <span>Tactical Navigation Monitor</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#39B57A]/20 text-[#39B57A] border border-[#39B57A]/40 font-bold">
          ECDIS MODE
        </span>
      </div>

      {/* Primary Vessel Telemetry */}
      <div className="grid grid-cols-2 gap-2 p-2 bg-[#06131F] rounded border border-[#12364D]">
        <div>
          <span className="text-slate-500 text-[9px] block">SPEED OVER GROUND</span>
          <span className="text-white text-sm font-bold">{vessel.speedKnots.toFixed(1)} kn</span>
        </div>
        <div>
          <span className="text-slate-500 text-[9px] block">HEADING (GYRO)</span>
          <span className="text-[#59C7F3] text-sm font-bold">
            {vessel.headingDegrees.toString().padStart(3, '0')}°
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-[9px] block">CROSS-TRACK ERROR</span>
          <span className="text-[#39B57A] font-bold">±{vessel.crossTrackErrorNM} NM</span>
        </div>
        <div>
          <span className="text-slate-500 text-[9px] block">ESTIMATED TRANSIT</span>
          <span className="text-white font-bold">{vessel.etaString}</span>
        </div>
      </div>

      {/* Route Corridor & Waypoints */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>ACTIVE ROUTE CORRIDOR</span>
          <span className="text-[#39B57A] font-bold">{activeRoute.name} ({activeRoute.status})</span>
        </div>
        <div className="p-2 bg-[#06131F] rounded border border-[#12364D] text-[10.5px] space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Next Waypoint:</span>
            <span className="text-white font-bold">{vessel.nextWaypointName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Distance to Dest:</span>
            <span className="text-white font-bold">{vessel.distanceToDestNM} NM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current Sea-Ice Exposure:</span>
            <span className="text-[#F0B84B] font-bold">{seaIceExposurePct}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Pack Ice Clearance:</span>
            <span className="text-[#39B57A] font-bold">{vessel.iceClearanceNM} NM</span>
          </div>
        </div>
      </div>

      {/* Closest Hazard Alert */}
      <div className="p-2 bg-[#06131F] rounded border border-[#173F59] space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">CLOSEST HAZARD:</span>
          <span className="text-[#E56A54] font-bold">{closestIceberg.id} ({closestIceberg.name})</span>
        </div>
        <div className="flex justify-between text-[10.5px]">
          <span className="text-slate-400">Distance:</span>
          <span className="text-white">{closestIceberg.distanceNM} NM</span>
        </div>
        <div className="flex justify-between text-[10.5px]">
          <span className="text-slate-400">Closest Approach (CPA):</span>
          <span
            className={
              closestIceberg.predictedClosestApproachNM < 5
                ? 'text-[#C93B4B] font-bold'
                : 'text-[#F0B84B] font-bold'
            }
          >
            {closestIceberg.predictedClosestApproachNM} NM
          </span>
        </div>
      </div>
    </div>
  );
};
