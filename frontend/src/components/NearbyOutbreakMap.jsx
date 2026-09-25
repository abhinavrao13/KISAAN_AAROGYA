import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  Radio, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Info,
  Globe,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getApiUrl } from '../config/api';

// Helper component to smoothly center map on selected field
function ChangeMapCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

// React Error Boundary to prevent blank white screens
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Outbreak Map render error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-rose-900">Map Interface Notice</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Interactive tile map encountered a display error. You can switch to Vector Radar mode or reload.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
          >
            Reload Outbreak Map
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function NearbyOutbreakMapWrapper(props) {
  return (
    <MapErrorBoundary>
      <NearbyOutbreakMapContent {...props} />
    </MapErrorBoundary>
  );
}

function NearbyOutbreakMapContent({ location, t }) {
  const [outbreakData, setOutbreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedField, setSelectedField] = useState(null);
  const [cropFilter, setCropFilter] = useState('All');
  const [mapMode, setMapMode] = useState('radar'); // 'radar' (Vector Radar) | 'tiles' (OpenStreetMap)
  const [mapCenter, setMapCenter] = useState([location?.latitude || 28.6139, location?.longitude || 77.2090]);

  const userLat = location?.latitude || 28.6139;
  const userLon = location?.longitude || 77.2090;

  // Create Leaflet divIcons inside useMemo to prevent top-level ESM initialization crashes
  const icons = useMemo(() => {
    const createCustomIcon = (color, isFarmer = false) => {
      const html = isFarmer ? `
        <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
        </div>
      ` : `
        <div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; font-family: sans-serif;">
          !
        </div>
      `;
      return L.divIcon({
        html: html,
        className: 'custom-leaflet-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });
    };

    return {
      farmer: createCustomIcon('#0284c7', true),
      critical: createCustomIcon('#dc2626', false),
      high: createCustomIcon('#ea580c', false),
      moderate: createCustomIcon('#eab308', false)
    };
  }, []);

  // Fetch nearby outbreak data from backend API
  useEffect(() => {
    fetchOutbreakData();
  }, [userLat, userLon, radiusKm]);

  const fetchOutbreakData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl(`/api/outbreaks/nearby?lat=${userLat}&lon=${userLon}&radius_km=${radiusKm}`));
      if (res.ok) {
        const data = await res.json();
        setOutbreakData(data);
        if (data.outbreaks && data.outbreaks.length > 0) {
          setSelectedField(data.outbreaks[0]);
        }
      } else {
        setError('Failed to load nearby field outbreak data.');
      }
    } catch (e) {
      console.error('Error fetching outbreak map data:', e);
      setError('Connection to outbreak tracking server failed.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOutbreaks = (outbreakData?.outbreaks || []).filter(o => 
    cropFilter === 'All' || o.crop.toLowerCase().includes(cropFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>GIS Regional Disease Outbreak Radar</span>
            <span className="bg-emerald-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black ml-1">LIVE GPS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Nearby Affected Fields & Pathogen Spread Map
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Trace active disease outbreaks on neighboring agricultural fields within a {radiusKm}km radius of your GPS location. Protect your crops before airborne spores reach your field.
          </p>
        </div>
      </div>

      {/* Control Strip & Metrics */}
      {outbreakData && outbreakData.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center space-x-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Nearby Outbreaks</span>
              <span className="text-xl font-black text-slate-900">{outbreakData.summary.total_outbreaks} Fields</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200 p-4 flex items-center space-x-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Critical &lt;5km Threat</span>
              <span className="text-xl font-black text-rose-600">{outbreakData.summary.critical_within_5km} Fields</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center space-x-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dominant Regional Threat</span>
              <span className="text-sm font-extrabold text-slate-800 line-clamp-1">{outbreakData.summary.dominant_threat}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Radar Radius</span>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-emerald-500"
              >
                <option value={10}>10 km Radius</option>
                <option value={25}>25 km Radius</option>
                <option value={50}>50 km Radius</option>
              </select>
            </div>
            <button
              onClick={fetchOutbreakData}
              className="p-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition"
              title="Refresh Nearby Map"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Map & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Viewport Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col min-h-[480px]">
          
          {/* Map Top Bar with Mode Switcher */}
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800">Filter Crop:</span>
              <div className="flex gap-1.5 flex-wrap">
                {['All', 'Potato', 'Tomato', 'Corn', 'Apple', 'Pepper'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCropFilter(c)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition ${
                      cropFilter === c 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMapMode('radar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  mapMode === 'radar' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                📡 Vector Radar
              </button>
              <button
                onClick={() => setMapMode('tiles')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  mapMode === 'tiles' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                🗺️ Tile Map
              </button>
            </div>
          </div>

          {/* Map Viewport */}
          <div className="relative flex-1 bg-slate-950 min-h-[450px]">
            
            {/* MODE 1: HIGH-PERFORMANCE VECTOR GIS RADAR (100% Guaranteed to render) */}
            {mapMode === 'radar' && (
              <div className="w-full h-full min-h-[450px] bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden select-none">
                
                {/* Concentric Radar Rings */}
                <div className="absolute w-[400px] h-[400px] border border-emerald-500/20 rounded-full animate-pulse" />
                <div className="absolute w-[280px] h-[280px] border border-emerald-500/30 rounded-full" />
                <div className="absolute w-[160px] h-[160px] border border-emerald-500/40 rounded-full" />
                <div className="absolute w-[60px] h-[60px] border border-emerald-400/60 rounded-full" />

                {/* Radar Sweep Line */}
                <div className="absolute w-[400px] h-[400px] rounded-full border border-emerald-500/10 bg-gradient-to-tr from-emerald-500/10 to-transparent animate-spin duration-10000" />

                {/* Center Farmer Location Pin */}
                <div className="absolute z-20 flex flex-col items-center cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                  <span className="bg-slate-900/90 text-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-500/40 mt-1 shadow">
                    Your Farm GPS
                  </span>
                </div>

                {/* Plot Nearby Field Outbreaks on Radar Canvas */}
                {filteredOutbreaks.map((ob, i) => {
                  // Calculate display offsets based on GPS delta
                  const deltaLat = ob.latitude - userLat;
                  const deltaLon = ob.longitude - userLon;
                  const scale = 3800; // scale factor
                  const x = Math.max(-180, Math.min(180, deltaLon * scale));
                  const y = Math.max(-180, Math.min(180, -deltaLat * scale));

                  const isSelected = selectedField?.id === ob.id;
                  const isCritical = ob.severity_level === 'Critical';
                  const pinColor = isCritical ? 'bg-rose-500 border-rose-200' : ob.severity_level === 'High' ? 'bg-amber-500 border-amber-200' : 'bg-yellow-400 border-yellow-100';

                  return (
                    <div
                      key={ob.id}
                      onClick={() => setSelectedField(ob)}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      className={`absolute z-30 cursor-pointer transition-transform hover:scale-125 flex flex-col items-center group`}
                    >
                      {/* Risk Circle Overlay */}
                      <div className={`absolute -inset-4 rounded-full opacity-30 animate-ping ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      
                      {/* Plot Marker */}
                      <div className={`w-6 h-6 rounded-full ${pinColor} border-2 shadow-lg flex items-center justify-center font-black text-slate-950 text-[10px]`}>
                        !
                      </div>

                      {/* Info Tooltip Badge */}
                      <div className={`mt-1 bg-slate-900/95 text-white text-[10px] px-2 py-0.5 rounded-lg border border-slate-700 shadow-xl whitespace-nowrap ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}>
                        <span className="font-extrabold">{ob.field_name.split(' - ')[0]}</span>
                        <span className="text-slate-400 ml-1">({ob.distance_km}km)</span>
                      </div>
                    </div>
                  );
                })}

                {/* Radar Grid Footer Legend */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-semibold bg-slate-900/80 backdrop-blur px-3.5 py-1.5 rounded-xl border border-slate-800">
                  <span>GPS Center: {userLat.toFixed(3)}° N, {userLon.toFixed(3)}° E</span>
                  <span className="text-emerald-400 font-bold">Scanning Radius: {radiusKm} km</span>
                </div>
              </div>
            )}

            {/* MODE 2: OPENSTREETMAP TILE LAYER */}
            {mapMode === 'tiles' && (
              <MapContainer
                center={[userLat, userLon]}
                zoom={11}
                scrollWheelZoom={true}
                style={{ height: '450px', width: '100%' }}
                className="w-full h-full min-h-[450px] rounded-b-3xl z-0"
              >
                <ChangeMapCenter center={mapCenter} zoom={12} />
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[userLat, userLon]} icon={icons.farmer}>
                  <Popup>Your Farm Location</Popup>
                </Marker>
                <Circle center={[userLat, userLon]} radius={radiusKm * 1000} pathOptions={{ color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.05 }} />
                {filteredOutbreaks.map((ob) => (
                  <Marker
                    key={ob.id}
                    position={[ob.latitude, ob.longitude]}
                    icon={ob.severity_level === 'Critical' ? icons.critical : ob.severity_level === 'High' ? icons.high : icons.moderate}
                    eventHandlers={{ click: () => setSelectedField(ob) }}
                  >
                    <Popup>
                      <strong>{ob.field_name}</strong><br />{ob.disease} ({ob.crop})
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}

            {loading && (
              <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center space-x-2 text-white font-bold text-sm">
                <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                <span>Scanning regional field coordinates...</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Field Outbreak Info Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-base text-slate-900">Outbreak Inspection</h3>
              </div>
              {selectedField && (
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  selectedField.severity_level === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedField.severity_level} Threat
                </span>
              )}
            </div>

            {selectedField ? (
              <div className="mt-4 space-y-4 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Field Location</span>
                  <h4 className="text-lg font-black text-slate-900">{selectedField.field_name}</h4>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                    {selectedField.latitude}° N, {selectedField.longitude}° E ({selectedField.distance_km} km from your farm)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Crop Affected</span>
                    <span className="font-extrabold text-slate-800 text-sm">{selectedField.crop}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Disease</span>
                    <span className="font-extrabold text-rose-700 text-sm line-clamp-1">{selectedField.disease}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Foliage Damaged</span>
                    <span className="font-extrabold text-slate-800 text-sm">{selectedField.affected_area_percent}%</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Spore Risk Zone</span>
                    <span className="font-extrabold text-slate-800 text-sm">{(selectedField.risk_buffer_m / 1000).toFixed(1)} km Radius</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-1.5 text-amber-900">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-amber-800">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Farmer Action Advisory:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Airborne spores from {selectedField.disease} can travel up to {(selectedField.risk_buffer_m / 1000).toFixed(1)} km in wind speeds &gt; 12 km/h. Apply bio-protective copper spray immediately if wind direction is toward your farm.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select an affected field on the map to inspect outbreak details.
              </div>
            )}
          </div>

          {/* List of all nearby fields */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Closest Infected Plots</span>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {filteredOutbreaks.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedField(item);
                    setMapCenter([item.latitude, item.longitude]);
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition ${
                    selectedField?.id === item.id 
                      ? 'bg-emerald-50 border border-emerald-300 font-bold' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="line-clamp-1 pr-2">
                    <span className="font-bold text-slate-800 block text-[11px]">{item.field_name}</span>
                    <span className="text-[10px] text-slate-500">{item.crop} • {item.disease}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 shrink-0 font-bold">{item.distance_km} km</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
