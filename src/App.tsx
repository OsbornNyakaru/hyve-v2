import { Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Toaster } from './components/ui/toast';
import { useAppStore } from './lib/store';
import { db } from './lib/database';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import AutomationPage from './pages/AutomationPage';
import IntegrationsPage from './pages/IntegrationsPage';
import WhatsAppPage from './pages/WhatsAppPage';

function App() {
  const { user: clerkUser } = useUser();
  const { setUser, loadUserProfile, loadReports } = useAppStore();

  useEffect(() => {
    if (clerkUser) {
      // Load user profile from database
      loadUserProfile(clerkUser.id);
      
      // If user doesn't exist, create with Clerk data
      setTimeout(async () => {
        try {
          const existingUser = await db.getUserProfile(clerkUser.id);
          if (!existingUser) {
            await db.createUserProfile(clerkUser.id, {
              name: `${clerkUser.firstName} ${clerkUser.lastName}`,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              credits: 0,
              total_earned: 0,
              reportsCount: 0,
              verified_reports: 0,
              recycling_score: 50,
              badges: [],
              preferences: {
                emailNotifications: true,
                smsNotifications: false,
                pushNotifications: true,
                automationEnabled: true,
                realTimeUpdates: true
              },
              email_connected: false
            });
            loadUserProfile(clerkUser.id);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }, 100);
    } else {
      setUser(null);
    }
    
    // Load all reports
    loadReports();
  }, [clerkUser, setUser]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (clerkUser) {
      try {
        // Subscribe to user profile changes
        const userSubscription = db.subscribeToUserProfile(clerkUser.id, (user) => {
          if (user) setUser(user);
        });

        // Subscribe to waste reports changes
        const reportsSubscription = db.subscribeToWasteReports((reports) => {
          useAppStore.setState({ reports });
        });

        return () => {
          userSubscription.unsubscribe();
          reportsSubscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up subscriptions:', error);
      }
    }
  }, [clerkUser]);

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<LoginPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/reports" element={<ReportsPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/automation" element={<AutomationPage />} />
        <Route path="/dashboard/integrations" element={<IntegrationsPage />} />
        <Route path="/dashboard/whatsapp" element={<WhatsAppPage />} />
        {/* Catch-all route for 404s */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;