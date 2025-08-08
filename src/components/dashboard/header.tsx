import { Bell, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary dark:text-white">
          Environmental Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Kilimani Waste Management Overview
        </p>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="relative">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search reports..."
            className="pl-8 sm:pl-10 w-40 sm:w-48 md:w-64 text-sm"
          />
        </div>
        
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Notifications</span>
        </Button>
      </div>
    </div>
  );
}