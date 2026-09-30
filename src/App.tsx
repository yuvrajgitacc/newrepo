/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TopSystemBar } from './components/TopSystemBar';
import { LeftControlSidebar } from './components/LeftControlSidebar';
import { MapLibreMap } from './components/MapLibreMap';
import { RightIntelligencePanel } from './components/RightIntelligencePanel';
import { ForecastTimelineBar } from './components/ForecastTimelineBar';
import { TacticalMonitorView } from './components/TacticalMonitorView';
import { RouteAnalysisView } from './components/RouteAnalysisView';
import { EnvironmentalForecastView } from './components/EnvironmentalForecastView';
import { SetupView } from './components/SetupView';
import { WhyThisRouteModal } from './components/WhyThisRouteModal';
import { IcebergTrajectoryModal } from './components/IcebergTrajectoryModal';
import { ApiArchitectureModal } from './components/ApiArchitectureModal';
import { RouteGenerationModal } from './components/RouteGenerationModal';

import {
  Vessel,
  Iceberg,
  RouteOption,
  EnvironmentalLayers,
  RiskAssessmentData,
  AlertItem,
  SeaIceForecastPoint,
  TimelineHour,
  SimulationState,
  PriorityLevel,
  VesselType,
  MissionStatusChecklist,
  AppTab,
  BasemapStyle,
} from './types';

import {
  INITIAL_VESSEL,
  INITIAL_ICEBERGS,
  INITIAL_ROUTES,
  INITIAL_FORECAST_SERIES,
  calculateGeospatialSimulationState,
} from './services/polarGeoData';

const STAGES = [
  '1. Ingesting Sentinel-1 SAR imagery and AMSR2 microwave radiometer data',
  '2. Generating spatiotemporal ConvLSTM sea-ice concentration tensor',
  '3. Running YOLOv11-OBB iceberg detector and CFAR segmentation',
  '4. Solving coupled hydrodynamic drift equations (Ekman + Wind forcing)',
  '5. Computing dynamic IMO Polar Code navigation risk matrix',
  '6. Executing Multi-Objective Polar A* path optimization',
  '7. Publishing optimal route geometry and tactical navigation advisory',
];

export default function App() {
  // Navigation View Tab
  const [activeTab, setActiveTab] = useState<AppTab>('DASHBOARD');
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('dark');

  // Vessel & Mission Parameters
  const [vessel, setVessel] = useState<Vessel>(INITIAL_VESSEL);
  const [cruisingSpeed, setCruisingSpeed] = useState<number>(12.5);
  const [vesselType, setVesselType] = useState<VesselType>('Research / Ice-Class');
  const [fuelPriority, setFuelPriority] = useState<PriorityLevel>('Medium');
  const [safetyPriority, setSafetyPriority] = useState<PriorityLevel>('High');

  // Functional Environmental Layer Toggles
  const [layers, setLayers] = useState<EnvironmentalLayers>({
    vessel: true,
    destination: true,
    seaIceConcentration: true,
    icebergObservations: true,
    predictedIcebergPaths: true,
    riskZones: true,
    oceanCurrents: false,
    windVectors: false,
    seaSurfaceTemperature: false,
    satelliteImagery: false,
    researchStations: true,
    predictiveAwarenessRange: true,
  });

  // Timeline & Simulation Clock
  const [timelineHour, setTimelineHour] = useState<TimelineHour>(0);
  const [isEventTriggered, setIsEventTriggered] = useState<boolean>(false);
  const [vesselProgressRatio, setVesselProgressRatio] = useState<number>(0.0);

  const [simulationState, setSimulationState] = useState<SimulationState>({
    isPlaying: false,
    speed: 1,
    timelineHour: 0,
    hasIncursionTriggered: false,
    vesselProgressRatio: 0.0,
  });

  // Selected Entities
  const [selectedRouteId, setSelectedRouteId] = useState<'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C'>('ROUTE_A');
  const [selectedIcebergId, setSelectedIcebergId] = useState<string>('IB-042');

  // Mission Checklist
  const [missionChecklist, setMissionChecklist] = useState<MissionStatusChecklist>({
    environmentalData: 'Completed',
    seaIceForecast: 'Completed',
    icebergPrediction: 'Completed',
    riskAssessment: 'Completed',
    routeOptimization: 'Completed',
    navigationMonitoring: 'Running',
  });

  // Modals
  const [isWhyRouteOpen, setIsWhyRouteOpen] = useState(false);
  const [modalIceberg, setModalIceberg] = useState<Iceberg | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isRouteGenModalOpen, setIsRouteGenModalOpen] = useState(false);
  const [genStageIndex, setGenStageIndex] = useState(0);

  // Dynamic state computed deterministically from real geospatial variables
  const dynamicState = calculateGeospatialSimulationState(
    timelineHour,
    safetyPriority,
    fuelPriority,
    isEventTriggered,
    vesselProgressRatio
  );

  const currentVessel = dynamicState.vessel;
  const currentIcebergs = dynamicState.icebergs;
  const currentRoutes = dynamicState.routes;
  const currentRiskAssessment = dynamicState.riskAssessment;
  const currentAlerts = dynamicState.alerts;
  const activeRecommendedRouteId = dynamicState.recommendedRouteId;

  // Selected entities
  const selectedIcebergObj = currentIcebergs.find((b) => b.id === selectedIcebergId) || currentIcebergs[0];
  const recommendedRouteObj = currentRoutes.find((r) => r.id === activeRecommendedRouteId) || currentRoutes[0];
  const alternativeRouteObj = currentRoutes.find((r) => r.id !== activeRecommendedRouteId) || currentRoutes[1];
  const activeSelectedRoute = currentRoutes.find((r) => r.id === selectedRouteId) || recommendedRouteObj;

  // Sync selected route with recommended route automatically when recommended changes
  useEffect(() => {
    if (activeRecommendedRouteId) {
      setSelectedRouteId(activeRecommendedRouteId);
    }
  }, [activeRecommendedRouteId]);

  // Simulation loop: advances vessel along route and timeline
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!simulationState.isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 1200 / simulationState.speed;

    timerRef.current = setInterval(() => {
      setVesselProgressRatio((prev) => {
        const next = prev + 0.04;
        if (next >= 1.0) {
          setSimulationState((s) => ({ ...s, isPlaying: false }));
          return 1.0;
        }
        return next;
      });

      // Synchronize timeline hour smoothly with voyage progress
      setTimelineHour((prev) => {
        const hours: TimelineHour[] = [0, 6, 12, 18, 24];
        const nextIdx = (hours.indexOf(prev) + 1);
        if (nextIdx >= hours.length) return 24;
        const nextH = hours[nextIdx];
        if (nextH >= 12) {
          setIsEventTriggered(true);
        }
        return nextH;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simulationState.isPlaying, simulationState.speed]);

  // Toggle Layer handler
  const handleToggleLayer = (key: keyof EnvironmentalLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Timeline scrubber
  const handleTimelineChange = (h: TimelineHour) => {
    setTimelineHour(h);
    if (h >= 12) {
      setIsEventTriggered(true);
    } else {
      setIsEventTriggered(false);
    }
    // Set vessel progress approximately with timeline
    setVesselProgressRatio(h / 24);
  };

  // Trigger Incursion Event
  const handleTriggerIncursionEvent = () => {
    setIsEventTriggered(true);
    setTimelineHour(12);
    setVesselProgressRatio(0.48);
  };

  // Reset Simulation
  const handleResetSimulation = () => {
    setTimelineHour(0);
    setIsEventTriggered(false);
    setVesselProgressRatio(0.0);
    setSelectedRouteId('ROUTE_A');
    setSelectedIcebergId('IB-042');
    setSimulationState({
      isPlaying: false,
      speed: 1,
      timelineHour: 0,
      hasIncursionTriggered: false,
      vesselProgressRatio: 0.0,
    });
  };

  // ML Route Generation Sequence
  const handleGenerateRoute = () => {
    setIsRouteGenModalOpen(true);
    setGenStageIndex(0);

    const stepInterval = 550;
    STAGES.forEach((_, idx) => {
      setTimeout(() => {
        setGenStageIndex(idx + 1);
      }, (idx + 1) * stepInterval);
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#06131F] text-slate-100 overflow-hidden font-sans">
      {/* 1. TOP SYSTEM BAR */}
      <TopSystemBar
        vessel={currentVessel}
        simulationState={simulationState}
        onTogglePlay={() =>
          setSimulationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
        }
        onResetSimulation={handleResetSimulation}
        onChangeSpeed={(spd) =>
          setSimulationState((prev) => ({ ...prev, speed: spd }))
        }
        onTriggerIncursionEvent={handleTriggerIncursionEvent}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left GIS Control Sidebar */}
        <LeftControlSidebar
          vessel={currentVessel}
          layers={layers}
          onToggleLayer={handleToggleLayer}
          vesselType={vesselType}
          onChangeVesselType={setVesselType}
          cruisingSpeed={cruisingSpeed}
          onChangeSpeed={setCruisingSpeed}
          safetyPriority={safetyPriority}
          onChangeSafetyPriority={setSafetyPriority}
          fuelPriority={fuelPriority}
          onChangeFuelPriority={setFuelPriority}
          onGenerateRoute={handleGenerateRoute}
          isGeneratingRoute={isRouteGenModalOpen && genStageIndex < STAGES.length}
          onSearchLocation={(coord, zoom) => {
            // Handled via MapLibre
          }}
        />

        {/* Central Map Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <MapLibreMap
            vessel={currentVessel}
            icebergs={currentIcebergs}
            routes={currentRoutes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
            selectedIcebergId={selectedIcebergId}
            onSelectIceberg={(id) => {
              setSelectedIcebergId(id);
              const b = currentIcebergs.find((x) => x.id === id);
              if (b) setModalIceberg(b);
            }}
            layers={layers}
            timelineHour={timelineHour}
            basemapStyle={basemapStyle}
            onChangeBasemapStyle={setBasemapStyle}
            onOpenTrajectoryModal={(b) => setModalIceberg(b)}
            onOpenWhyThisRoute={() => setIsWhyRouteOpen(true)}
          />

          {/* Dynamic Hazard Shift Banner */}
          {isEventTriggered && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-[#081C2A]/95 border border-[#C93B4B] rounded px-4 py-2 text-xs text-slate-200 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top duration-200 font-mono-code">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C93B4B] animate-ping" />
              <div>
                <span className="font-bold text-[#C93B4B] uppercase mr-2">
                  HAZARD DETECTED:
                </span>
                <span>
                  IB-042 projected path crosses Route A. Route B is now recommended (Safe evasion margin: 28.4 NM).
                </span>
              </div>
              <button
                onClick={() => setIsWhyRouteOpen(true)}
                className="px-2 py-0.5 rounded bg-[#12364D] hover:bg-[#173F59] text-[#59C7F3] border border-[#25B7D3]/50 text-[10.5px] font-bold"
              >
                Explain Decision
              </button>
            </div>
          )}

          {/* Alternate View Tabs Rendered as Focused Overlays */}
          {activeTab === 'TACTICAL_MONITOR' && (
            <TacticalMonitorView
              vessel={currentVessel}
              activeRoute={activeSelectedRoute}
              closestIceberg={selectedIcebergObj}
              alerts={currentAlerts}
              seaIceExposurePct={dynamicState.seaIceCurrentPct}
            />
          )}

          {activeTab === 'ROUTE_ANALYSIS' && (
            <RouteAnalysisView
              routes={currentRoutes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={setSelectedRouteId}
              onOpenWhyThisRoute={() => setIsWhyRouteOpen(true)}
            />
          )}

          {activeTab === 'ENVIRONMENTAL_FORECAST' && (
            <EnvironmentalForecastView
              forecastSeries={INITIAL_FORECAST_SERIES}
              icebergs={currentIcebergs}
            />
          )}

          {activeTab === 'MISSION_SETUP' && (
            <SetupView
              vessel={currentVessel}
              onUpdateVesselCoord={(lat, lng) =>
                setVessel((v) => ({ ...v, lat, lng }))
              }
              vesselType={vesselType}
              onChangeVesselType={setVesselType}
              cruisingSpeed={cruisingSpeed}
              onChangeSpeed={setCruisingSpeed}
              safetyPriority={safetyPriority}
              onChangeSafetyPriority={setSafetyPriority}
              fuelPriority={fuelPriority}
              onChangeFuelPriority={setFuelPriority}
              onRunNewAnalysis={handleResetSimulation}
            />
          )}

          {/* Bottom Continuous Forecast Timeline & HUD Bar */}
          <ForecastTimelineBar
            timelineHour={timelineHour}
            onChangeHour={handleTimelineChange}
            vessel={currentVessel}
            seaIcePct={dynamicState.seaIceCurrentPct}
            icebergsCount={currentIcebergs.length}
            closestHazardNM={selectedIcebergObj.predictedClosestApproachNM}
            missionChecklist={missionChecklist}
          />
        </div>

        {/* Right Intelligence & Decision Support Panel */}
        <RightIntelligencePanel
          riskAssessment={currentRiskAssessment}
          forecastSeries={INITIAL_FORECAST_SERIES}
          selectedIceberg={selectedIcebergObj}
          routes={currentRoutes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
          alerts={currentAlerts}
          timelineHour={timelineHour}
          onFlyToIceberg={(b) => setModalIceberg(b)}
          onOpenTrajectoryModal={(b) => setModalIceberg(b)}
          onOpenWhyThisRoute={() => setIsWhyRouteOpen(true)}
        />
      </div>

      {/* 3. MODALS */}
      <WhyThisRouteModal
        isOpen={isWhyRouteOpen}
        onClose={() => setIsWhyRouteOpen(false)}
        recommendedRoute={recommendedRouteObj}
        alternativeRoute={alternativeRouteObj}
        safetyPriority={safetyPriority}
        fuelPriority={fuelPriority}
      />

      <IcebergTrajectoryModal
        isOpen={modalIceberg !== null}
        onClose={() => setModalIceberg(null)}
        iceberg={modalIceberg}
      />

      <ApiArchitectureModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      <RouteGenerationModal
        isOpen={isRouteGenModalOpen}
        stageIndex={genStageIndex}
        stages={STAGES}
        recommendedRoute={recommendedRouteObj}
        onClose={() => setIsRouteGenModalOpen(false)}
      />
    </div>
  );
}
