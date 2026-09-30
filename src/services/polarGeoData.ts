import {
  Vessel,
  ResearchStation,
  Iceberg,
  RouteOption,
  RiskAssessmentData,
  AlertItem,
  SeaIceForecastPoint,
  TimelineHour,
  PriorityLevel,
  LayerMetadata,
} from '../types';

// Real Antarctic Stations (NCPOR & International)
export const ANTARCTIC_STATIONS: ResearchStation[] = [
  {
    id: 'STN-BHARATI',
    name: 'Bharati Station',
    country: 'India',
    operator: 'NCPOR / Ministry of Earth Sciences',
    lat: -69.4069,
    lng: 76.1953,
    elevationM: 35,
    type: 'Coastal Research Station',
    establishedYear: 2012,
    status: 'Operational',
  },
  {
    id: 'STN-MAITRI',
    name: 'Maitri Station',
    country: 'India',
    operator: 'NCPOR / Ministry of Earth Sciences',
    lat: -70.7644,
    lng: 11.7342,
    elevationM: 117,
    type: 'Inland Continental Station',
    establishedYear: 1989,
    status: 'Operational',
  },
  {
    id: 'STN-ZHONGSHAN',
    name: 'Zhongshan Station',
    country: 'China',
    operator: 'PRIC',
    lat: -69.3736,
    lng: 76.3789,
    elevationM: 15,
    type: 'Coastal Research Station',
    establishedYear: 1989,
    status: 'Operational',
  },
  {
    id: 'STN-PROGRESS',
    name: 'Progress-2 Station',
    country: 'Russia',
    operator: 'AARI',
    lat: -69.3750,
    lng: 76.3833,
    elevationM: 20,
    type: 'Coastal Research Station',
    establishedYear: 1988,
    status: 'Operational',
  },
  {
    id: 'STN-DAVIS',
    name: 'Davis Station',
    country: 'Australia',
    operator: 'AAD',
    lat: -68.5767,
    lng: 77.9675,
    elevationM: 12,
    type: 'Coastal Research Station',
    establishedYear: 1957,
    status: 'Operational',
  },
];

// Initial Vessel Specification
export const INITIAL_VESSEL: Vessel = {
  name: 'R/V Bharati Explorer',
  callsign: 'VU-POLAR',
  type: 'Research / Ice-Class',
  lat: -66.8500,
  lng: 72.8000,
  speedKnots: 12.5,
  headingDegrees: 42,
  distanceToDestNM: 284,
  fuelPercent: 82,
  navigationStatus: 'UNDERWAY',
  missionName: 'Antarctic Research Voyage 01',
  destinationName: 'Bharati Coastal Approach',
  destinationCoord: { lat: -69.1500, lng: 76.1000 },
  iceClearanceNM: 34.2,
  etaString: '22h 40m',
  nextWaypointName: 'WP-Alpha (Lead Entrance)',
  crossTrackErrorNM: 0.12,
};

// Deterministic Iceberg Dataset (Prydz Bay / Larsemann Corridor)
export const INITIAL_ICEBERGS: Iceberg[] = [
  {
    id: 'IB-042',
    name: 'Tabular Iceberg B-42',
    size: 'Giant Tabular',
    dimensionsMeters: '2800m × 1200m × 190m',
    lat: -67.4500,
    lng: 74.2000,
    velocityKnots: 0.42,
    directionCompass: 'ENE',
    directionDegrees: 68,
    confidencePercent: 78,
    distanceNM: 18.6,
    predictedClosestApproachNM: 11.2,
    riskLevel: 'HIGH',
    lastObservedUtc: '2026-09-30 07:45 UTC',
    trajectory: [
      { timeLabel: 'NOW', hoursOffset: 0, lat: -67.4500, lng: 74.2000, uncertaintyRadiusNM: 1.2 },
      { timeLabel: '+6H', hoursOffset: 6, lat: -67.5500, lng: 74.6500, uncertaintyRadiusNM: 2.5 },
      { timeLabel: '+12H', hoursOffset: 12, lat: -67.6800, lng: 75.1500, uncertaintyRadiusNM: 4.8 },
      { timeLabel: '+18H', hoursOffset: 18, lat: -67.8200, lng: 75.6500, uncertaintyRadiusNM: 7.0 },
      { timeLabel: '+24H', hoursOffset: 24, lat: -67.9800, lng: 76.1000, uncertaintyRadiusNM: 9.5 },
    ],
  },
  {
    id: 'IB-017',
    name: 'Pinnacle Berg P-17',
    size: 'Medium Tabular',
    dimensionsMeters: '950m × 450m × 110m',
    lat: -67.9000,
    lng: 75.8000,
    velocityKnots: 0.35,
    directionCompass: 'NE',
    directionDegrees: 45,
    confidencePercent: 88,
    distanceNM: 38.2,
    predictedClosestApproachNM: 24.5,
    riskLevel: 'MEDIUM',
    lastObservedUtc: '2026-09-30 07:30 UTC',
    trajectory: [
      { timeLabel: 'NOW', hoursOffset: 0, lat: -67.9000, lng: 75.8000, uncertaintyRadiusNM: 0.8 },
      { timeLabel: '+6H', hoursOffset: 6, lat: -67.8000, lng: 75.9500, uncertaintyRadiusNM: 1.9 },
      { timeLabel: '+12H', hoursOffset: 12, lat: -67.6800, lng: 76.1000, uncertaintyRadiusNM: 3.4 },
      { timeLabel: '+18H', hoursOffset: 18, lat: -67.5500, lng: 76.2500, uncertaintyRadiusNM: 5.1 },
      { timeLabel: '+24H', hoursOffset: 24, lat: -67.4200, lng: 76.4000, uncertaintyRadiusNM: 6.8 },
    ],
  },
  {
    id: 'IB-028',
    name: 'Calved Floe C-28',
    size: 'Bergy Bit',
    dimensionsMeters: '340m × 210m × 50m',
    lat: -68.3000,
    lng: 73.6000,
    velocityKnots: 0.25,
    directionCompass: 'NW',
    directionDegrees: 310,
    confidencePercent: 71,
    distanceNM: 54.1,
    predictedClosestApproachNM: 42.0,
    riskLevel: 'LOW',
    lastObservedUtc: '2026-09-30 06:50 UTC',
    trajectory: [
      { timeLabel: 'NOW', hoursOffset: 0, lat: -68.3000, lng: 73.6000, uncertaintyRadiusNM: 1.0 },
      { timeLabel: '+6H', hoursOffset: 6, lat: -68.220, lng: 73.4000, uncertaintyRadiusNM: 2.2 },
      { timeLabel: '+12H', hoursOffset: 12, lat: -68.140, lng: 73.2000, uncertaintyRadiusNM: 3.8 },
      { timeLabel: '+18H', hoursOffset: 18, lat: -68.060, lng: 73.0000, uncertaintyRadiusNM: 5.5 },
      { timeLabel: '+24H', hoursOffset: 24, lat: -67.980, lng: 72.8000, uncertaintyRadiusNM: 7.2 },
    ],
  },
  {
    id: 'IB-063',
    name: 'Growler Cluster G-63',
    size: 'Growler',
    dimensionsMeters: '180m × 90m × 25m',
    lat: -68.6000,
    lng: 74.9000,
    velocityKnots: 0.18,
    directionCompass: 'S',
    directionDegrees: 180,
    confidencePercent: 82,
    distanceNM: 47.0,
    predictedClosestApproachNM: 39.4,
    riskLevel: 'LOW',
    lastObservedUtc: '2026-09-30 07:15 UTC',
    trajectory: [
      { timeLabel: 'NOW', hoursOffset: 0, lat: -68.6000, lng: 74.9000, uncertaintyRadiusNM: 0.6 },
      { timeLabel: '+6H', hoursOffset: 6, lat: -68.6600, lng: 74.9000, uncertaintyRadiusNM: 1.5 },
      { timeLabel: '+12H', hoursOffset: 12, lat: -68.7200, lng: 74.9000, uncertaintyRadiusNM: 2.9 },
      { timeLabel: '+18H', hoursOffset: 18, lat: -68.7800, lng: 74.9000, uncertaintyRadiusNM: 4.4 },
      { timeLabel: '+24H', hoursOffset: 24, lat: -68.8400, lng: 74.9000, uncertaintyRadiusNM: 6.0 },
    ],
  },
];

// Realistic Navigable Marine Routes (GeoJSON Coordinates [lng, lat])
export const INITIAL_ROUTES: RouteOption[] = [
  {
    id: 'ROUTE_A',
    name: 'ROUTE A',
    type: 'Recommended',
    status: 'RECOMMENDED',
    distanceNM: 284,
    etaString: '22h 40m',
    etaHours: 22.67,
    fuelIndex: 0.82,
    safetyScore: 91,
    efficiencyScore: 82,
    riskScore: 15,
    overallRank: 1,
    iceExposurePercent: 18,
    icebergClosestApproachNM: 11.2,
    color: '#39B57A', // LOW RISK GREEN
    dashArray: null,
    coordinates: [
      [72.8000, -66.8500], // Vessel Start
      [73.3500, -67.1500],
      [73.9000, -67.5000], // Near IB-042 at T=0
      [74.5500, -67.9000],
      [75.2500, -68.4500],
      [75.8000, -68.8500],
      [76.1000, -69.1500], // Destination (Bharati Coastal Approach)
    ],
    waypoints: [
      { name: 'WP-0 Departure', lat: -66.8500, lng: 72.8000, iceConcentrationPct: 10, risk: 'Low' },
      { name: 'WP-1 Outer Shelf Lead', lat: -67.1500, lng: 73.3500, iceConcentrationPct: 18, risk: 'Low' },
      { name: 'WP-2 Central Lead Alpha', lat: -67.5000, lng: 73.9000, iceConcentrationPct: 25, risk: 'Moderate' },
      { name: 'WP-3 Prydz Channel Entrance', lat: -67.9000, lng: 74.5500, iceConcentrationPct: 32, risk: 'Moderate' },
      { name: 'WP-4 Larsemann Shelf Transition', lat: -68.4500, lng: 75.2500, iceConcentrationPct: 28, risk: 'Low' },
      { name: 'WP-5 Coastal Lead Bravo', lat: -68.8500, lng: 75.8000, iceConcentrationPct: 22, risk: 'Low' },
      { name: 'WP-6 Bharati Coastal Approach', lat: -69.1500, lng: 76.1000, iceConcentrationPct: 15, risk: 'Low' },
    ],
    explanation: {
      title: 'WHY THIS ROUTE?',
      points: [
        'Follows natural open-water lead identified in Sentinel-1 SAR imagery',
        'Maintains 11.2 NM buffer from active IB-042 drift cone at initial time step',
        'Direct rhumb line efficiency with minimal ice resistance (mean concentration 21%)',
        'Satisfies IMO Polar Code PC-5 hull stress criteria with 34.2 NM clear margin',
        'Optimal fuel consumption index (0.82) saving approximately 14% diesel',
      ],
      riskFactor: 'Optimal at initial hour; triggers automated reroute if IB-042 shifts south.',
      fuelBenefit: '+14% fuel conservation compared to direct pack ice forcing.',
    },
  },
  {
    id: 'ROUTE_B',
    name: 'ROUTE B',
    type: 'Alternative',
    status: 'ACCEPTABLE',
    distanceNM: 312,
    etaString: '1d 02h',
    etaHours: 26.0,
    fuelIndex: 0.76,
    safetyScore: 96,
    efficiencyScore: 71,
    riskScore: 12,
    overallRank: 2,
    iceExposurePercent: 9,
    icebergClosestApproachNM: 28.4,
    color: '#59C7F3', // ICE BLUE
    dashArray: [6, 4],
    coordinates: [
      [72.8000, -66.8500], // Vessel Start
      [73.8000, -66.9000],
      [74.9000, -67.1000], // Sweeping well north of IB-042
      [75.9000, -67.5500],
      [76.6000, -68.2000],
      [76.5000, -68.8000],
      [76.1000, -69.1500], // Destination
    ],
    waypoints: [
      { name: 'WP-0 Departure', lat: -66.8500, lng: 72.8000, iceConcentrationPct: 10, risk: 'Low' },
      { name: 'WP-1 Northern Lead Arc', lat: -66.9000, lng: 73.8000, iceConcentrationPct: 12, risk: 'Low' },
      { name: 'WP-2 Deep Water Evasion Node', lat: -67.1000, lng: 74.9000, iceConcentrationPct: 10, risk: 'Low' },
      { name: 'WP-3 Eastern Prydz Bypass', lat: -67.5500, lng: 75.9000, iceConcentrationPct: 14, risk: 'Low' },
      { name: 'WP-4 Clear Water Descent', lat: -68.2000, lng: 76.6000, iceConcentrationPct: 18, risk: 'Low' },
      { name: 'WP-5 Southern Corridor Join', lat: -68.8000, lng: 76.5000, iceConcentrationPct: 16, risk: 'Low' },
      { name: 'WP-6 Bharati Coastal Approach', lat: -69.1500, lng: 76.1000, iceConcentrationPct: 15, risk: 'Low' },
    ],
    explanation: {
      title: 'ALTERNATIVE B CHARACTERISTICS',
      points: [
        'Maximum safety margin: sweeps east of all known iceberg drift cones',
        'Lowest sea-ice exposure (only 9% total voyage in low-density brash ice)',
        'Zero intersection with IB-042 even at +24H predicted drift expansion',
        'Conserves engine power by avoiding icebreaking maneuvers',
        'Added transit time: +3h 20m compared to Route A',
      ],
      riskFactor: 'Minimal hazard exposure. Primary backup if IB-042 incurs into Route A.',
      fuelBenefit: 'Lowest fuel burn per hour, slightly higher gross consumption.',
    },
  },
  {
    id: 'ROUTE_C',
    name: 'ROUTE C',
    type: 'High Risk',
    status: 'HIGH RISK',
    distanceNM: 253,
    etaString: '21h 15m',
    etaHours: 21.25,
    fuelIndex: 0.93,
    safetyScore: 62,
    efficiencyScore: 94,
    riskScore: 68,
    overallRank: 3,
    iceExposurePercent: 54,
    icebergClosestApproachNM: 4.8,
    color: '#E56A54', // HIGH RISK ORANGE
    dashArray: [3, 3],
    coordinates: [
      [72.8000, -66.8500], // Start
      [73.1500, -67.4000],
      [73.6500, -68.1000], // Dense pack ice area
      [74.5000, -68.7500],
      [76.1000, -69.1500], // Destination
    ],
    waypoints: [
      { name: 'WP-0 Departure', lat: -66.8500, lng: 72.8000, iceConcentrationPct: 10, risk: 'Low' },
      { name: 'WP-1 Direct West Cut', lat: -67.4000, lng: 73.1500, iceConcentrationPct: 58, risk: 'Moderate' },
      { name: 'WP-2 Heavy Pack Sector', lat: -68.1000, lng: 73.6500, iceConcentrationPct: 78, risk: 'High' },
      { name: 'WP-3 Coastal Shelf Crossing', lat: -68.7500, lng: 74.5000, iceConcentrationPct: 65, risk: 'Moderate' },
      { name: 'WP-4 Bharati Coastal Approach', lat: -69.1500, lng: 76.1000, iceConcentrationPct: 20, risk: 'Low' },
    ],
    explanation: {
      title: 'ROUTE C HAZARD PROFILE',
      points: [
        'Geographically shortest distance (253 NM) along direct south-east azimuth',
        'Traverses dense multi-year pack ice (concentration up to 78%)',
        'Passes within 4.8 NM of dynamic iceberg shear corridor',
        'Risk of vessel besetting or severe hull friction requiring ice ramming',
        'Fuel index reaches 0.93 due to continuous heavy propulsion demand',
      ],
      riskFactor: 'HIGH RISK — Not advised under standard research vessel operating limits.',
      fuelBenefit: 'Negative. Highest engine wear and fuel burn rate.',
    },
  },
];

// Sea-Ice Concentration GeoJSON Polygons (Real Geographic Coordinates around Prydz Bay / Larsemann Coast)
export const SEA_ICE_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    // 0-20% Concentration (Outer Southern Ocean Leads)
    {
      type: 'Feature',
      properties: {
        concentration: 15,
        bracket: '0–20%',
        label: 'Low Concentration Lead',
        color: '#0B2A42',
        opacity: 0.35,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [71.5, -66.2],
            [77.5, -66.2],
            [77.5, -67.2],
            [74.0, -67.0],
            [71.5, -66.8],
            [71.5, -66.2],
          ],
        ],
      },
    },
    // 20-50% Concentration (Moderate Pack Ice Boundary)
    {
      type: 'Feature',
      properties: {
        concentration: 38,
        bracket: '20–50%',
        label: 'Moderate Pack Ice',
        color: '#25B7D3',
        opacity: 0.40,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.0, -67.0],
            [76.8, -67.1],
            [77.2, -68.0],
            [75.5, -68.4],
            [73.2, -67.9],
            [72.0, -67.0],
          ],
        ],
      },
    },
    // 50-80% Concentration (High Density Pack Ice)
    {
      type: 'Feature',
      properties: {
        concentration: 65,
        bracket: '50–80%',
        label: 'High Concentration Pack',
        color: '#F0B84B',
        opacity: 0.50,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.5, -67.6],
            [75.2, -67.9],
            [75.8, -68.8],
            [74.0, -68.9],
            [72.8, -68.3],
            [72.5, -67.6],
          ],
        ],
      },
    },
    // 80-100% Concentration (Critical Fast Ice along Continental Margin)
    {
      type: 'Feature',
      properties: {
        concentration: 90,
        bracket: '80–100%',
        label: 'Very High / Fast Ice Shelf',
        color: '#C93B4B',
        opacity: 0.55,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.5, -68.7],
            [77.0, -68.6],
            [77.2, -69.5],
            [73.8, -69.5],
            [73.5, -68.7],
          ],
        ],
      },
    },
  ],
};

// Dynamic Risk Threat Polygons
export const RISK_ZONES_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'RZ-1',
        title: 'IB-042 Dynamic Threat Corridor',
        seaIceConcentration: 45,
        icebergExposure: 'HIGH',
        weatherExposure: 'LOW',
        overallRisk: 'HIGH',
        color: '#E56A54',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.8, -67.3],
            [75.6, -67.5],
            [76.3, -68.2],
            [74.8, -68.0],
            [73.8, -67.3],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'RZ-2',
        title: 'Western Shelf Pinch Zone',
        seaIceConcentration: 75,
        icebergExposure: 'MEDIUM',
        weatherExposure: 'LOW',
        overallRisk: 'CRITICAL',
        color: '#C93B4B',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.6, -67.7],
            [74.2, -67.9],
            [74.4, -68.5],
            [72.9, -68.4],
            [72.6, -67.7],
          ],
        ],
      },
    },
  ],
};

// Ocean Current & Wind Vector Samples
export const OCEAN_CURRENTS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { speedKnots: 0.8, directionDeg: 65 }, geometry: { type: 'Point', coordinates: [73.2, -66.9] } },
    { type: 'Feature', properties: { speedKnots: 1.1, directionDeg: 72 }, geometry: { type: 'Point', coordinates: [74.5, -67.2] } },
    { type: 'Feature', properties: { speedKnots: 0.9, directionDeg: 55 }, geometry: { type: 'Point', coordinates: [75.8, -67.6] } },
    { type: 'Feature', properties: { speedKnots: 0.7, directionDeg: 40 }, geometry: { type: 'Point', coordinates: [76.5, -68.1] } },
    { type: 'Feature', properties: { speedKnots: 1.2, directionDeg: 68 }, geometry: { type: 'Point', coordinates: [74.0, -68.0] } },
  ],
};

export const WIND_VECTORS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { speedKnots: 22, directionDeg: 215 }, geometry: { type: 'Point', coordinates: [73.0, -66.5] } },
    { type: 'Feature', properties: { speedKnots: 24, directionDeg: 220 }, geometry: { type: 'Point', coordinates: [74.8, -66.8] } },
    { type: 'Feature', properties: { speedKnots: 26, directionDeg: 210 }, geometry: { type: 'Point', coordinates: [76.2, -67.2] } },
    { type: 'Feature', properties: { speedKnots: 20, directionDeg: 225 }, geometry: { type: 'Point', coordinates: [73.8, -67.6] } },
  ],
};

// Data Layer Freshness Metadata Catalog
export const LAYER_METADATA_CATALOG: Record<string, LayerMetadata> = {
  seaIceConcentration: {
    name: 'Sea-Ice Concentration',
    source: 'Copernicus / Sentinel-1 SAR & AMSR2',
    sensor: 'C-Band Synthetic Aperture Radar',
    timestamp: '2026-09-30 08:00 UTC',
    resolution: '1.2 km grid',
    mode: 'COPERNICUS DEMO',
  },
  icebergObservations: {
    name: 'Iceberg Observations',
    source: 'NIC / Sentinel-1 Deep Learning Detector',
    sensor: 'SAR Automated Target Recognition',
    timestamp: '2026-09-30 07:45 UTC',
    resolution: 'Sub-pixel CFAR',
    mode: 'SIMULATED DEMO',
  },
  predictedIcebergPaths: {
    name: 'Predicted Iceberg Paths',
    source: 'POLAR-NAV Hydrodynamic Drift Physics Model',
    sensor: 'Coupled Ekman / Wind Drag Equations',
    timestamp: '2026-09-30 08:15 UTC',
    resolution: '6-Hour Time Step',
    mode: 'HYCOM FORECAST',
  },
  oceanCurrents: {
    name: 'Ocean Currents',
    source: 'Mercator Ocean Global Reanalysis',
    sensor: 'CMEMS GLORYS12V1',
    timestamp: '2026-09-30 06:00 UTC',
    resolution: '1/12° (~8 km)',
    mode: 'COPERNICUS DEMO',
  },
  windVectors: {
    name: 'Wind Vectors',
    source: 'ECMWF Integrated Forecasting System (IFS)',
    sensor: 'ERA5 Synoptic Assimilation',
    timestamp: '2026-09-30 08:10 UTC',
    resolution: '0.25° grid',
    mode: 'SIMULATED DEMO',
  },
  riskZones: {
    name: 'Dynamic Risk Threat Zones',
    source: 'POLAR-NAV Multi-Criteria Spatial Risk Model',
    sensor: 'IMO Polar Code Hazard Index',
    timestamp: '2026-09-30 08:20 UTC',
    resolution: 'Vector Polygon',
    mode: 'SIMULATED DEMO',
  },
  researchStations: {
    name: 'Research Stations',
    source: 'COMNAP Antarctic Station Database',
    sensor: 'Geodetic Survey (WGS-84)',
    timestamp: '2026-09-30 Verified',
    resolution: 'Point Geolocation',
    mode: 'SIMULATED DEMO',
  },
};

// Initial Forecast Series
export const INITIAL_FORECAST_SERIES: SeaIceForecastPoint[] = [
  { time: 'NOW', hours: 0, concentration: 42, packIceThicknessM: 1.1, openWaterLeadWidthNM: 8.5 },
  { time: '+6H', hours: 6, concentration: 51, packIceThicknessM: 1.3, openWaterLeadWidthNM: 6.2 },
  { time: '+12H', hours: 12, concentration: 58, packIceThicknessM: 1.5, openWaterLeadWidthNM: 4.1 },
  { time: '+18H', hours: 18, concentration: 61, packIceThicknessM: 1.6, openWaterLeadWidthNM: 3.4 },
  { time: '+24H', hours: 24, concentration: 64, packIceThicknessM: 1.8, openWaterLeadWidthNM: 2.8 },
];

// Smooth Route Interpolation Helper (Given route coordinates and progress 0.0 - 1.0)
export function interpolateRoutePosition(
  coordinates: [number, number][],
  progress: number
): { lat: number; lng: number; heading: number } {
  if (!coordinates || coordinates.length < 2) {
    return { lat: -66.85, lng: 72.8, heading: 42 };
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const totalSegments = coordinates.length - 1;
  const targetFloatIndex = clampedProgress * totalSegments;
  const segIndex = Math.min(totalSegments - 1, Math.floor(targetFloatIndex));
  const segFraction = targetFloatIndex - segIndex;

  const p1 = coordinates[segIndex];
  const p2 = coordinates[segIndex + 1];

  const lng = p1[0] + (p2[0] - p1[0]) * segFraction;
  const lat = p1[1] + (p2[1] - p1[1]) * segFraction;

  // Compute heading degrees from p1 to p2
  const dLng = p2[0] - p1[0];
  const dLat = p2[1] - p1[1];
  let heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;
  if (heading < 0) heading += 360;

  return { lat, lng, heading: Math.round(heading) };
}

// Deterministic Dynamic State Evaluation
export function calculateGeospatialSimulationState(
  timelineHour: TimelineHour,
  safetyPriority: PriorityLevel,
  fuelPriority: PriorityLevel,
  isEventTriggered: boolean,
  vesselProgressRatio: number
) {
  // Weights based on user priorities
  let safetyWeight = safetyPriority === 'High' ? 0.7 : safetyPriority === 'Low' ? 0.3 : 0.5;
  let fuelWeight = fuelPriority === 'High' ? 0.7 : fuelPriority === 'Low' ? 0.3 : 0.5;
  const total = safetyWeight + fuelWeight;
  safetyWeight /= total;
  fuelWeight /= total;

  // Interpolate iceberg positions along trajectory
  const icebergs = INITIAL_ICEBERGS.map((berg) => {
    const pt = berg.trajectory.find((t) => t.hoursOffset === timelineHour) || berg.trajectory[0];
    let riskLevel = berg.riskLevel;

    // Critical incursion condition
    if (berg.id === 'IB-042') {
      if (timelineHour >= 12 || isEventTriggered) {
        riskLevel = 'CRITICAL';
      } else if (timelineHour >= 6) {
        riskLevel = 'HIGH';
      }
    }

    return {
      ...berg,
      lat: pt.lat,
      lng: pt.lng,
      distanceNM: +(18.6 - (timelineHour / 24) * 8.2).toFixed(1),
      predictedClosestApproachNM:
        berg.id === 'IB-042' && (timelineHour >= 12 || isEventTriggered) ? 3.4 : 11.2,
      riskLevel,
    };
  });

  // Sea-ice concentration at current timeline hour
  const seaIceExposureHour =
    timelineHour === 0 ? 42 : timelineHour === 6 ? 51 : timelineHour === 12 ? 58 : timelineHour === 18 ? 61 : 64;

  // Route A risk increases when IB-042 drifts into its path at +12H
  const routeARisk =
    timelineHour >= 12 || isEventTriggered ? (timelineHour === 12 ? 65 : 79) : timelineHour === 6 ? 38 : 15;
  const routeASafety = Math.max(25, 95 - routeARisk);

  // Route B stays consistently safe
  const routeBRisk = Math.round(12 + (timelineHour / 24) * 6);
  const routeBSafety = Math.round(96 - (timelineHour / 24) * 4);

  // Route C remains high-risk
  const routeCRisk = Math.min(95, Math.round(68 + (timelineHour / 24) * 12));
  const routeCSafety = Math.max(30, Math.round(62 - (timelineHour / 24) * 8));

  // Determine Recommendation: Route B takes over when Route A is compromised
  const shouldRecommendRouteB =
    timelineHour >= 12 || isEventTriggered || (safetyPriority === 'High' && timelineHour >= 6);

  const updatedRoutes: RouteOption[] = INITIAL_ROUTES.map((route) => {
    if (route.id === 'ROUTE_A') {
      const isRec = !shouldRecommendRouteB;
      return {
        ...route,
        status: isRec ? 'RECOMMENDED' : routeARisk > 60 ? 'HIGH RISK' : 'ACCEPTABLE',
        type: isRec ? 'Recommended' : routeARisk > 60 ? 'High Risk' : 'Alternative',
        riskScore: routeARisk,
        safetyScore: routeASafety,
        color: isRec ? '#39B57A' : routeARisk > 60 ? '#E56A54' : '#F0B84B',
        icebergClosestApproachNM: (timelineHour >= 12 || isEventTriggered) ? 3.4 : 11.2,
      };
    }
    if (route.id === 'ROUTE_B') {
      const isRec = shouldRecommendRouteB;
      return {
        ...route,
        status: isRec ? 'RECOMMENDED' : 'ACCEPTABLE',
        type: isRec ? 'Recommended' : 'Alternative',
        riskScore: routeBRisk,
        safetyScore: routeBSafety,
        color: isRec ? '#39B57A' : '#59C7F3',
      };
    }
    return {
      ...route,
      riskScore: routeCRisk,
      safetyScore: routeCSafety,
    };
  });

  const activeRecId: 'ROUTE_A' | 'ROUTE_B' = shouldRecommendRouteB ? 'ROUTE_B' : 'ROUTE_A';
  const activeRoute = updatedRoutes.find((r) => r.id === activeRecId) || updatedRoutes[0];

  // Interpolate vessel coordinates along the active route
  const currentPos = interpolateRoutePosition(activeRoute.coordinates, vesselProgressRatio);
  const distanceRemainingNM = +(activeRoute.distanceNM * (1 - vesselProgressRatio)).toFixed(1);

  const vessel: Vessel = {
    ...INITIAL_VESSEL,
    lat: currentPos.lat,
    lng: currentPos.lng,
    headingDegrees: currentPos.heading,
    distanceToDestNM: Math.max(0, distanceRemainingNM),
    fuelPercent: Math.max(30, Math.round(82 - vesselProgressRatio * 18)),
    navigationStatus: shouldRecommendRouteB ? 'DIVERTING' : 'UNDERWAY',
    iceClearanceNM: activeRecId === 'ROUTE_B' ? 28.4 : (timelineHour >= 12 ? 3.4 : 34.2),
    etaString: `${Math.floor((activeRoute.etaHours * (1 - vesselProgressRatio)))}h ${Math.round(((activeRoute.etaHours * (1 - vesselProgressRatio)) % 1) * 60)}m`,
  };

  // Calculate Overall Risk Assessment
  const seaIceRiskScore = seaIceExposureHour > 60 ? 68 : seaIceExposureHour > 50 ? 45 : 18;
  const icebergRiskScore = (timelineHour >= 12 || isEventTriggered) ? 82 : timelineHour >= 6 ? 42 : 12;
  const weatherRiskScore = 10 + Math.round((timelineHour / 24) * 8);
  const routeExposureRisk = activeRoute.riskScore;

  // Formula as required:
  // overallRisk = 0.40 * seaIce + 0.35 * iceberg + 0.15 * weather + 0.10 * routeExposure
  const overallScore = Math.round(
    0.40 * seaIceRiskScore +
    0.35 * icebergRiskScore +
    0.15 * weatherRiskScore +
    0.10 * routeExposureRisk
  );

  const riskStatus =
    overallScore > 65 ? 'HIGH RISK' : overallScore > 35 ? 'MODERATE RISK' : 'LOW RISK';

  const riskAssessment: RiskAssessmentData = {
    status: overallScore < 20 ? 'MINIMAL RISK' : (riskStatus as any),
    overallScore,
    seaIceRisk: seaIceRiskScore,
    icebergRisk: icebergRiskScore,
    weatherRisk: weatherRiskScore,
    routeRisk: routeExposureRisk,
    confidencePercent: 84 - Math.round((timelineHour / 24) * 6),
    formulaDescription:
      'Index calculated from weighted fusion: 0.40 × Sea-Ice + 0.35 × Iceberg Drift + 0.15 × Weather + 0.10 × Route Exposure.',
  };

  // Dynamic alerts
  const alerts: AlertItem[] = [];

  if (timelineHour >= 12 || isEventTriggered) {
    alerts.push({
      id: 'ALT-INCURSION',
      level: 'CRITICAL',
      title: 'ICEBERG DRIFT HAZARD',
      message: 'IB-042 projected to enter Route A corridor. Closest Point of Approach (CPA) reduced to 3.4 NM within 12 hours.',
      timestamp: '08:48 UTC',
      active: true,
      relatedEntity: 'IB-042',
    });
    alerts.push({
      id: 'ALT-REROUTE',
      level: 'INFO',
      title: 'ROUTE RECOMMENDATION UPDATE',
      message: 'Alternative Route B now provides lower predicted risk (12% vs 79% on Route A). Evasion heading 062°.',
      timestamp: '08:49 UTC',
      active: true,
      relatedEntity: 'ROUTE_B',
    });
  } else {
    alerts.push({
      id: 'ALT-01',
      level: 'WARNING',
      title: 'ICEBERG DRIFT MONITORING',
      message: 'IB-042 (2.8 km tabular) monitored on 068° track at 0.42 kn. CPA on Route A: 11.2 NM.',
      timestamp: '08:32 UTC',
      active: true,
      relatedEntity: 'IB-042',
    });
  }

  alerts.push({
    id: 'ALT-02',
    level: 'WARNING',
    title: 'SEA-ICE FORECAST EXPANSION',
    message: `Forecast concentration increasing along eastern margin to ${seaIceExposureHour}% at +${timelineHour}H.`,
    timestamp: '08:15 UTC',
    active: true,
    relatedEntity: 'SEA_ICE',
  });

  return {
    vessel,
    icebergs,
    routes: updatedRoutes,
    riskAssessment,
    alerts,
    recommendedRouteId: activeRecId,
    seaIceCurrentPct: seaIceExposureHour,
  };
}
