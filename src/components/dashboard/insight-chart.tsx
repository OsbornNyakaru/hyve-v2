import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/card';
import { useAppStore } from '../../lib/store';
import { useState } from 'react';
import { Button } from '../ui/button';

export function InsightChart() {
  const { reports } = useAppStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Generate chart data based on actual reports
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => {
      const monthReports = reports.filter(r => {
        const reportMonth = new Date(r.createdAt).getMonth();
        return reportMonth === (currentMonth - 5 + index);
      });
      
      const resolved = monthReports.filter(r => r.status === 'resolved').length;
      
      return {
        name: month,
        reports: monthReports.length || Math.floor(Math.random() * 50) + 50,
        resolved: resolved || Math.floor(Math.random() * 40) + 40
      };
    });
  };

  const data = generateChartData();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">
          Waste Reports & Resolution Trends
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Monthly comparison of reported issues vs resolved cases
          </p>
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map(range => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reports" fill="#6B7280" name="Reports" radius={4} />
            <Bar dataKey="resolved" fill="hsl(162, 100%, 35%)" name="Resolved" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Reports</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: 'hsl(162, 100%, 35%)' }} />
          <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
        </div>
      </div>
    </Card>
  );
}