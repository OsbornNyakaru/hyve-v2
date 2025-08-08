import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function RecentReports() {
  const { reports, updateReport } = useAppStore();
  const navigate = useNavigate();
  
  const recentReports = reports
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleStatusChange = (reportId: string, newStatus: string) => {
    updateReport(reportId, { 
      status: newStatus as any,
      resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-primary dark:text-white">
          Recent Reports
        </h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/reports')}>
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {recentReports.map((report) => (
          <div
            key={report.id}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  report.status === 'resolved' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : report.status === 'in-progress'
                    ? 'bg-blue-100 dark:bg-blue-900/20'
                    : 'bg-orange-100 dark:bg-orange-900/20'
                }`}>
                  {report.status === 'resolved' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : report.status === 'in-progress' ? (
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-primary dark:text-white">
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Waste
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.urgency === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      report.urgency === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {report.urgency}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{report.location.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === 'resolved' || report.status === 'verified'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : report.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                }`}>
                  {report.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                #{report.id} • {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
              </div>
              {report.status === 'pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(report.id, 'in-progress')}
                  className="text-xs"
                >
                  Mark In Progress
                </Button>
              )}
              {report.status === 'in-progress' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(report.id, 'resolved')}
                  className="bg-green-600 hover:bg-green-700 text-xs"
                >
                  Mark Resolved
                </Button>
              )}
            </div>
            {report.status === 'resolved' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange(report.id, 'verified')}
                className="text-xs bg-green-50 text-green-700 hover:bg-green-100"
              >
                Verify & Credit
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}