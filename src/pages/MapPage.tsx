import { useState } from 'react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { LeafletMap } from '../components/map/leaflet-map';
import { MapLayerToggle } from '../components/map/map-layer-toggle';
import { MapLegend } from '../components/map/map-legend';
import { Map, Info, RefreshCw } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui/button';

export default function MapPage() {
  const { mapFilters, setMapFilters, reports } = useAppStore();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = () => {
    setLastUpdated(new Date());
    // Trigger real-time data refresh
    window.location.reload();
  };

  const getActiveReports = () => {
    return reports.filter(r => r.status !== 'resolved' && r.status !== 'verified').length;
  };

  const getResolvedToday = () => {
    const today = new Date().toDateString();
    return reports.filter(r => 
      r.status === 'resolved' && 
      r.resolvedAt && 
      new Date(r.resolvedAt).toDateString() === today
    ).length;
  };

  const getHotspots = () => {
    return reports.filter(r => r.urgency === 'high' && r.status === 'pending').length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-14 sm:pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Map className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary dark:text-white">
                Real-Time Kilimani Map
              </h1>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="hidden sm:inline">Last updated: </span>
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <MapLayerToggle 
                filters={mapFilters}
                onFiltersChange={setMapFilters}
              />
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
          <LeafletMap filters={mapFilters} />
          
          {/* Map Legend */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
            <MapLegend />
          </div>

          {/* Quick Stats */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 min-w-[160px] sm:min-w-[200px]">
            <h3 className="font-semibold text-primary dark:text-white mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
              <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Quick Stats</span>
              <span className="sm:hidden">Stats</span>
              <div className="flex items-center space-x-1 text-xs text-green-600 ml-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="hidden sm:inline">Live</span>
              </div>
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active</span>
                <span className="font-medium text-orange-600">{getActiveReports()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Today</span>
                <span className="font-medium text-accent">{getResolvedToday()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Hotspots</span>
                <span className="font-medium text-red-600">{getHotspots()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
              Live waste reports, pickups & AI predictions
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}