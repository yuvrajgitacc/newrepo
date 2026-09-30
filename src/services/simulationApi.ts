import {
  Vessel,
  Iceberg,
  RouteOption,
  RiskAssessmentData,
  AlertItem,
  SeaIceForecastPoint,
  TimelineHour,
  PriorityLevel,
} from '../types';
import {
  INITIAL_VESSEL,
  INITIAL_ICEBERGS,
  INITIAL_ROUTES,
  INITIAL_FORECAST_SERIES,
  calculateGeospatialSimulationState,
} from './polarGeoData';

export interface RouteGenerationParams {
  vesselLat: number;
  vesselLng: number;
  destination: string;
  vesselType: string;
  cruisingSpeed: number;
  fuelPriority: PriorityLevel;
  safetyPriority: PriorityLevel;
  timelineHour: TimelineHour;
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  backendStack: string;
  sampleResponse: unknown;
}

export const API_CATALOG: ApiEndpointSpec[] = [
  {
    method: 'GET',
    path: '/api/mission',
    description: 'Fetch current research vessel metadata, destination, fuel reserves, and navigation status.',
    backendStack: 'FastAPI + PostGIS (Spatial Vessel Geometry)',
    sampleResponse: INITIAL_VESSEL,
  },
  {
    method: 'GET',
    path: '/api/environment',
    description: 'Query synthesized ERA5/AMSR2 polar weather vectors, sea surface temperature, and ocean current fields.',
    backendStack: 'FastAPI + Xarray / NetCDF4 + Copernicus Marine Service (CMEMS)',
    sampleResponse: {
      seaSurfaceTempC: -1.8,
      windVector: { speedKnots: 24, directionDeg: 215, gustKnots: 36 },
      oceanCurrent: { velocityKnots: 1.1, directionDeg: 45, coriolisParameter: -1.35e-4 },
      bathymetryDepthMeters: 1420,
    },
  },
  {
    method: 'GET',
    path: '/api/sea-ice/forecast',
    description: 'Retrieve ConvLSTM / U-Net sea-ice concentration spatiotemporal tensor forecast (0h to 24h).',
    backendStack: 'PyTorch (ConvLSTM Sea-Ice Model) + Sentinel-1 SAR + AMSR2 Data',
    sampleResponse: INITIAL_FORECAST_SERIES,
  },
  {
    method: 'GET',
    path: '/api/icebergs',
    description: 'Detect, classify, and track radar-detected icebergs within the 150 NM operational radius.',
    backendStack: 'YOLOv11-OBB (SAR detection) + Kalman Filter Tracker',
    sampleResponse: INITIAL_ICEBERGS,
  },
  {
    method: 'GET',
    path: '/api/icebergs/:id/trajectory',
    description: 'Compute hydrodynamic iceberg drift physics incorporating wind drag, Ekman currents, and Coriolis forces.',
    backendStack: 'PyTorch Dynamic Drift Equation Solver + Monte Carlo Cone of Uncertainty',
    sampleResponse: INITIAL_ICEBERGS[0],
  },
  {
    method: 'GET',
    path: '/api/risk-map',
    description: 'Generate spatiotemporal navigation risk tensor combining sea-ice thickness, iceberg collision probability, and storm swells.',
    backendStack: 'NumPy Vectorized Polar Risk Engine (IMO Polar Code Standard)',
    sampleResponse: {
      riskGridResolutionNM: 2.5,
      timestamp: '2025-12-12T14:35:00Z',
      meanRiskScore: 62,
      maxRiskZone: { lat: -69.8, lng: 76.5, score: 88, hazard: 'Dense Pack Ice + Converging Berg' },
    },
  },
  {
    method: 'POST',
    path: '/api/routes/generate',
    description: 'Execute Multi-Objective A* / Genetic Pathfinding to compute optimal Pareto-frontier routes.',
    backendStack: 'C++ Accelerated Multi-Objective Polar A* (Minimizing Fuel, Hull Stress, Time)',
    sampleResponse: INITIAL_ROUTES,
  },
  {
    method: 'GET',
    path: '/api/alerts',
    description: 'Real-time proactive navigation advisories and hazard proximity triggers.',
    backendStack: 'FastAPI WebSocket / Redis PubSub Event Bus',
    sampleResponse: [
      {
        id: 'ALT-01',
        level: 'WARNING',
        title: 'ICEBERG DRIFT MONITORING',
        message: 'IB-042 (2.8 km tabular) monitored on 068° track at 0.42 kn. CPA on Route A: 11.2 NM.',
        timestamp: '08:32 UTC',
        active: true,
      },
    ],
  },
];

// Simulated Client Service (matching REST API signatures for future zero-code drop-in replacement)
export const simulationApi = {
  async getMission(): Promise<Vessel> {
    await new Promise((r) => setTimeout(r, 60));
    return INITIAL_VESSEL;
  },

  async getSeaIceForecast(): Promise<SeaIceForecastPoint[]> {
    await new Promise((r) => setTimeout(r, 80));
    return INITIAL_FORECAST_SERIES;
  },

  async getIcebergs(timelineHour: TimelineHour = 0): Promise<Iceberg[]> {
    await new Promise((r) => setTimeout(r, 100));
    const dynamic = calculateGeospatialSimulationState(timelineHour, 'Medium', 'Medium', false, 0);
    return dynamic.icebergs;
  },

  async getIcebergTrajectory(id: string): Promise<Iceberg | undefined> {
    await new Promise((r) => setTimeout(r, 70));
    return INITIAL_ICEBERGS.find((b) => b.id === id);
  },

  async getRiskAssessment(timelineHour: TimelineHour, safetyPriority: PriorityLevel, fuelPriority: PriorityLevel): Promise<RiskAssessmentData> {
    await new Promise((r) => setTimeout(r, 90));
    const dynamic = calculateGeospatialSimulationState(timelineHour, safetyPriority, fuelPriority, false, 0);
    return dynamic.riskAssessment;
  },

  async getRoutes(timelineHour: TimelineHour, safetyPriority: PriorityLevel, fuelPriority: PriorityLevel): Promise<RouteOption[]> {
    await new Promise((r) => setTimeout(r, 120));
    const dynamic = calculateGeospatialSimulationState(timelineHour, safetyPriority, fuelPriority, false, 0);
    return dynamic.routes;
  },

  async getAlerts(timelineHour: TimelineHour): Promise<AlertItem[]> {
    await new Promise((r) => setTimeout(r, 50));
    const dynamic = calculateGeospatialSimulationState(timelineHour, 'Medium', 'Medium', false, 0);
    return dynamic.alerts;
  },

  async generateRoute(params: RouteGenerationParams): Promise<{ routes: RouteOption[]; recommendedId: string }> {
    // Simulated calculation delay for realistic ML optimization
    await new Promise((r) => setTimeout(r, 650));
    const dynamic = calculateGeospatialSimulationState(params.timelineHour, params.safetyPriority, params.fuelPriority, false, 0);
    return {
      routes: dynamic.routes,
      recommendedId: dynamic.recommendedRouteId,
    };
  },
};
