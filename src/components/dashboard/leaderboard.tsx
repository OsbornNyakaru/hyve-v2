import { Card } from '../ui/card';
import { Crown } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export function Leaderboard() {
  const { user, reports } = useAppStore();
  
  // Calculate user credits from their reports
  const userCredits = reports
    .filter(r => r.userId === user?.id)
    .reduce((sum, r) => sum + r.credits, 0);

  // Mock leaderboard with current user
  const leaderboard = [
    { id: 'user-001', name: user?.name || 'Vera K.', credits: user?.credits || 247, badge: '🏆', rank: 1 },
    { id: 'user-002', name: 'Ray M.', credits: 230, badge: '🥈', rank: 2 },
    { id: 'user-003', name: 'Amina J.', credits: 218, badge: '🥉', rank: 3 },
    { id: 'user-004', name: 'John D.', credits: 195, badge: '', rank: 4 },
    { id: 'user-005', name: 'Sarah L.', credits: 187, badge: '', rank: 5 }
  ].sort((a, b) => b.credits - a.credits)
   .map((user, index) => ({ ...user, rank: index + 1 }));

  const currentUserRank = leaderboard.find(u => u.id === user?.id)?.rank || 1;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary dark:text-white">
          Community Leaders
        </h3>
        <Crown className="w-5 h-5 text-accent" />
      </div>
      
      <div className="space-y-3">
        {leaderboard.map((leaderUser) => (
          <div
            key={leaderUser.name}
            className={`flex items-center justify-between p-3 rounded-xl transition-colors duration-200 ${
              leaderUser.rank === 1 
                ? 'bg-accent/10 border border-accent/20' 
                : leaderUser.id === user?.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                {leaderUser.badge ? (
                  <span className="text-lg">{leaderUser.badge}</span>
                ) : (
                  <span className="text-sm font-bold text-gray-500">#{leaderUser.rank}</span>
                )}
              </div>
              <div>
                <p className={`font-medium ${
                  leaderUser.rank === 1 ? 'text-accent' : 
                  leaderUser.id === user?.id ? 'text-blue-600 dark:text-blue-400' :
                  'text-primary dark:text-white'
                }`}>
                  {leaderUser.name} {leaderUser.id === user?.id && '(You)'}
                </p>
                <p className="text-xs text-gray-500">
                  {leaderUser.rank === 1 ? 'Environmental Champion' : 'Active Contributor'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${
                leaderUser.rank === 1 ? 'text-accent' : 
                leaderUser.id === user?.id ? 'text-blue-600 dark:text-blue-400' :
                'text-primary dark:text-white'
              }`}>
                {leaderUser.credits}
              </p>
              <p className="text-xs text-gray-500">credits</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your rank: <span className="font-medium text-accent">#{currentUserRank}</span>
        </p>
      </div>
    </Card>
  );
}