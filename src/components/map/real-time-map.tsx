import { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle, CheckCircle, Clock, Navigation, ZoomIn, ZoomOut, Layers, Maximize2, Truck, Target, Flame } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { picaOSClient } from '../../lib/picaos-client';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface RealTimeMapProps {
  filters: any;
}

export function RealTimeMap({ filters }: RealTimeMapProps) {
  const { reports, pickups, hotspots, updateHotspots, updatePickups } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const mapRef = useRef<HTMLDivElement>(null);
  const updateInterval = useRef<NodeJS.Timeout>();

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

    // Start real-time updates
    startRealTimeUpdates();
    
    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, []);

  const startRealTimeUpdates = () => {
    // Update every 30 seconds
    updateInterval.current = setInterval(async () => {
      try {
        // Get predicted hotspots from PicaOS
        const bounds = {
          north: -1.285,
          south: -1.300,
          east: 36.830,
          west: 36.815
        };
        
        const newHotspots = await picaOSClient.getPredictedHotspots(bounds);
        // Convert HotspotPrediction to Hotspot format
        const convertedHotspots = newHotspots.map((hotspot, index) => ({
          ...hotspot,
          id: hotspot.id || `hotspot-${Date.now()}-${index}`
        }));
        updateHotspots(convertedHotspots);
        
        // Mock pickup updates (in production, this would come from PicaOS)
        const mockPickups = [
          {
            id: 'pickup-001',
            reportId: 'KLM-001247',
            status: 'in-progress' as const,
            scheduledDate: new Date().toISOString(),
            estimatedArrival: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            driver: {
              name: 'James Mwangi',
              phone: '+254 700 123 456',
              vehicle: 'KCA 123X'
            },
            location: {
              address: 'Yaya Centre Area, Kilimani',
              coordinates: [-1.2921, 36.8219] as [number, number]
            },
            wasteType: 'plastic',
            estimatedWeight: 15.5
          }
        ];
        
        updatePickups(mockPickups);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, 30000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-600" />;
      case 'resolved':
        return <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-blue-600" />;
      case 'pending':
        return <Clock className="w-3 md:w-4 h-3 md:h-4 text-orange-600" />;
      case 'in-progress':
        return <AlertTriangle className="w-3 md:w-4 h-3 md:h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-3 md:w-4 h-3 md:h-4 text-red-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'plastic':
        return 'bg-blue-500';
      case 'organic':
        return 'bg-green-500';
      case 'electronic':
        return 'bg-purple-500';
      case 'hazardous':
        return 'bg-red-500';
      case 'construction':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredReports = reports.filter(report => {
    const typeMatch = filters[report.type];
    const statusMatch = filters[report.status] || filters[report.status.replace('-', '')];
    return typeMatch && statusMatch;
  });

  const filteredPickups = filters.pickups ? pickups : [];
  const filteredHotspots = filters.hotspots ? hotspots : [];

  const calculateMapPosition = (coords: [number, number]) => {
    const bounds = {
      north: -1.285,
      south: -1.300,
      east: 36.830,
      west: 36.815
    };
    
    const x = ((coords[1] - bounds.west) / (bounds.east - bounds.west)) * 100;
    const y = ((bounds.north - coords[0]) / (bounds.north - bounds.south)) * 100;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 10));
  
  const handleCenterOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={mapRef} className="w-full h-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
      {/* Real-time Status Indicator */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 md:p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Live • {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-2 md:top-4 right-2 md:right-4 z-30 flex flex-col space-y-1 md:space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg w-8 h-8 md:w-auto md:h-auto p-1 md:p-2"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-3 md:w-4 h-3 md:h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg w-8 h-8 md:w-auto md:h-auto p-1 md:p-2"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-3 md:w-4 h-3 md:h-4" />
        </Button>
        {userLocation && (
          <Button
            size="sm"
            variant="outline"
            className="bg-white dark:bg-gray-800 shadow-lg w-8 h-8 md:w-auto md:h-auto p-1 md:p-2"
            onClick={handleCenterOnUser}
          >
            <Navigation className="w-3 md:w-4 h-3 md:h-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg w-8 h-8 md:w-auto md:h-auto p-1 md:p-2"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="w-3 md:w-4 h-3 md:h-4" />
        </Button>
      </div>

      {/* Interactive Map */}
      <div 
        className="w-full h-full relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 cursor-move touch-pan-x touch-pan-y"
        style={{ 
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
          `,
          transform: `scale(${1 + (zoomLevel - 14) * 0.1})`
        }}
      >
        {/* Kilimani area representation */}
        <div className="absolute inset-4 md:inset-8 bg-white/30 dark:bg-gray-800/30 rounded-xl border-2 border-white/50 dark:border-gray-600/50">
          {/* Street grid overlay */}
          <div className="absolute inset-0 opacity-20">
            {[20, 40, 60, 80].map(y => (
              <div key={`h-${y}`} className="absolute w-full h-0.5 bg-gray-400" style={{ top: `${y}%` }} />
            ))}
            {[25, 50, 75].map(x => (
              <div key={`v-${x}`} className="absolute h-full w-0.5 bg-gray-400" style={{ left: `${x}%` }} />
            ))}
          </div>
          
          {/* Landmarks */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-500/20 px-2 py-1 rounded text-xs font-medium text-blue-700 dark:text-blue-300">
              Yaya Centre
            </div>
          </div>
          <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
            <div className="bg-green-500/20 px-2 py-1 rounded text-xs font-medium text-green-700 dark:text-green-300">
              Kilimani Primary
            </div>
          </div>
        </div>

        {/* Predicted Hotspots */}
        <AnimatePresence>
          {filteredHotspots.map((hotspot, index) => {
            const position = calculateMapPosition(hotspot.location.coordinates);
            return (
              <motion.div
                key={`hotspot-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-15"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
                onClick={() => setSelectedItem({ type: 'hotspot', data: hotspot })}
              >
                <motion.div 
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 md:w-12 h-8 md:h-12 bg-red-500/30 rounded-full flex items-center justify-center border-2 border-red-500"
                >
                  <Flame className="w-4 md:w-6 h-4 md:h-6 text-red-600" />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Active Pickups */}
        <AnimatePresence>
          {filteredPickups.map((pickup) => {
            const position = calculateMapPosition(pickup.location.coordinates);
            return (
              <motion.div
                key={pickup.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
                onClick={() => setSelectedItem({ type: 'pickup', data: pickup })}
              >
                <motion.div 
                  animate={{ x: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-8 md:w-12 h-8 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white"
                >
                  <Truck className="w-4 md:w-6 h-4 md:h-6" />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Report markers */}
        <AnimatePresence>
          {filteredReports.map((report) => {
            const position = calculateMapPosition(report.location.coordinates);
            return (
              <motion.div
                key={report.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
                onClick={() => setSelectedItem({ type: 'report', data: report })}
              >
                <div className={`w-6 md:w-10 h-6 md:h-10 ${getTypeColor(report.type)} rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 border-2 border-white`}>
                  <MapPin className="w-3 md:w-6 h-3 md:h-6" />
                </div>
                {report.urgency === 'high' && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-0.5 md:-top-1 -right-0.5 md:-right-1 w-2 md:w-4 h-2 md:h-4 bg-red-500 rounded-full border border-white" 
                  />
                )}
                {report.status === 'verified' && (
                  <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-green-500 rounded-full border border-white flex items-center justify-center">
                    <CheckCircle className="w-2 md:w-3 h-2 md:h-3 text-white" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Selected item popup */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute top-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 md:p-6 md:min-w-[350px] border border-gray-200 dark:border-gray-700"
            >
              {selectedItem.type === 'report' && (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedItem.data.status)}
                      <h3 className="font-semibold text-primary dark:text-white capitalize text-sm md:text-base">
                        {selectedItem.data.type} Waste Report
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {selectedItem.data.description}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    📍 {selectedItem.data.location.address}
                  </div>
                  
                  {selectedItem.data.classification && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600">PicaOS Classification</span>
                        <span className="text-xs text-gray-500">
                          {Math.round(selectedItem.data.classification.confidence * 100)}% confidence
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div>Weight: {selectedItem.data.estimatedWeight}kg</div>
                        <div>Credits: +{selectedItem.data.carbonCredits}</div>
                        <div>Recyclable: {selectedItem.data.classification.recyclable ? 'Yes' : 'No'}</div>
                        <div>Method: {selectedItem.data.classification.disposalMethod}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">#{selectedItem.data.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedItem.data.status === 'verified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : selectedItem.data.status === 'resolved'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : selectedItem.data.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                    }`}>
                      {selectedItem.data.status}
                    </span>
                  </div>
                </div>
              )}

              {selectedItem.type === 'pickup' && (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-primary dark:text-white text-sm md:text-base">
                        Active Pickup
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Driver:</strong> {selectedItem.data.driver.name}</div>
                    <div><strong>Vehicle:</strong> {selectedItem.data.driver.vehicle}</div>
                    <div><strong>ETA:</strong> {new Date(selectedItem.data.estimatedArrival).toLocaleTimeString()}</div>
                    <div><strong>Waste:</strong> {selectedItem.data.wasteType} ({selectedItem.data.estimatedWeight}kg)</div>
                  </div>
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Status: {selectedItem.data.status}
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'hotspot' && (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-red-600" />
                      <h3 className="font-semibold text-primary dark:text-white text-sm md:text-base">
                        Predicted Hotspot
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {selectedItem.data.wasteType}</div>
                    <div><strong>Probability:</strong> {Math.round(selectedItem.data.probability * 100)}%</div>
                    <div><strong>Severity:</strong> {selectedItem.data.severity}</div>
                    <div><strong>Predicted:</strong> {new Date(selectedItem.data.predictedDate).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      PicaOS AI Prediction
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Factors: {selectedItem.data.factors.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User location marker */}
        {userLocation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${calculateMapPosition([userLocation.lat, userLocation.lng]).x}%`,
              top: `${calculateMapPosition([userLocation.lat, userLocation.lng]).y}%`
            }}
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 md:w-4 h-3 md:h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" 
            />
            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-600 text-white px-2 py-1 rounded whitespace-nowrap">
              You are here
            </div>
          </motion.div>
        )}

        {/* Map Info */}
        <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 z-30 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 md:p-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Layers className="w-3 md:w-4 h-3 md:h-4" />
              <span className="hidden md:inline">Zoom: {zoomLevel}</span>
              <span className="md:hidden">Z{zoomLevel}</span>
            </div>
            <div className="text-gray-500 space-y-0.5">
              <div>{filteredReports.length} reports</div>
              <div>{filteredPickups.length} pickups</div>
              <div>{filteredHotspots.length} hotspots</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}