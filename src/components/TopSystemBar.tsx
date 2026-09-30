import React from 'react';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Server,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { AppTab, SimulationState, Vessel } from '../types';

interface TopSystemBarProps {
  vessel: Vessel;
  simulationState: SimulationState;
  onTogglePlay: () => void;
  onResetSimulation: () => void;
  onChangeSpeed: (speed: 1 | 2 | 5) => void;
  onTriggerIncursionEvent: () => void;
  onOpenApiModal: () => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

export const TopSystemBar: React.FC<TopSystemBarProps> = ({
  vessel,
  simulationState,
  onTogglePlay,
  onResetSimulation,
  onChangeSpeed,
  onTriggerIncursionEvent,
  onOpenApiModal,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="h-14 bg-[#06131F] border-b border-[#12364D] px-3 flex items-center justify-between text-xs text-slate-200 select-none shrink-0 z-30">
      {/* LEFT: Identity & Subtitle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#081C2A] border border-[#25B7D3]/60 flex items-center justify-center text-[#59C7F3]">
            <Compass className="w-5 h-5 text-[#59C7F3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-sm text-[#EAF4FA]">POLAR-NAV AI</span>
              <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-[#081C2A] text-[#59C7F3] border border-[#173F59]">
                SIH26059
              </span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-tight flex items-center gap-2">
              <span>Antarctic Navigation Decision Support</span>
              <span className="text-slate-500">|</span>
              <span className="text-[#F0B84B] font-mono-code font-bold text-[9px] uppercase tracking-wide">
                SIMULATION MODE
              </span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-[#173F59]" />

        {/* Top View Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 font-mono-code text-[11px]">
          {[
            { id: 'DASHBOARD', label: 'Mission Dashboard' },
            { id: 'TACTICAL_MONITOR', label: 'Tactical Monitor' },
            { id: 'ROUTE_ANALYSIS', label: 'Route Analysis' },
            { id: 'ENVIRONMENTAL_FORECAST', label: 'Forecast' },
            { id: 'MISSION_SETUP', label: 'Setup' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as AppTab)}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#12364D] text-[#59C7F3] border border-[#25B7D3]/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#081C2A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* CENTER: Mission, Vessel & Navigation Status */}
      <div className="hidden xl:flex items-center gap-5 px-3 py-1 bg-[#081C2A] rounded border border-[#12364D] font-mono-code text-xs">
        <div>
          <span className="text-slate-500 text-[9px] block">MISSION</span>
          <span className="text-[#EAF4FA] font-bold text-[11px]">{vessel.missionName}</span>
        </div>
        <div className="h-5 w-px bg-[#173F59]" />
        <div>
          <span className="text-slate-500 text-[9px] block">VESSEL</span>
          <span className="text-[#59C7F3] font-bold text-[11px]">{vessel.name}</span>
        </div>
        <div className="h-5 w-px bg-[#173F59]" />
        <div>
          <span className="text-slate-500 text-[9px] block">STATUS</span>
          <span
            className={`font-bold text-[11px] ${
              vessel.navigationStatus === 'DIVERTING' ? 'text-[#F0B84B]' : 'text-[#39B57A]'
            }`}
          >
            {vessel.navigationStatus}
          </span>
        </div>
      </div>

      {/* RIGHT: Operational Telemetry & Simulation Controls */}
      <div className="flex items-center gap-3">
        {/* Telemetry Status Lights */}
        <div className="hidden md:flex items-center gap-3 text-[10px] font-mono-code text-slate-300 px-2 py-1 bg-[#081C2A] rounded border border-[#173F59]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39B57A]" />
            <span>DATA: <b className="text-slate-200">CONNECTED</b></span>
          </div>
          <div className="w-px h-3 bg-[#173F59]" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39B57A]" />
            <span>PREDICTION: <b className="text-slate-200">ACTIVE</b></span>
          </div>
          <div className="w-px h-3 bg-[#173F59]" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39B57A]" />
            <span>NAVIGATION: <b className="text-slate-200">MONITORING</b></span>
          </div>
        </div>

        {/* Iceberg Incursion Demo Event Trigger */}
        <button
          onClick={onTriggerIncursionEvent}
          title="Simulate dynamic hazard event: IB-042 shifts into Route A corridor, triggering automated Route B recommendation"
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono-code font-bold rounded bg-[#17222f] text-[#F0B84B] border border-[#F0B84B]/60 hover:bg-[#203144] transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-[#F0B84B]" />
          <span className="hidden sm:inline">Simulate Hazard Shift</span>
        </button>

        {/* Playback Controls */}
        <div className="flex items-center bg-[#081C2A] rounded border border-[#173F59] p-0.5">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              simulationState.isPlaying
                ? 'bg-[#F0B84B]/20 text-[#F0B84B] border border-[#F0B84B]/40'
                : 'bg-[#39B57A] text-white hover:bg-[#329e6a]'
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
                <span>Start Sim</span>
              </>
            )}
          </button>

          <button
            onClick={onResetSimulation}
            title="Reset Simulation"
            className="p-1.5 text-slate-400 hover:text-white rounded ml-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center ml-1 border-l border-[#173F59] pl-1 gap-0.5 font-mono-code">
            {([1, 2, 5] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-1.5 py-0.5 text-[9.5px] font-bold rounded ${
                  simulationState.speed === spd
                    ? 'bg-[#12364D] text-[#59C7F3] border border-[#25B7D3]/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* UTC Clock */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono-code text-slate-300 bg-[#081C2A] px-2 py-1 rounded border border-[#173F59]">
          <Clock className="w-3 h-3 text-[#59C7F3]" />
          <span>08:58:59 UTC</span>
        </div>

        {/* Architecture Specs */}
        <button
          onClick={onOpenApiModal}
          className="p-1.5 text-slate-400 hover:text-[#59C7F3] hover:bg-[#081C2A] border border-transparent hover:border-[#173F59] rounded"
          title="Inspect simulated FastAPI & PyTorch architecture endpoints"
        >
          <Server className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
