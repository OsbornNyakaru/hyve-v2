import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppStore } from '../../lib/store';

interface MapLayerToggleProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function MapLayerToggle({ filters, onFiltersChange }: MapLayerToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { reports } = useAppStore();

  const toggleFilter = (key: string, value?: boolean) => {
    const newValue = value !== undefined ? value : !filters[key];
    onFiltersChange({ ...filters, [key]: newValue });
  };

  const wasteTypes = [
    { key: 'plastic', label: 'Plastic Waste', color: 'bg-blue-500' },
    { key: 'organic', label: 'Organic Waste', color: 'bg-green-500' },
    { key: 'electronic', label: 'E-Waste', color: 'bg-purple-500' },
    { key: 'hazardous', label: 'Hazardous', color: 'bg-red-500' },
    { key: 'construction', label: 'Construction', color: 'bg-orange-500' },
    { key: 'other', label: 'Other', color: 'bg-gray-500' }
  ];

  const statuses = [
    { key: 'pending', label: 'Pending', color: 'bg-orange-500' },
    { key: 'inProgress', label: 'In Progress', color: 'bg-blue-500' },
    { key: 'resolved', label: 'Resolved', color: 'bg-gray-500' },
    { key: 'verified', label: 'Verified', color: 'bg-green-600' }
  ];

  const overlays = [
    { key: 'hotspots', label: 'AI Hotspots', color: 'bg-red-500', icon: '🔥' },
    { key: 'pickups', label: 'Active Pickups', color: 'bg-blue-600', icon: '🚛' }
  ];

  const getFilterCount = () => {
    return Object.values(filters).filter(Boolean).length;
  };

  const clearAllFilters = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as any);
    onFiltersChange(clearedFilters);
  };

  const selectAllFilters = () => {
    const allFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as any);
    onFiltersChange(allFilters);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3"
      >
        <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Filters ({getFilterCount()})</span>
        <span className="sm:hidden">({getFilterCount()})</span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-10 sm:top-12 right-0 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 min-w-[220px] sm:min-w-[280px] z-50 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3 sm:space-y-4">
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={selectAllFilters} className="text-xs flex-1">
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={clearAllFilters} className="text-xs flex-1">
                Clear All
              </Button>
            </div>

            {/* Waste Types */}
            <div>
              <h3 className="font-medium text-primary dark:text-white mb-2 text-sm sm:text-base">Waste Types</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {wasteTypes.map(type => (
                  <label key={type.key} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={filters[type.key]}
                      onChange={() => toggleFilter(type.key)}
                      className="rounded w-4 h-4"
                    />
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${type.color} rounded-full`} />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="font-medium text-primary dark:text-white mb-2 text-sm sm:text-base">Status</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {statuses.map(status => (
                  <label key={status.key} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={filters[status.key]}
                      onChange={() => toggleFilter(status.key)}
                      className="rounded w-4 h-4"
                    />
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${status.color} rounded-full`} />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Real-time Overlays */}
            <div>
              <h3 className="font-medium text-primary dark:text-white mb-2 text-sm sm:text-base">Live Data</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {overlays.map(overlay => (
                  <label key={overlay.key} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={filters[overlay.key]}
                      onChange={() => toggleFilter(overlay.key)}
                      className="rounded w-4 h-4"
                    />
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${overlay.color} rounded-full flex items-center justify-center`}>
                      <span className="text-xs">{overlay.icon}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{overlay.label}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Report Count */}
            <div className="pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                <span className="hidden sm:inline">Showing </span>{reports.filter(r => {
                  const typeMatch = filters[r.type];
                  const statusMatch = filters[r.status] || filters[r.status.replace('-', '')];
                  return typeMatch && statusMatch;
                }).length}<span className="hidden sm:inline"> of {reports.length}</span> reports
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}