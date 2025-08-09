import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { DashboardSidebar } from '../components/dashboard/sidebar';
import { DashboardHeader } from '../components/dashboard/header';
import { StatsCards } from '../components/dashboard/stats-cards';
import { InsightChart } from '../components/dashboard/insight-chart';
import { PulseScoreMeter } from '../components/dashboard/pulse-score-meter';
import { UserProfile } from '../components/dashboard/user-profile';
import { RecentReports } from '../components/dashboard/recent-reports';
import { Leaderboard } from '../components/dashboard/leaderboard';
import { AchievementSystem } from '../components/gamification/achievement-system';
import { CreditDashboard } from '../components/carbon/credit-dashboard';
import { Button } from '../components/ui/button';
import { useAppStore } from '../lib/store';
import { initializeRealTimeUpdates } from '../lib/store';

export default function DashboardPage() {
  const { user } = useUser();
  const { user: storeUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && storeUser) {
      // Initialize PicaOS real-time updates
      initializeRealTimeUpdates();
    }
  }, [user, storeUser]);


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-14 sm:pt-16 pb-16 md:pb-0">
        <DashboardSidebar />
        
        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full min-w-0">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <DashboardHeader />
            
            {/* Email Connection Prompt (if not connected) */}
            {storeUser && !storeUser.email_connected && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                      Enable PicaOS Automation
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Connect your email to unlock automated workflows and notifications
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate('/dashboard/integrations')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Connect Email
                  </Button>
                </div>
              </div>
            )}
            
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <InsightChart />
                <CreditDashboard />
                <RecentReports />
              </div>
              
              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-6">
                <PulseScoreMeter />
                <UserProfile />
                <Leaderboard />
              </div>
            </div>
            
            {/* Achievements Section */}
            <AchievementSystem />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}