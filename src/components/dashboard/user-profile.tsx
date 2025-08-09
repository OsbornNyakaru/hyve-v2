import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { User, Award, FileText, TrendingUp, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useNavigate } from 'react-router-dom';

export function UserProfile() {
  const { user, reports } = useAppStore();
  const navigate = useNavigate();

    // Guard: if user not loaded yet, show placeholder
  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">Loading profile...</p>
      </Card>
    );
  }

  const userReports = reports.filter(r => r.userId === user.id);
  const thisWeekCredits = userReports
    .filter(r => {
      const reportDate = new Date(r.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reportDate > weekAgo;
    })
    .reduce((sum, r) => sum + r.credits, 0);

  const nextMilestone = Math.ceil(user.credits / 100) * 100;
  const progressToNext = ((user.credits % 100) / 100) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-primary dark:text-white">{user.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.credits > 200 ? 'Environmental Champion' : 
             user.credits > 100 ? 'Eco Warrior' : 
             'Community Member'}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Reports Filed</span>
          </div>
          <span className="font-semibold text-primary dark:text-white">{user.reportsCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-accent" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Carbon Credits</span>
          </div>
          <span className="font-semibold text-accent">{user.credits}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Verified Reports</span>
          </div>
          <span className="font-semibold text-green-600">{user.verified_reports}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
          </div>
          <span className="font-semibold text-green-600">+{thisWeekCredits}</span>
        </div>
      </div>
      
      {/* Progress to next milestone */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Next Milestone</span>
          <span className="text-sm font-medium text-accent">{nextMilestone} credits</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressToNext}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{nextMilestone - user.credits} credits to go</p>
      </div>
      
      {/* Badges */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-primary dark:text-white mb-2">Recent Badges</h4>
        <div className="flex space-x-2">
          {user.badges.length > 0 ? (
            user.badges.map((badge, index) => (
              <div key={index} className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <span className="text-sm">{badge}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-500">No badges yet</div>
          )}
        </div>
      </div>
      
      <Button className="w-full mt-4 bg-accent hover:bg-accent/90" onClick={() => navigate('/dashboard/profile')}>
        View Full Profile
      </Button>
    </Card>
  );
}