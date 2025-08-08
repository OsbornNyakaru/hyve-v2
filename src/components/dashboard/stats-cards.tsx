import { TrendingUp, TrendingDown, FileText, MapPin, Users, Award } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { useAppStore } from '../../lib/store';

export function StatsCards() {
  const { reports, user } = useAppStore();
  
  const getTotalCredits = () => {
    return (reports || []).reduce((sum, report) => sum + report.credits, 0);
  };

  const getResolvedThisMonth = () => {
    const thisMonth = new Date().getMonth();
    return (reports || []).filter(r => 
      (r.status === 'resolved' || r.status === 'verified') && 
      r.resolvedAt && 
      new Date(r.resolvedAt).getMonth() === thisMonth
    ).length;
  };

  const getVerifiedReports = () => {
    return (reports || []).filter(r => r.status === 'verified').length;
  };
  
  const stats = [
    {
      name: 'Total Reports',
      value: (reports || []).length.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: FileText
    },
    {
      name: 'Verified Reports',
      value: getVerifiedReports().toString(),
      change: '+35%',
      changeType: 'positive',
      icon: CheckCircle
    },
    {
      name: 'Resolved This Month',
      value: getResolvedThisMonth().toString(),
      change: '+18%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'Carbon Credits Earned',
      value: `${(getTotalCredits() / 1000).toFixed(1)}K`,
      change: '+5%',
      changeType: 'positive',
      icon: Award
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.changeType === 'positive';
        const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card key={stat.name} className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.name}
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-accent/10 rounded-xl flex items-center justify-center self-end sm:self-auto">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent" />
              </div>
            </div>
            
            <div className="flex items-center mt-2 sm:mt-3 md:mt-4">
              <ChangeIcon className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`} />
              <span className={`text-xs sm:text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                <span className="hidden sm:inline">from last month</span>
                <span className="sm:hidden">vs last month</span>
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}