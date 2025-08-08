export function MapLegend() {
  const items = [
    { color: 'bg-blue-500', label: 'Plastic Waste' },
    { color: 'bg-green-500', label: 'Organic Waste' },
    { color: 'bg-purple-500', label: 'E-Waste' },
    { color: 'bg-red-500', label: 'Hazardous' },
    { color: 'bg-blue-600', label: 'Active Pickup', icon: '🚛' },
    { color: 'bg-red-500', label: 'AI Hotspot', icon: '🔥' },
    { color: 'bg-green-600', label: 'Verified', icon: '✅' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-primary dark:text-white mb-2 sm:mb-3 text-sm sm:text-base">
        <span className="hidden sm:inline">Legend</span>
        <span className="sm:hidden">Types</span>
      </h3>
      <div className="space-y-1.5 sm:space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${item.color} rounded-full flex items-center justify-center`}>
              {item.icon && <span className="text-xs">{item.icon}</span>}
            </div>
            <span className="text-xs sm:text-xs text-gray-600 dark:text-gray-400">
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.label.split(' ')[0]}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}