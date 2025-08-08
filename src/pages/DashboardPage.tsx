import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
import { EmailConnectionSetup } from '../components/email/connection-setup';
import { AchievementSystem } from '../components/gamification/achievement-system';
import { CreditDashboard } from '../components/carbon/credit-dashboard';
import { useAppStore } from '../lib/store';
import { initializeRealTimeUpdates } from '../lib/store';

export default function DashboardPage() {
  const { user } = useUser();
  const { user: storeUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (storeUser) {
      // Initialize PicaOS real-time updates
      initializeRealTimeUpdates();
    }
  }, [user, storeUser, navigate]);

  // Show email connection if not connected
  if (user && storeUser && !storeUser.email_connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="flex pt-14 sm:pt-16 pb-16 md:pb-0">
          <DashboardSidebar />
          
          <main className="flex-1 p-3 sm:p-4 md:p-6 w-full min-w-0">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-2">
                  Welcome to Hyve!
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  Let's connect your email to enable PicaOS automation workflows
                </p>
              </div>
              <EmailConnectionSetup />
            </div>
          </main>
        </div>

        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-14 sm:pt-16 pb-16 md:pb-0">
        <DashboardSidebar />
        
        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full min-w-0">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <DashboardHeader />
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