import { Card } from '../ui/card';
import { TrendingUp } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export function PulseScoreMeter() {
  const { reports } = useAppStore();
  
  // Calculate dynamic score based on actual data
  const calculateScore = () => {
    const totalReports = reports.length;
    const resolvedReports = reports.filter(r => r.status === 'resolved').length;
    const highUrgencyPending = reports.filter(r => r.urgency === 'high' && r.status === 'pending').length;
    
    if (totalReports === 0) return 50;
    
    const resolutionRate = (resolvedReports / totalReports) * 100;
    const urgencyPenalty = highUrgencyPending * 5;
    
    return Math.max(0, Math.min(100, Math.round(resolutionRate - urgencyPenalty)));
  };

  const score = calculateScore();
  const maxScore = 100;
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent environmental health';
    if (score >= 60) return 'Good progress, room for improvement';
    return 'Needs attention';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary dark:text-white">
          Environmental Pulse
        </h3>
        <TrendingUp className="w-5 h-5 text-accent" />
      </div>
      
      <div className="relative">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="m18,2.0845a15.9155,15.9155 0 0,1 0,31.831a15.9155,15.9155 0 0,1 0,-31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100, 100"
              className="text-gray-200 dark:text-gray-700"
            />
            <path
              d="m18,2.0845a15.9155,15.9155 0 0,1 0,31.831a15.9155,15.9155 0 0,1 0,-31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${percentage}, 100`}
              className="text-accent transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-xs text-gray-500">
                / {maxScore}
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Kilimani Zone Score
          </p>
          <p className={`text-sm font-medium ${getScoreColor(score)}`}>
            {getScoreDescription(score)}
          </p>
        </div>
        
        {/* Score Breakdown */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Waste Collection</span>
            <span className="font-medium text-green-600">
              {Math.round((reports.filter(r => r.status === 'resolved').length / Math.max(1, reports.length)) * 100)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
            <span className="font-medium text-orange-600">
              {Math.max(60, 100 - reports.filter(r => r.urgency === 'high' && r.status === 'pending').length * 10)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Community Engagement</span>
            <span className="font-medium text-accent">
              {Math.min(100, Math.max(50, reports.length * 2))}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}