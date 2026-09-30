import React, { useState } from 'react';
import {
  Anchor,
  MapPin,
  Target,
  Sliders,
  Send,
  Layers,
  Info,
  Waves,
  Compass,
  Disc,
  Wind,
  Thermometer,
  Eye,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Search,
  Radio,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import {
  EnvironmentalLayers,
  PriorityLevel,
  VesselType,
  Vessel,
  LayerMetadata,
} from '../types';
import { LAYER_METADATA_CATALOG, ANTARCTIC_STATIONS } from '../services/polarGeoData';

interface LeftControlSidebarProps {
  vessel: Vessel;
  layers: EnvironmentalLayers;
  onToggleLayer: (key: keyof EnvironmentalLayers) => void;
  vesselType: VesselType;
  onChangeVesselType: (type: VesselType) => void;
  cruisingSpeed: number;
  onChangeSpeed: (spd: number) => void;
  safetyPriority: PriorityLevel;
  onChangeSafetyPriority: (p: PriorityLevel) => void;
  fuelPriority: PriorityLevel;
  onChangeFuelPriority: (p: PriorityLevel) => void;
  onGenerateRoute: () => void;
  isGeneratingRoute: boolean;
  onSearchLocation: (coord: [number, number], zoom: number) => void;
}

export const LeftControlSidebar: React.FC<LeftControlSidebarProps> = ({
  vessel,
  layers,
  onToggleLayer,
  vesselType,
  onChangeVesselType,
  cruisingSpeed,
  onChangeSpeed,
  safetyPriority,
  onChangeSafetyPriority,
  fuelPriority,
  onChangeFuelPriority,
  onGenerateRoute,
  isGeneratingRoute,
  onSearchLocation,
}) => {
  const [isMissionSetupOpen, setIsMissionSetupOpen] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(true);
  const [activeMetadataKey, setActiveMetadataKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Local Antarctic quick search locations
  const SEARCH_TARGETS = [
    { name: 'Bharati Coastal Approach (Mission Destination)', coord: [76.1000, -69.1500] as [number, number], zoom: 7.5 },
    { name: 'R/V Bharati Explorer (Current Position)', coord: [vessel.lng, vessel.lat] as [number, number], zoom: 7.2 },
    { name: 'Bharati Station (NCPOR, India)', coord: [76.1953, -69.4069] as [number, number], zoom: 8.5 },
    { name: 'Maitri Station (Inland Base, Queen Maud Land)', coord: [11.7342, -70.7644] as [number, number], zoom: 7.0 },
    { name: 'Iceberg IB-042 (Primary Hazard)', coord: [74.2000, -67.4500] as [number, number], zoom: 8.0 },
    { name: 'Prydz Bay Outer Basin', coord: [74.5000, -67.0000] as [number, number], zoom: 6.0 },
  ];

  const filteredTargets = searchQuery.trim()
    ? SEARCH_TARGETS.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <aside className="w-[300px] bg-[#06131F] border-r border-[#12364D] flex flex-col h-full overflow-y-auto select-none shrink-0 text-slate-200 text-xs">
      {/* SEARCH BAR */}
      <div className="p-2.5 border-b border-[#12364D] bg-[#081C2A]/80">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search station, waypoint, hazard..."
            className="w-full bg-[#06131F] border border-[#173F59] rounded pl-7 pr-2 py-1 text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#25B7D3]"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-1.5" />
        </div>

        {filteredTargets.length > 0 && (
          <div className="mt-1.5 p-1 bg-[#081C2A] border border-[#173F59] rounded space-y-1 max-h-40 overflow-y-auto">
            {filteredTargets.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  onSearchLocation(t.coord, t.zoom);
                  setSearchQuery('');
                }}
                className="w-full text-left p-1 rounded hover:bg-[#12364D] text-[10.5px] text-slate-300 font-mono-code flex items-center justify-between"
              >
                <span className="truncate">{t.name}</span>
                <span className="text-[#59C7F3] text-[9px] shrink-0 ml-1">FLY TO</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 1: MISSION SETUP */}
      <div className="border-b border-[#12364D]">
        <button
          onClick={() => setIsMissionSetupOpen(!isMissionSetupOpen)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold font-mono-code uppercase tracking-wider text-slate-200 bg-[#081C2A] hover:bg-[#0c2438] transition-colors"
        >
          <div className="flex items-center gap-2 text-[#59C7F3]">
            <Anchor className="w-4 h-4 text-[#59C7F3]" />
            <span>Mission Setup</span>
          </div>
          {isMissionSetupOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isMissionSetupOpen && (
          <div className="p-3 space-y-2.5 bg-[#06131F]">
            {/* Vessel Name */}
            <div>
              <div className="text-[10px] font-mono-code uppercase text-slate-400 mb-0.5">Vessel</div>
              <div className="bg-[#081C2A] border border-[#173F59] rounded px-2 py-1 text-xs font-bold text-[#EAF4FA]">
                {vessel.name}
              </div>
            </div>

            {/* Current Position */}
            <div>
              <div className="text-[10px] font-mono-code uppercase text-slate-400 mb-0.5 flex justify-between">
                <span>Current Position</span>
                <span className="text-[#39B57A] font-bold text-[9px]">AUTO-FILLED</span>
              </div>
              <div className="bg-[#081C2A] border border-[#173F59] rounded px-2 py-1 font-mono-code text-[11px] text-[#59C7F3] flex justify-between">
                <span>{Math.abs(vessel.lat).toFixed(4)}° S</span>
                <span className="text-slate-500">|</span>
                <span>{vessel.lng.toFixed(4)}° E</span>
              </div>
            </div>

            {/* Destination */}
            <div>
              <div className="text-[10px] font-mono-code uppercase text-slate-400 mb-0.5">Destination</div>
              <div className="bg-[#081C2A] border border-[#173F59] rounded px-2 py-1 text-[11px] text-[#EAF4FA] font-medium">
                <div className="font-bold text-[#39B57A]">{vessel.destinationName}</div>
                <div className="text-[9.5px] font-mono-code text-slate-400">Prydz Bay Offshore Approach (69.15° S, 76.10° E)</div>
              </div>
            </div>

            {/* Mission Parameters */}
            <div className="pt-1.5 border-t border-[#12364D] space-y-2">
              <div className="text-[10px] font-mono-code uppercase text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-[#59C7F3]" />
                <span>Mission Parameters</span>
              </div>

              {/* Vessel Type */}
              <div>
                <label className="text-[9.5px] text-slate-400 block mb-0.5">Vessel Type</label>
                <select
                  value={vesselType}
                  onChange={(e) => onChangeVesselType(e.target.value as VesselType)}
                  className="w-full bg-[#081C2A] border border-[#173F59] rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-[#25B7D3]"
                >
                  <option value="Research / Ice-Class">Research / Ice-Class (PC-5)</option>
                  <option value="Polar Icebreaker">Polar Icebreaker (PC-1)</option>
                  <option value="Cargo / Polar Class">Cargo / Polar Class (PC-7)</option>
                </select>
              </div>

              {/* Cruising Speed */}
              <div>
                <div className="flex justify-between text-[9.5px] text-slate-400 mb-0.5">
                  <span>Cruising Speed</span>
                  <span className="font-mono-code text-[#59C7F3] font-bold">{cruisingSpeed.toFixed(1)} kn</span>
                </div>
                <select
                  value={cruisingSpeed}
                  onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
                  className="w-full bg-[#081C2A] border border-[#173F59] rounded px-2 py-1 text-[11px] text-slate-200 font-mono-code focus:outline-none focus:border-[#25B7D3]"
                >
                  <option value="10.0">10.0 kn (Heavy Pack Penetration)</option>
                  <option value="12.5">12.5 kn (Standard Transit)</option>
                  <option value="14.5">14.5 kn (Open Lead Dash)</option>
                </select>
              </div>

              {/* Priority Selectors */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] text-slate-400 block mb-0.5">Safety Priority</label>
                  <select
                    value={safetyPriority}
                    onChange={(e) => onChangeSafetyPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-[#081C2A] border border-[#173F59] rounded px-1.5 py-1 text-[11px] text-slate-200 font-medium focus:outline-none focus:border-[#25B7D3]"
                  >
                    <option value="High">HIGH</option>
                    <option value="Medium">MEDIUM</option>
                    <option value="Low">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] text-slate-400 block mb-0.5">Fuel Priority</label>
                  <select
                    value={fuelPriority}
                    onChange={(e) => onChangeFuelPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-[#081C2A] border border-[#173F59] rounded px-1.5 py-1 text-[11px] text-slate-200 font-medium focus:outline-none focus:border-[#25B7D3]"
                  >
                    <option value="High">HIGH</option>
                    <option value="Medium">MEDIUM</option>
                    <option value="Low">LOW</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GENERATE ROUTE ACTION BUTTON */}
            <button
              onClick={onGenerateRoute}
              disabled={isGeneratingRoute}
              className={`w-full py-2 px-3 mt-2 rounded font-bold font-mono-code text-xs flex items-center justify-center gap-2 transition-all ${
                isGeneratingRoute
                  ? 'bg-[#12364D] text-[#59C7F3] border border-[#25B7D3]/60 cursor-wait'
                  : 'bg-[#25B7D3] hover:bg-[#1fa4bd] text-[#06131F] font-bold shadow-sm active:scale-[0.98]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isGeneratingRoute ? 'RUNNING MULTI-OBJECTIVE A*...' : 'GENERATE ROUTE'}</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2: ENVIRONMENTAL LAYERS & SOURCE METADATA */}
      <div className="border-b border-[#12364D]">
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold font-mono-code uppercase tracking-wider text-slate-200 bg-[#081C2A] hover:bg-[#0c2438] transition-colors"
        >
          <div className="flex items-center gap-2 text-[#59C7F3]">
            <Layers className="w-4 h-4 text-[#59C7F3]" />
            <span>Environmental Layers</span>
          </div>
          {isLayersOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isLayersOpen && (
          <div className="p-3 space-y-1 bg-[#06131F]">
            {[
              { key: 'seaIceConcentration', label: 'Sea-Ice Concentration', icon: Waves, color: '#25B7D3' },
              { key: 'icebergObservations', label: 'Iceberg Observations', icon: Compass, color: '#E56A54' },
              { key: 'predictedIcebergPaths', label: 'Predicted Iceberg Paths', icon: Disc, color: '#59C7F3' },
              { key: 'riskZones', label: 'Risk Threat Zones', icon: ShieldAlert, color: '#C93B4B' },
              { key: 'researchStations', label: 'Research Stations', icon: Building2, color: '#39B57A' },
              { key: 'predictiveAwarenessRange', label: 'Awareness Range (100 NM)', icon: Radio, color: '#25B7D3' },
              { key: 'oceanCurrents', label: 'Ocean Currents', icon: Waves, color: '#59C7F3' },
              { key: 'windVectors', label: 'Wind Vectors', icon: Wind, color: '#EAF4FA' },
              { key: 'satelliteImagery', label: 'Satellite Imagery (SAR)', icon: Eye, color: '#39B57A' },
              { key: 'seaSurfaceTemperature', label: 'Sea Surface Temp', icon: Thermometer, color: '#F0B84B' },
            ].map(({ key, label, icon: Icon, color }) => {
              const isChecked = !!(layers as any)[key];
              const meta = LAYER_METADATA_CATALOG[key];

              return (
                <div key={key} className="flex items-center justify-between p-1 rounded hover:bg-[#081C2A] group">
                  <label className="flex items-center gap-2 text-xs cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleLayer(key as keyof EnvironmentalLayers)}
                      className="rounded bg-[#081C2A] border-[#173F59] text-[#25B7D3] focus:ring-0 w-3.5 h-3.5"
                    />
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <span className={isChecked ? 'text-slate-200' : 'text-slate-400'}>{label}</span>
                  </label>

                  {meta && (
                    <button
                      onClick={() => setActiveMetadataKey(activeMetadataKey === key ? null : key)}
                      className="p-1 text-slate-500 hover:text-[#59C7F3] rounded"
                      title="Inspect real data source & metadata"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* METADATA INSPECTOR DRAWER */}
            {activeMetadataKey && LAYER_METADATA_CATALOG[activeMetadataKey] && (
              <div className="mt-2 p-2 bg-[#081C2A] border border-[#173F59] rounded text-[10px] font-mono-code space-y-1 animate-in fade-in duration-100">
                <div className="flex justify-between font-bold text-[#59C7F3] border-b border-[#12364D] pb-1">
                  <span>{LAYER_METADATA_CATALOG[activeMetadataKey].name}</span>
                  <span className="text-[#39B57A]">{LAYER_METADATA_CATALOG[activeMetadataKey].mode}</span>
                </div>
                <div>
                  <span className="text-slate-400">Source: </span>
                  <span className="text-slate-200">{LAYER_METADATA_CATALOG[activeMetadataKey].source}</span>
                </div>
                <div>
                  <span className="text-slate-400">Sensor: </span>
                  <span className="text-slate-200">{LAYER_METADATA_CATALOG[activeMetadataKey].sensor}</span>
                </div>
                <div>
                  <span className="text-slate-400">Timestamp: </span>
                  <span className="text-slate-200">{LAYER_METADATA_CATALOG[activeMetadataKey].timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400">Resolution: </span>
                  <span className="text-slate-200">{LAYER_METADATA_CATALOG[activeMetadataKey].resolution}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER SUMMARY */}
      <div className="mt-auto p-2.5 bg-[#081C2A] border-t border-[#12364D] text-[10px] font-mono-code text-slate-400 flex items-center justify-between">
        <span>Cartographic Datum: WGS-84</span>
        <span className="text-[#39B57A] font-bold">GIS Online</span>
      </div>
    </aside>
  );
};
