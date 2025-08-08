import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertTriangle, CheckCircle, Clock, Truck, Flame, Navigation } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  filters: any;
}

// Custom marker icons
const createCustomIcon = (color: string, icon?: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      ">
        ${icon || '📍'}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'plastic': return '#3B82F6';
    case 'organic': return '#10B981';
    case 'electronic': return '#8B5CF6';
    case 'hazardous': return '#EF4444';
    case 'construction': return '#F59E0B';
    default: return '#6B7280';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified': return '✅';
    case 'resolved': return '✅';
    case 'in-progress': return '🔄';
    case 'pending': return '⏳';
    default: return '📍';
  }
};

function MapController({ userLocation }: { userLocation: { lat: number; lng: number } | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 16);
    }
  }, [userLocation, map]);

  return null;
}

function MapEvents({ onLocationUpdate }: { onLocationUpdate: (location: { lat: number; lng: number }) => void }) {
  useMapEvents({
    locationfound: (e) => {
      onLocationUpdate({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function LeafletMap({ filters }: LeafletMapProps) {
  const { reports, pickups, hotspots } = useAppStore();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const mapRef = useRef<L.Map>(null);

  // Kilimani bounds
  const kilimaniCenter: [number, number] = [-1.2921, 36.8219];
  const kilimaniBounds: [[number, number], [number, number]] = [
    [-1.285, 36.815], // Southwest
    [-1.300, 36.830]  // Northeast
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Location access denied')
      );
    }
  }, []);

  const filteredReports = reports.filter(report => {
    const typeMatch = filters[report.type];
    const statusMatch = filters[report.status] || filters[report.status.replace('-', '')];
    return typeMatch && statusMatch;
  });

  const filteredPickups = filters.pickups ? pickups : [];
  const filteredHotspots = filters.hotspots ? hotspots : [];

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 16);
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={kilimaniCenter}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        maxBounds={kilimaniBounds}
        maxBoundsViscosity={1.0}
        ref={mapRef}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents onLocationUpdate={setUserLocation} />
        <MapController userLocation={userLocation} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createCustomIcon('#3B82F6', '👤')}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
                <br />
                <small>{userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</small>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Waste Report Markers */}
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            position={report.location.coordinates}
            icon={createCustomIcon(getTypeColor(report.type), getStatusIcon(report.status))}
            eventHandlers={{
              click: () => setSelectedItem({ type: 'report', data: report })
            }}
          >
            <Popup>
              <div className="min-w-[250px]">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold capitalize">{report.type} Waste</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    report.urgency === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.urgency}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                <div className="text-xs text-gray-500 mb-2">
                  📍 {report.location.address}
                </div>
                
                {report.classification && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-2">
                    <div className="text-xs font-medium text-purple-600 mb-1">
                      PicaOS Analysis ({Math.round(report.classification.confidence * 100)}% confidence)
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                      <div>Weight: {report.estimatedWeight}kg</div>
                      <div>Credits: +{report.carbonCredits}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">#{report.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'verified' || report.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : report.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Pickup Markers */}
        {filteredPickups.map((pickup) => (
          <Marker
            key={pickup.id}
            position={pickup.location.coordinates}
            icon={createCustomIcon('#2563EB', '🚛')}
            eventHandlers={{
              click: () => setSelectedItem({ type: 'pickup', data: pickup })
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold">Active Pickup</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div><strong>Driver:</strong> {pickup.driver.name}</div>
                  <div><strong>Vehicle:</strong> {pickup.driver.vehicle}</div>
                  <div><strong>ETA:</strong> {new Date(pickup.estimatedArrival).toLocaleTimeString()}</div>
                  <div><strong>Waste:</strong> {pickup.wasteType} ({pickup.estimatedWeight}kg)</div>
                </div>
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">
                    Status: {pickup.status}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Hotspot Markers */}
        {filteredHotspots.map((hotspot, index) => (
          <Marker
            key={`hotspot-${index}`}
            position={hotspot.location.coordinates}
            icon={createCustomIcon('#EF4444', '🔥')}
            eventHandlers={{
              click: () => setSelectedItem({ type: 'hotspot', data: hotspot })
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold">Predicted Hotspot</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div><strong>Type:</strong> {hotspot.wasteType}</div>
                  <div><strong>Probability:</strong> {Math.round(hotspot.probability * 100)}%</div>
                  <div><strong>Severity:</strong> {hotspot.severity}</div>
                  <div><strong>Predicted:</strong> {new Date(hotspot.predictedDate).toLocaleDateString()}</div>
                </div>
                <div className="mt-2 p-2 bg-red-50 rounded-lg">
                  <div className="text-xs text-red-600 font-medium">
                    PicaOS AI Prediction
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Factors: {hotspot.factors.join(', ')}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        {userLocation && (
          <button
            onClick={centerOnUser}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Center on your location"
          >
            <Navigation className="w-5 h-5 text-accent" />
          </button>
        )}
      </div>

      {/* Live Status Indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Live • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div className="font-medium text-primary dark:text-white">Kilimani Zone</div>
          <div>{filteredReports.length} reports</div>
          <div>{filteredPickups.length} active pickups</div>
          <div>{filteredHotspots.length} AI hotspots</div>
        </div>
      </div>
    </div>
  );
}