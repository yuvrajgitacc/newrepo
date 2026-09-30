export type VesselType = 'Research / Ice-Class' | 'Polar Icebreaker' | 'Cargo / Polar Class';
export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type AppTab = 'DASHBOARD' | 'TACTICAL_MONITOR' | 'ROUTE_ANALYSIS' | 'ENVIRONMENTAL_FORECAST' | 'MISSION_SETUP';
export type BasemapStyle = 'dark' | 'ocean' | 'satellite';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Vessel {
  name: string;
  callsign: string;
  type: VesselType;
  lat: number;
  lng: number;
  speedKnots: number;
  headingDegrees: number;
  distanceToDestNM: number;
  fuelPercent: number;
  navigationStatus: 'UNDERWAY' | 'ON ROUTE' | 'DIVERTING' | 'MANEUVERING' | 'ICE-BOUND' | 'STANDBY';
  missionName: string;
  destinationName: string;
  destinationCoord: LatLng;
  iceClearanceNM: number;
  etaString: string;
  nextWaypointName: string;
  crossTrackErrorNM: number;
}

export interface ResearchStation {
  id: string;
  name: string;
  country: string;
  operator: string;
  lat: number;
  lng: number;
  elevationM: number;
  type: 'Coastal Research Station' | 'Inland Continental Station' | 'Sub-Antarctic Base';
  establishedYear: number;
  status: 'Operational' | 'Seasonal' | 'Automated';
}

export interface IcebergTrajectoryPoint {
  timeLabel: 'NOW' | '+6H' | '+12H' | '+18H' | '+24H';
  hoursOffset: number;
  lat: number;
  lng: number;
  uncertaintyRadiusNM: number;
}

export interface Iceberg {
  id: string;
  name: string;
  size: 'Growler' | 'Bergy Bit' | 'Medium Tabular' | 'Giant Tabular';
  dimensionsMeters: string;
  lat: number;
  lng: number;
  velocityKnots: number;
  directionCompass: string;
  directionDegrees: number;
  confidencePercent: number;
  distanceNM: number;
  predictedClosestApproachNM: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  trajectory: IcebergTrajectoryPoint[];
  lastObservedUtc: string;
}

export interface RouteOption {
  id: 'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C';
  name: string;
  type: 'Recommended' | 'Alternative' | 'High Risk';
  status: 'RECOMMENDED' | 'ACCEPTABLE' | 'EVALUATING' | 'HIGH RISK';
  distanceNM: number;
  etaString: string;
  etaHours: number;
  fuelIndex: number; // 0.0 - 1.0 (lower is more efficient)
  safetyScore: number; // 0 - 100
  efficiencyScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  overallRank: number;
  iceExposurePercent: number;
  icebergClosestApproachNM: number;
  color: string;
  dashArray: [number, number] | null;
  coordinates: [number, number][]; // [lng, lat] pairs for GeoJSON
  waypoints: {
    name: string;
    lat: number;
    lng: number;
    iceConcentrationPct: number;
    risk: 'Low' | 'Moderate' | 'High';
  }[];
  explanation: {
    title: string;
    points: string[];
    riskFactor: string;
    fuelBenefit: string;
  };
}

export interface EnvironmentalLayers {
  vessel: boolean;
  destination: boolean;
  seaIceConcentration: boolean;
  icebergObservations: boolean;
  predictedIcebergPaths: boolean;
  riskZones: boolean;
  oceanCurrents: boolean;
  windVectors: boolean;
  seaSurfaceTemperature: boolean;
  satelliteImagery: boolean;
  researchStations: boolean;
  predictiveAwarenessRange: boolean;
}

export interface LayerMetadata {
  name: string;
  source: string;
  sensor: string;
  timestamp: string;
  resolution: string;
  mode: 'SIMULATED DEMO' | 'COPERNICUS DEMO' | 'HYCOM FORECAST';
}

export interface SeaIceForecastPoint {
  time: string;
  hours: number;
  concentration: number;
  packIceThicknessM: number;
  openWaterLeadWidthNM: number;
}

export interface RiskAssessmentData {
  status: 'MINIMAL RISK' | 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK';
  overallScore: number; // 0 - 100
  seaIceRisk: number; // 0 - 100
  icebergRisk: number;
  weatherRisk: number;
  routeRisk: number;
  confidencePercent: number;
  formulaDescription: string;
}

export interface AlertItem {
  id: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  active: boolean;
  relatedEntity?: string;
}

export type TimelineHour = 0 | 6 | 12 | 18 | 24;

export interface MissionStatusChecklist {
  environmentalData: 'Pending' | 'Running' | 'Completed';
  seaIceForecast: 'Pending' | 'Running' | 'Completed';
  icebergPrediction: 'Pending' | 'Running' | 'Completed';
  riskAssessment: 'Pending' | 'Running' | 'Completed';
  routeOptimization: 'Pending' | 'Running' | 'Completed';
  navigationMonitoring: 'Pending' | 'Running' | 'Completed';
}

export interface SimulationState {
  isPlaying: boolean;
  speed: 1 | 2 | 5;
  timelineHour: TimelineHour;
  hasIncursionTriggered: boolean;
  vesselProgressRatio: number; // 0.0 to 1.0 along active route
}
