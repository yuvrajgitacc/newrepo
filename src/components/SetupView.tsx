import React, { useState } from 'react';
import { Sliders, RotateCcw, Play, CheckCircle2, Anchor, Target } from 'lucide-react';
import { PriorityLevel, VesselType, Vessel } from '../types';

interface SetupViewProps {
  vessel: Vessel;
  onUpdateVesselCoord: (lat: number, lng: number) => void;
  vesselType: VesselType;
  onChangeVesselType: (t: VesselType) => void;
  cruisingSpeed: number;
  onChangeSpeed: (spd: number) => void;
  safetyPriority: PriorityLevel;
  onChangeSafetyPriority: (p: PriorityLevel) => void;
  fuelPriority: PriorityLevel;
  onChangeFuelPriority: (p: PriorityLevel) => void;
  onRunNewAnalysis: () => void;
}

export const SetupView: React.FC<SetupViewProps> = ({
  vessel,
  onUpdateVesselCoord,
  vesselType,
  onChangeVesselType,
  cruisingSpeed,
  onChangeSpeed,
  safetyPriority,
  onChangeSafetyPriority,
  fuelPriority,
  onChangeFuelPriority,
  onRunNewAnalysis,
}) => {
  const [latInput, setLatInput] = useState(vessel.lat.toString());
  const [lngInput, setLngInput] = useState(vessel.lng.toString());
  const [speedInput, setSpeedInput] = useState(cruisingSpeed.toString());

  const handleApplyAndRun = () => {
    const parsedLat = parseFloat(latInput);
    const parsedLng = parseFloat(lngInput);
    const parsedSpeed = parseFloat(speedInput);

    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      onUpdateVesselCoord(parsedLat, parsedLng);
    }
    if (!isNaN(parsedSpeed)) {
      onChangeSpeed(parsedSpeed);
    }

    onRunNewAnalysis();
  };

  return (
    <div className="absolute inset-0 z-30 bg-[#06131F]/90 backdrop-blur-md p-6 overflow-y-auto font-mono-code text-slate-200">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-[#173F59] pb-3">
          <h2 className="text-base font-bold uppercase text-[#EAF4FA] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#59C7F3]" />
            <span>Mission Configuration & Sensitivity Parameter Tuning</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Adjust initial research vessel departure coordinates, target mission waypoint, propulsion thresholds, and optimization priorities.
          </p>
        </div>

        {/* Form Body */}
        <div className="bg-[#081C2A] border border-[#173F59] rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Vessel Starting Latitude (°S)</label>
              <input
                type="text"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                className="w-full bg-[#06131F] border border-[#173F59] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#25B7D3]"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Vessel Starting Longitude (°E)</label>
              <input
                type="text"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                className="w-full bg-[#06131F] border border-[#173F59] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#25B7D3]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cruising Speed (knots)</label>
              <input
                type="text"
                value={speedInput}
                onChange={(e) => setSpeedInput(e.target.value)}
                className="w-full bg-[#06131F] border border-[#173F59] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#25B7D3]"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Vessel Ice Classification</label>
              <select
                value={vesselType}
                onChange={(e) => onChangeVesselType(e.target.value as VesselType)}
                className="w-full bg-[#06131F] border border-[#173F59] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#25B7D3]"
              >
                <option value="Research / Ice-Class">Research / Ice-Class (PC-5)</option>
                <option value="Polar Icebreaker">Polar Icebreaker (PC-1)</option>
                <option value="Cargo / Polar Class">Cargo / Polar Class (PC-7)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#12364D]">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Safety Priority (Weight factor)</label>
              <select
                value={safetyPriority}
                onChange={(e) => onChangeSafetyPriority(e.target.value as PriorityLevel)}
                className="w-full bg-[#06131F] border border-[#173F59] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#25B7D3]"
              >
                <option value="High">HIGH (Heavy iceberg & pack avoidance)</option>
                <option value="Medium">MEDIUM (Standard Polar Code balance)</option>
                <option value="Low">LOW (Direct passage prioritized)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Fuel Conservation Priority</label>
              <select
                value={fuelPriority}
                onChange={(e) => onChangeFuelPriority(e.target.value as PriorityLevel)}
                className="w-full bg-[#06131F] border border-[#173F59] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#25B7D3]"
              >
                <option value="High">HIGH (Minimize resistance & speed drops)</option>
                <option value="Medium">MEDIUM (Balanced reserve)</option>
                <option value="Low">LOW (High-power ice transits permitted)</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 flex justify-end">
            <button
              onClick={handleApplyAndRun}
              className="px-5 py-2 rounded bg-[#25B7D3] hover:bg-[#1fa4bd] text-[#06131F] font-bold text-xs transition-colors flex items-center gap-2 shadow"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>APPLY PARAMETERS & RUN NEW ANALYSIS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
