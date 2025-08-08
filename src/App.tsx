import { Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useAppStore } from './lib/store';
import { db } from './lib/database';
import { useToast } from './hooks/use-toast';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import AutomationPage from './pages/AutomationPage';
import IntegrationsPage from './pages/IntegrationsPage';

function App() {
  const { user: clerkUser } = useUser();
  const { setUser, loadUserProfile, loadReports } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (clerkUser) {
          // Load user profile from database
          await loadUserProfile(clerkUser.id);
          
          // If user doesn't exist, create with Clerk data
          const existingUser = await db.getUserProfile(clerkUser.id);
          if (!existingUser) {
            try {
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
              await loadUserProfile(clerkUser.id);
              toast({
                title: "Welcome to Hyve!",
                description: "Your profile has been created successfully.",
              });
            } catch (createError) {
              console.error('Error creating user profile:', createError);
              toast({
                title: "Profile Creation Failed",
                description: "There was an issue creating your profile. Please try again.",
                variant: "destructive",
              });
            }
          }
        } else {
          setUser(null);
        }
        
        // Load all reports
        try {
          await loadReports();
        } catch (reportsError) {
          console.error('Error loading reports:', reportsError);
          toast({
            title: "Reports Loading Failed",
            description: "There was an issue loading reports. Please refresh the page.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setError('Failed to initialize application');
        toast({
          title: "Initialization Error",
          description: "There was an issue starting the application. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [clerkUser, setUser, loadUserProfile, loadReports, toast]);

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
      } catch (subscriptionError) {
        console.error('Error setting up subscriptions:', subscriptionError);
        toast({
          title: "Real-time Updates Unavailable",
          description: "Some features may not update in real-time.",
          variant: "destructive",
        });
      }
    }
  }, [clerkUser, setUser, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Hyve...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-primary">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        {/* Catch-all route for 404s */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;