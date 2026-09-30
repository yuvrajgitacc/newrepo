import React from 'react';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Server,
  Info,
  Clock,
  User,
  Zap,
} from 'lucide-react';
import { SimulationState } from '../types';

interface HeaderProps {
  simulationState: SimulationState;
  onTogglePlay: () => void;
  onResetSimulation: () => void;
  onChangeSpeed: (speed: 1 | 2 | 5) => void;
  onOpenApiModal: () => void;
  onTriggerIncursionEvent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  simulationState,
  onTogglePlay,
  onResetSimulation,
  onChangeSpeed,
  onOpenApiModal,
  onTriggerIncursionEvent,
}) => {
  return (
    <header className="h-14 bg-[#090f1d] border-b border-[#172642] px-3.5 flex items-center justify-between text-xs text-slate-200 select-none shrink-0 z-30">
      {/* Left: Branding & Core Mission Identifiers */}
      <div className="flex items-center gap-5">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-cyan-600 to-blue-900 border border-cyan-400/40 shadow-sm shadow-cyan-900/50">
            <Compass className="w-5 h-5 text-cyan-200 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090f1d]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-sm text-white">
              <span>POLAR-NAV AI</span>
              <span className="text-[10px] font-mono-code font-semibold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                SIH-2026
              </span>
            </div>
            <div className="text-[10px] text-cyan-400/80 tracking-tight font-medium">
              Antarctic Navigation Decision Support System
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-7 w-px bg-[#1e2f4e]" />

        {/* Mission Name */}
        <div className="hidden lg:block">
          <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 font-medium">
            Mission
          </div>
          <div className="text-xs font-semibold text-slate-100 flex items-center gap-1">
            <span>Maitri Supply Voyage</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-blue-950/70 text-blue-300 border border-blue-800/50">
              Antarctic Sector 7
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="hidden lg:block h-7 w-px bg-[#1e2f4e]" />

        {/* Vessel Identifier */}
        <div className="hidden md:block">
          <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 font-medium">
            Vessel
          </div>
          <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            <span>RV Research Vessel X</span>
            <span className="text-[9px] font-mono-code text-slate-400">PC-5</span>
          </div>
        </div>
      </div>

      {/* Center: System Status Telemetry */}
      <div className="hidden xl:flex items-center gap-5 px-3 py-1 bg-[#0c162b] rounded border border-[#1b2d4f]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-200">Data Connected</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-600" />
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium text-slate-200">Prediction Active</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-600" />
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium text-slate-200">Navigation Monitoring</span>
        </div>
      </div>

      {/* Right: Simulation Controls, Event Trigger, Time & Status */}
      <div className="flex items-center gap-3">
        {/* Simulation Event Demonstration Button */}
        <button
          onClick={onTriggerIncursionEvent}
          title="Demonstrate dynamic AI re-routing when iceberg IB-042 threatens Route A"
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-950/70 text-amber-300 border border-amber-600/60 hover:bg-amber-900/80 transition-colors shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span className="hidden sm:inline">Simulate</span> Iceberg Threat
        </button>

        {/* Simulation Playback Bar */}
        <div className="flex items-center bg-[#0d172e] rounded border border-[#1b2d52] p-0.5">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              simulationState.isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow'
            }`}
          >
            {simulationState.isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Start Simulation</span>
              </>
            )}
          </button>

          <button
            onClick={onResetSimulation}
            title="Reset Simulation"
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded transition-colors ml-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center ml-1 border-l border-[#1f3256] pl-1 gap-0.5">
            {([1, 2, 5] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-1.5 py-0.5 text-[10px] font-mono-code font-bold rounded transition-colors ${
                  simulationState.speed === spd
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* API Architecture Inspection Modal Trigger */}
        <button
          onClick={onOpenApiModal}
          title="Inspect future FastAPI / PyTorch / Xarray architecture and JSON endpoints"
          className="flex items-center gap-1 px-2 py-1 text-[11px] rounded bg-[#101b33] text-cyan-300 border border-cyan-800/60 hover:bg-[#162544] transition-colors"
        >
          <Server className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">API Specs</span>
        </button>

        {/* UTC Time Display */}
        <div className="hidden sm:flex flex-col text-right font-mono-code">
          <div className="text-[11px] font-semibold text-slate-200 flex items-center justify-end gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>14:35 UTC</span>
          </div>
          <div className="text-[9px] text-slate-400">Dec 12, 2025</div>
        </div>

        {/* Simulation / Demo Mode Badge */}
        <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 text-[10px] font-mono-code font-bold uppercase tracking-wider">
          SIMULATION MODE
        </div>

        {/* Profile / Operator */}
        <div className="w-7 h-7 rounded-full bg-[#13223f] border border-[#213760] flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-colors">
          <User className="w-3.5 h-3.5" />
        </div>
      </div>
    </header>
  );
};
