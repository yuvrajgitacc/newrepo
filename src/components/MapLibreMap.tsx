import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Vessel,
  Iceberg,
  RouteOption,
  ResearchStation,
  EnvironmentalLayers,
  BasemapStyle,
  TimelineHour,
} from '../types';
import {
  SEA_ICE_GEOJSON,
  RISK_ZONES_GEOJSON,
  OCEAN_CURRENTS_GEOJSON,
  WIND_VECTORS_GEOJSON,
  ANTARCTIC_STATIONS,
} from '../services/polarGeoData';
import { Compass, Navigation, Layers, ZoomIn, ZoomOut, Maximize2, Target, Eye } from 'lucide-react';

interface MapLibreMapProps {
  vessel: Vessel;
  icebergs: Iceberg[];
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (id: 'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C') => void;
  selectedIcebergId: string;
  onSelectIceberg: (id: string) => void;
  layers: EnvironmentalLayers;
  timelineHour: TimelineHour;
  basemapStyle: BasemapStyle;
  onChangeBasemapStyle: (style: BasemapStyle) => void;
  onOpenTrajectoryModal: (iceberg: Iceberg) => void;
  onOpenWhyThisRoute: () => void;
}

// Generate geodesic circle coordinates (for 25, 50, 100 NM predictive awareness rings)
function createGeodesicCircle(centerLng: number, centerLat: number, radiusNM: number, points = 48): [number, number][] {
  const coords: [number, number][] = [];
  const radiusKm = radiusNM * 1.852;
  const earthRadiusKm = 6371;
  const dByR = radiusKm / earthRadiusKm;
  const latRad = (centerLat * Math.PI) / 180;
  const lngRad = (centerLng * Math.PI) / 180;

  for (let i = 0; i <= points; i++) {
    const bearing = (i * 2 * Math.PI) / points;
    const pLat = Math.asin(
      Math.sin(latRad) * Math.cos(dByR) + Math.cos(latRad) * Math.sin(dByR) * Math.cos(bearing)
    );
    const pLng =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(dByR) * Math.cos(latRad),
        Math.cos(dByR) - Math.sin(latRad) * Math.sin(pLat)
      );
    coords.push([(pLng * 180) / Math.PI, (pLat * 180) / Math.PI]);
  }
  return coords;
}

export const MapLibreMap: React.FC<MapLibreMapProps> = ({
  vessel,
  icebergs,
  routes,
  selectedRouteId,
  onSelectRoute,
  selectedIcebergId,
  onSelectIceberg,
  layers,
  timelineHour,
  basemapStyle,
  onChangeBasemapStyle,
  onOpenTrajectoryModal,
  onOpenWhyThisRoute,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const vesselMarkerRef = useRef<maplibregl.Marker | null>(null);
  const icebergMarkersRef = useRef<maplibregl.Marker[]>([]);
  const stationMarkersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activePopupData, setActivePopupData] = useState<any | null>(null);

  // Basemap style definition
  const getStyleForBasemap = (style: BasemapStyle) => {
    let tileUrl = 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; OpenStreetMap contributors, &copy; CARTO';

    if (style === 'ocean') {
      tileUrl = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri, GEBCO, NOAA';
    } else if (style === 'satellite') {
      tileUrl = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri, Maxar, Earthstar Geographics';
    }

    return {
      version: 8 as const,
      sources: {
        'basemap-tiles': {
          type: 'raster' as const,
          tiles: [tileUrl],
          tileSize: 256,
          attribution,
        },
      },
      layers: [
        {
          id: 'basemap-layer',
          type: 'raster' as const,
          source: 'basemap-tiles',
          minzoom: 0,
          maxzoom: 18,
          paint: {
            'raster-brightness-max': style === 'dark' ? 0.75 : 0.9,
            'raster-contrast': 0.1,
          },
        },
      ],
    };
  };

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStyleForBasemap(basemapStyle) as any,
      center: [74.5, -67.8], // Central Prydz Bay / Larsemann corridor
      zoom: 5.4,
      minZoom: 3,
      maxZoom: 12,
      attributionControl: false,
    });

    // Add navigation controls (zoom, compass)
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: false }),
      'top-left'
    );

    map.on('load', () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update basemap style if changed
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    mapRef.current.setStyle(getStyleForBasemap(basemapStyle) as any);
  }, [basemapStyle]);

  // Add & update GeoJSON vector/raster layers on the real map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Helper to safely add or update geojson source
    const updateSource = (id: string, data: any) => {
      const src = map.getSource(id) as maplibregl.GeoJSONSource;
      if (src) {
        src.setData(data);
      } else {
        map.addSource(id, { type: 'geojson', data });
      }
    };

    // 1. SEA-ICE LAYER (GeoJSON Polygons with concentration styling)
    updateSource('sea-ice-source', SEA_ICE_GEOJSON);
    if (!map.getLayer('sea-ice-layer')) {
      map.addLayer({
        id: 'sea-ice-layer',
        type: 'fill',
        source: 'sea-ice-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['get', 'opacity'],
        },
      });
      map.addLayer({
        id: 'sea-ice-outline',
        type: 'line',
        source: 'sea-ice-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.2,
          'line-opacity': 0.7,
        },
      });
    }

    // 2. RISK ZONES LAYER
    updateSource('risk-zones-source', RISK_ZONES_GEOJSON);
    if (!map.getLayer('risk-zones-layer')) {
      map.addLayer({
        id: 'risk-zones-layer',
        type: 'fill',
        source: 'risk-zones-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.25,
        },
      });
      map.addLayer({
        id: 'risk-zones-line',
        type: 'line',
        source: 'risk-zones-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.8,
          'line-dasharray': [3, 2],
        },
      });
    }

    // 3. ROUTES LAYER (GeoJSON LineStrings)
    const routesGeoJson = {
      type: 'FeatureCollection',
      features: routes.map((r) => ({
        type: 'Feature',
        properties: {
          id: r.id,
          name: r.name,
          color: r.color,
          status: r.status,
          isSelected: r.id === selectedRouteId,
          distanceNM: r.distanceNM,
          eta: r.etaString,
          fuel: r.fuelIndex,
        },
        geometry: {
          type: 'LineString',
          coordinates: r.coordinates,
        },
      })),
    };

    updateSource('routes-source', routesGeoJson);

    if (!map.getLayer('routes-line')) {
      // Glow/Halo under selected route
      map.addLayer({
        id: 'routes-halo',
        type: 'line',
        source: 'routes-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['case', ['get', 'isSelected'], 8, 0],
          'line-opacity': 0.25,
        },
      });

      // Primary Route Lines
      map.addLayer({
        id: 'routes-line',
        type: 'line',
        source: 'routes-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['case', ['get', 'isSelected'], 3.8, 2.0],
          'line-opacity': ['case', ['get', 'isSelected'], 1.0, 0.65],
        },
      });
    }

    // 4. PREDICTED ICEBERG TRAJECTORY & UNCERTAINTY CONES
    const selectedBerg = icebergs.find((b) => b.id === selectedIcebergId) || icebergs[0];
    const trajCoords = selectedBerg.trajectory.map((t) => [t.lng, t.lat]);

    const trajGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { id: selectedBerg.id, label: 'Predicted Drift Path' },
          geometry: { type: 'LineString', coordinates: trajCoords },
        },
      ],
    };
    updateSource('trajectory-source', trajGeoJson);

    if (!map.getLayer('trajectory-line')) {
      map.addLayer({
        id: 'trajectory-line',
        type: 'line',
        source: 'trajectory-source',
        paint: {
          'line-color': '#59C7F3',
          'line-width': 2.2,
          'line-dasharray': [4, 3],
        },
      });
    }

    // 5. PREDICTIVE AWARENESS RINGS (Geodesic 25, 50, 100 NM circles around vessel)
    const ring25 = createGeodesicCircle(vessel.lng, vessel.lat, 25);
    const ring50 = createGeodesicCircle(vessel.lng, vessel.lat, 50);
    const ring100 = createGeodesicCircle(vessel.lng, vessel.lat, 100);

    const awarenessGeoJson = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', properties: { radius: '25 NM' }, geometry: { type: 'LineString', coordinates: ring25 } },
        { type: 'Feature', properties: { radius: '50 NM' }, geometry: { type: 'LineString', coordinates: ring50 } },
        { type: 'Feature', properties: { radius: '100 NM' }, geometry: { type: 'LineString', coordinates: ring100 } },
      ],
    };
    updateSource('awareness-source', awarenessGeoJson);

    if (!map.getLayer('awareness-line')) {
      map.addLayer({
        id: 'awareness-line',
        type: 'line',
        source: 'awareness-source',
        paint: {
          'line-color': '#25B7D3',
          'line-width': 1.0,
          'line-dasharray': [3, 4],
          'line-opacity': 0.5,
        },
      });
    }

    // Dynamic visibility toggles based on layers state
    map.setLayoutProperty('sea-ice-layer', 'visibility', layers.seaIceConcentration ? 'visible' : 'none');
    map.setLayoutProperty('sea-ice-outline', 'visibility', layers.seaIceConcentration ? 'visible' : 'none');
    map.setLayoutProperty('risk-zones-layer', 'visibility', layers.riskZones ? 'visible' : 'none');
    map.setLayoutProperty('risk-zones-line', 'visibility', layers.riskZones ? 'visible' : 'none');
    map.setLayoutProperty('trajectory-line', 'visibility', layers.predictedIcebergPaths ? 'visible' : 'none');
    map.setLayoutProperty('awareness-line', 'visibility', layers.predictiveAwarenessRange ? 'visible' : 'none');

    // Route click detection
    map.on('click', 'routes-line', (e: any) => {
      if (e.features && e.features[0]) {
        const routeId = e.features[0].properties?.id as 'ROUTE_A' | 'ROUTE_B' | 'ROUTE_C';
        if (routeId) onSelectRoute(routeId);
      }
    });
  }, [routes, selectedRouteId, icebergs, selectedIcebergId, vessel, layers, mapLoaded]);

  // Update Vessel Marker on the real map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (!vesselMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'vessel-maplibre-marker cursor-pointer group';
      el.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(37,183,211,0.25); border: 1px solid rgba(89,199,243,0.6);"></div>
          <div style="width: 14px; height: 14px; transform: rotate(${vessel.headingDegrees}deg); display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#EAF4FA" stroke="#081C2A" stroke-width="1.5">
              <polygon points="12,2 20,20 12,16 4,20" />
            </svg>
          </div>
          <div style="position: absolute; top: 18px; left: 50%; transform: translateX(-50%); background: #06131F; border: 1px solid #173F59; color: #59C7F3; font-family: monospace; font-size: 9px; padding: 1px 4px; border-radius: 2px; white-space: nowrap; font-weight: bold;">
            ${vessel.name.replace('R/V ', '')}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setActivePopupData({
          type: 'VESSEL',
          title: vessel.name,
          lat: vessel.lat,
          lng: vessel.lng,
          speed: vessel.speedKnots,
          heading: vessel.headingDegrees,
          status: vessel.navigationStatus,
          distance: vessel.distanceToDestNM,
          fuel: vessel.fuelPercent,
        });
      });

      vesselMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([vessel.lng, vessel.lat])
        .addTo(map);
    } else {
      vesselMarkerRef.current.setLngLat([vessel.lng, vessel.lat]);
      // Update heading rotation
      const icon = vesselMarkerRef.current.getElement().querySelector('svg')?.parentElement;
      if (icon) {
        icon.style.transform = `rotate(${vessel.headingDegrees}deg)`;
      }
    }
  }, [vessel.lat, vessel.lng, vessel.headingDegrees, mapLoaded]);

  // Update Iceberg Markers on the real map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear previous iceberg markers
    icebergMarkersRef.current.forEach((m) => m.remove());
    icebergMarkersRef.current = [];

    if (!layers.icebergObservations) return;

    icebergs.forEach((berg) => {
      const isSelected = berg.id === selectedIcebergId;
      const isThreat = berg.riskLevel === 'CRITICAL' || berg.riskLevel === 'HIGH';

      const el = document.createElement('div');
      el.className = 'iceberg-maplibre-marker cursor-pointer';
      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="width: ${isSelected ? '22px' : '16px'}; height: ${isSelected ? '22px' : '16px'}; background: ${
        isThreat ? '#E56A54' : '#59C7F3'
      }; clip-path: polygon(50% 0%, 100% 70%, 80% 100%, 20% 100%, 0% 70%); border: 1px solid #ffffff; box-shadow: 0 0 6px rgba(0,0,0,0.8);"></div>
          <div style="background: #06131F; border: 1px solid ${isSelected ? '#59C7F3' : '#12364D'}; color: #EAF4FA; font-family: monospace; font-size: 8px; font-weight: bold; padding: 0 3px; border-radius: 2px; margin-top: 2px; white-space: nowrap;">
            ${berg.id}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectIceberg(berg.id);
        setActivePopupData({
          type: 'ICEBERG',
          target: berg,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([berg.lng, berg.lat])
        .addTo(map);

      icebergMarkersRef.current.push(marker);
    });
  }, [icebergs, selectedIcebergId, layers.icebergObservations, mapLoaded]);

  // Update Research Station Markers on the real map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear previous station markers
    stationMarkersRef.current.forEach((m) => m.remove());
    stationMarkersRef.current = [];

    if (!layers.researchStations) return;

    ANTARCTIC_STATIONS.forEach((stn) => {
      const el = document.createElement('div');
      el.className = 'station-maplibre-marker cursor-pointer';
      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: #39B57A; border: 2px solid #EAF4FA; box-shadow: 0 0 4px #000;"></div>
          <div style="background: #081C2A; border: 1px solid #173F59; color: #EAF4FA; font-size: 9px; font-weight: 600; padding: 1px 4px; border-radius: 2px; margin-top: 2px; white-space: nowrap;">
            ${stn.name.split(' ')[0]} ${stn.type === 'Inland Continental Station' ? '(Inland)' : ''}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setActivePopupData({
          type: 'STATION',
          station: stn,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([stn.lng, stn.lat])
        .addTo(map);

      stationMarkersRef.current.push(marker);
    });
  }, [layers.researchStations, mapLoaded]);

  // Camera Actions
  const handleFitMission = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: [74.8, -68.0], zoom: 5.4, duration: 1200 });
  };

  const handleFitRoute = () => {
    if (!mapRef.current) return;
    const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
    const bounds = new maplibregl.LngLatBounds();
    activeRoute.coordinates.forEach((coord) => bounds.extend(coord));
    mapRef.current.fitBounds(bounds, { padding: 60, duration: 1000 });
  };

  const handleCenterVessel = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: [vessel.lng, vessel.lat], zoom: 6.8, duration: 1000 });
  };

  const handleFitHazards = () => {
    if (!mapRef.current) return;
    const berg = icebergs.find((b) => b.id === selectedIcebergId) || icebergs[0];
    mapRef.current.flyTo({ center: [berg.lng, berg.lat], zoom: 7.2, duration: 1100 });
  };

  return (
    <div className="relative w-full h-full bg-[#06131F] overflow-hidden select-none">
      {/* Real MapLibre DOM container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left: North Arrow & Coordinate Indicator */}
      <div className="absolute top-3 left-3 bg-[#081C2A]/90 border border-[#173F59] rounded px-2.5 py-1.5 text-xs text-slate-200 shadow-lg pointer-events-none flex items-center gap-2">
        <Navigation className="w-4 h-4 text-cyan-400 rotate-0" />
        <div className="font-mono-code text-[10px]">
          <span className="text-slate-400">POS: </span>
          <span className="text-[#EAF4FA] font-bold">
            {Math.abs(vessel.lat).toFixed(4)}°S, {vessel.lng.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Top Right: Basemap Selector & Real Sea-Ice Legend */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Basemap Switcher */}
        <div className="bg-[#081C2A]/95 border border-[#173F59] rounded p-1 flex items-center gap-1 shadow-lg text-[10px] font-mono-code">
          <span className="text-slate-400 px-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> Basemap:
          </span>
          {(['dark', 'ocean', 'satellite'] as const).map((style) => (
            <button
              key={style}
              onClick={() => onChangeBasemapStyle(style)}
              className={`px-2 py-0.5 rounded uppercase font-bold transition-colors ${
                basemapStyle === style
                  ? 'bg-[#12364D] text-[#59C7F3] border border-[#25B7D3]/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Real Geographic Sea-Ice Concentration Legend */}
        {layers.seaIceConcentration && (
          <div className="bg-[#081C2A]/95 border border-[#173F59] rounded p-2 shadow-xl text-slate-200 w-52 pointer-events-none">
            <div className="text-[10px] font-mono-code uppercase font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Sea-Ice Concentration</span>
              <span className="text-[#59C7F3] text-[9px]">AMSR2 / SAR</span>
            </div>
            {/* Color Strip */}
            <div className="w-full h-2.5 rounded flex overflow-hidden border border-[#12364D]">
              <div className="w-1/4 bg-[#0B2A42]" title="0-20% Low" />
              <div className="w-1/4 bg-[#25B7D3]" title="20-50% Moderate" />
              <div className="w-1/4 bg-[#F0B84B]" title="50-80% High" />
              <div className="w-1/4 bg-[#C93B4B]" title="80-100% Very High" />
            </div>
            <div className="flex justify-between text-[8.5px] font-mono-code text-slate-400 mt-1">
              <span>0–20%</span>
              <span>20–50%</span>
              <span>50–80%</span>
              <span>80–100%</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Left: Camera Quick Presets */}
      <div className="absolute bottom-4 left-3 bg-[#081C2A]/90 border border-[#173F59] rounded p-1 flex items-center gap-1 shadow-lg text-[10px] font-mono-code pointer-events-auto">
        <button
          onClick={handleFitMission}
          className="px-2 py-1 rounded hover:bg-[#12364D] text-slate-200 transition-colors flex items-center gap-1"
          title="Fit full Antarctic research corridor in view"
        >
          <Maximize2 className="w-3 h-3 text-[#59C7F3]" />
          <span>Fit Mission</span>
        </button>
        <div className="w-px h-4 bg-[#173F59]" />
        <button
          onClick={handleFitRoute}
          className="px-2 py-1 rounded hover:bg-[#12364D] text-slate-200 transition-colors flex items-center gap-1"
          title="Fit active route geometry"
        >
          <Compass className="w-3 h-3 text-[#39B57A]" />
          <span>Fit Route</span>
        </button>
        <div className="w-px h-4 bg-[#173F59]" />
        <button
          onClick={handleCenterVessel}
          className="px-2 py-1 rounded hover:bg-[#12364D] text-slate-200 transition-colors flex items-center gap-1"
          title="Center map on vessel"
        >
          <Target className="w-3 h-3 text-[#59C7F3]" />
          <span>Locate Vessel</span>
        </button>
        <div className="w-px h-4 bg-[#173F59]" />
        <button
          onClick={handleFitHazards}
          className="px-2 py-1 rounded hover:bg-[#12364D] text-slate-200 transition-colors flex items-center gap-1"
          title="Zoom to primary iceberg threat (IB-042)"
        >
          <Eye className="w-3 h-3 text-[#E56A54]" />
          <span>Fit Hazard</span>
        </button>
      </div>

      {/* Bottom Right: Real Nautical Scale Bar & Attribution */}
      <div className="absolute bottom-4 right-3 bg-[#081C2A]/90 border border-[#173F59] rounded px-3 py-1 text-[9px] font-mono-code text-slate-400 shadow-lg pointer-events-none flex items-center gap-3">
        <span>MapLibre GL JS | WGS-84</span>
        <div className="w-px h-3 bg-[#173F59]" />
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1 bg-[#12364D] border border-slate-500 relative">
            <div className="absolute -top-3 left-0 text-[8px]">0</div>
            <div className="absolute -top-3 right-0 text-[8px]">50 NM</div>
          </div>
        </div>
      </div>

      {/* POPUP / MODAL INSPECTION CARD */}
      {activePopupData && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-[#081C2A] border border-[#25B7D3] rounded p-3 text-xs text-slate-200 shadow-2xl w-[310px] backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-[#173F59] pb-1.5 mb-2">
            <div className="font-bold text-[11px] font-mono-code text-[#59C7F3] uppercase">
              {activePopupData.type === 'VESSEL' && 'RESEARCH VESSEL STATUS'}
              {activePopupData.type === 'ICEBERG' && 'ICEBERG TARGET OBSERVATION'}
              {activePopupData.type === 'STATION' && 'ANTARCTIC RESEARCH BASE'}
            </div>
            <button
              onClick={() => setActivePopupData(null)}
              className="text-slate-400 hover:text-white px-1 text-sm font-bold"
            >
              ×
            </button>
          </div>

          {activePopupData.type === 'VESSEL' && (
            <div className="space-y-1.5 font-mono-code text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Vessel:</span>
                <span className="text-white font-bold">{activePopupData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Position:</span>
                <span className="text-cyan-300">
                  {Math.abs(activePopupData.lat).toFixed(4)}°S, {activePopupData.lng.toFixed(4)}°E
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Speed / Heading:</span>
                <span className="text-white">
                  {activePopupData.speed} kn / {activePopupData.heading}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distance to Dest:</span>
                <span className="text-[#39B57A] font-bold">{activePopupData.distance} NM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fuel Reserve:</span>
                <span className="text-white">{activePopupData.fuel}%</span>
              </div>
            </div>
          )}

          {activePopupData.type === 'ICEBERG' && (
            <div className="space-y-1.5 font-mono-code text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">ID / Name:</span>
                <span className="text-white font-bold">
                  {activePopupData.target.id} ({activePopupData.target.name})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordinates:</span>
                <span className="text-cyan-300">
                  {Math.abs(activePopupData.target.lat).toFixed(4)}°S, {activePopupData.target.lng.toFixed(4)}°E
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Distance:</span>
                <span className="text-[#59C7F3] font-bold">{activePopupData.target.distanceNM} NM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Drift Vector:</span>
                <span className="text-white">
                  {activePopupData.target.velocityKnots} kn @ {activePopupData.target.directionCompass}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Predicted CPA:</span>
                <span
                  className={
                    activePopupData.target.predictedClosestApproachNM < 5
                      ? 'text-[#C93B4B] font-bold'
                      : 'text-[#F0B84B] font-bold'
                  }
                >
                  {activePopupData.target.predictedClosestApproachNM} NM
                </span>
              </div>
              <button
                onClick={() => {
                  onOpenTrajectoryModal(activePopupData.target);
                  setActivePopupData(null);
                }}
                className="w-full mt-2 py-1 rounded bg-[#12364D] hover:bg-[#173F59] text-[#59C7F3] font-bold text-[10px] transition-colors"
              >
                VIEW TRAJECTORY PHYSICS
              </button>
            </div>
          )}

          {activePopupData.type === 'STATION' && (
            <div className="space-y-1.5 font-mono-code text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Station:</span>
                <span className="text-white font-bold">{activePopupData.station.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nation / Operator:</span>
                <span className="text-cyan-300">
                  {activePopupData.station.country} ({activePopupData.station.operator})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="text-slate-200">{activePopupData.station.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordinates:</span>
                <span className="text-white">
                  {Math.abs(activePopupData.station.lat).toFixed(4)}°S, {activePopupData.station.lng.toFixed(4)}°E
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
