import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from './database';
import { picaOSClient } from './picaos-client';

export interface WasteReport {
  id: string;
  type: 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'construction' | 'other';
  location: {
    address: string;
    coordinates: [number, number];
  };
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved' | 'verified';
  images: string[];
  createdAt: string;
  resolvedAt?: string;
  credits: number;
  userId: string;
  aiAnalysis?: any;
  classification?: {
    confidence: number;
    wasteType: string;
    estimatedWeight: number;
  };
  estimatedWeight?: number;
  carbonCredits?: number;
}

export interface Hotspot {
  id: string;
  location: {
    coordinates: [number, number];
    address: string;
  };
  wasteType: string;
  probability: number;
  predictedDate: string;
  severity: 'low' | 'medium' | 'high';
  factors: string[];
}

export interface Pickup {
  id: string;
  reportId: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledDate: string;
  estimatedArrival: string;
  driver: {
    name: string;
    phone: string;
    vehicle: string;
  };
  wasteType: string;
  estimatedWeight: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  total_earned: number;
  reportsCount: number;
  verified_reports: number;
  recycling_score: number;
  badges: string[];
  joinedAt: string;
  isAuthenticated: boolean;
  email_connected: boolean;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    automationEnabled: boolean;
    realTimeUpdates: boolean;
  };
}

interface AppState {
  user: User | null;
  reports: WasteReport[];
  hotspots: Hotspot[];
  pickups: Pickup[];
  achievements: any[];
  carbonCredits: any[];
  isLoading: boolean;
  mapFilters: {
    plastic: boolean;
    organic: boolean;
    electronic: boolean;
    hazardous: boolean;
    construction: boolean;
    other: boolean;
    resolved: boolean;
    pending: boolean;
    inProgress: boolean;
    hotspots: boolean;
    pickups: boolean;
    verified: boolean;
  };
  
  // Actions
  setUser: (user: User | null) => void;
  loadUserProfile: (clerkUserId: string) => Promise<void>;
  createUserProfile: (clerkUserId: string, userData: Partial<User>) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  addReport: (report: Omit<WasteReport, 'id' | 'createdAt' | 'credits'>) => void;
  loadReports: () => Promise<void>;
  updateReport: (id: string, updates: Partial<WasteReport>) => void;
  updateHotspots: (hotspots: Hotspot[]) => void;
  updatePickups: (pickups: Pickup[]) => void;
  checkAchievements: (userId: string) => void;
  redeemCredits: (amount: number, method: string) => Promise<void>;
  connectEmail: (email: string, provider: string) => Promise<void>;
  setMapFilters: (filters: Partial<AppState['mapFilters']>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      reports: [],
      hotspots: [],
      pickups: [],
      achievements: [],
      carbonCredits: [],
      isLoading: false,
      mapFilters: {
        plastic: true,
        organic: true,
        electronic: true,
        hazardous: true,
        construction: true,
        other: true,
        resolved: true,
        pending: true,
        inProgress: true,
        hotspots: true,
        pickups: true,
        verified: true
      },

      setUser: (user) => set({ user }),

      loadUserProfile: async (clerkUserId: string) => {
        try {
          let user = await db.getUserProfile(clerkUserId);
          if (!user) {
            // Create new user profile if doesn't exist
            user = await db.createUserProfile(clerkUserId, {
              name: '',
              email: '',
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
          }
          set({ user });
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      },

      createUserProfile: async (clerkUserId: string, userData: Partial<User>) => {
        try {
          const user = await db.createUserProfile(clerkUserId, userData);
          if (user) {
            set({ user });
          }
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
      },

      updateUserProfile: async (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          const updatedUser = await db.updateUserProfile(currentUser.id, { ...currentUser, ...updates });
          if (updatedUser) {
            set({ user: updatedUser });
          }
        } catch (error) {
          console.error('Error updating user profile:', error);
        }
      },

      addReport: async (reportData) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({ isLoading: true });
        
        try {
          // Calculate credits based on waste type and urgency
          let credits = 10; // Base credits
          if (reportData.urgency === 'high') credits += 10;
          if (reportData.type === 'hazardous') credits += 15;
          if (reportData.type === 'electronic') credits += 12;
          
          const newReportData = {
            ...reportData,
            credits,
            userId: currentUser.id
          };

          const savedReport = await db.createWasteReport(newReportData);
          
          if (savedReport) {
            // Update local state
            set((state) => ({
              reports: [savedReport, ...state.reports]
            }));

            // Update user credits and report count
            await get().updateUserProfile({
              credits: currentUser.credits + credits,
              total_earned: currentUser.total_earned + credits,
              reportsCount: currentUser.reportsCount + 1
            });
          }
        } catch (error) {
          console.error('Error adding report:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      loadReports: async () => {
        set({ isLoading: true });
        try {
          const reports = await db.getWasteReports();
          set({ reports });
        } catch (error) {
          console.error('Error loading reports:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateReport: async (id, updates) => {
        try {
          const updatedReport = await db.updateWasteReport(id, updates);
          
          if (updatedReport) {
            set((state) => ({
              reports: state.reports.map(report => 
                report.id === id ? updatedReport : report
              )
            }));

            // If report was resolved/verified, update user stats
            if (updates.status === 'resolved') {
              const currentUser = get().user;
              if (currentUser) {
                await get().updateUserProfile({
                  verified_reports: currentUser.verified_reports + 1
                });
              }
            }
          }
        } catch (error) {
          console.error('Error updating report:', error);
        }
      },

      updateHotspots: (hotspots) => set({ hotspots }),

      updatePickups: (pickups) => set({ pickups }),

      checkAchievements: (userId: string) => {
        // Mock implementation for achievements
        set({ achievements: [] });
      },

      redeemCredits: async (amount: number, method: string) => {
        const currentUser = get().user;
        if (currentUser && currentUser.credits >= amount) {
          await get().updateUserProfile({
            credits: currentUser.credits - amount
          });
        }
      },

      connectEmail: async (email: string, provider: string) => {
        const currentUser = get().user;
        if (currentUser) {
          await get().updateUserProfile({
            email_connected: true
          });
        }
      },
      setMapFilters: (filters) => {
        set((state) => ({
          mapFilters: { ...state.mapFilters, ...filters }
        }));
      },

      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'hyve-storage',
      partialize: (state) => ({ 
        mapFilters: state.mapFilters
      }),
    }
  )
);

export const initializeRealTimeUpdates = (userId?: string) => {
  const { updateHotspots, updatePickups } = useAppStore.getState();
  
  // Subscribe to real-time updates from PicaOS
  picaOSClient.subscribeToUpdates(userId || '', (data) => {
    if (data.hotspots) {
      updateHotspots(data.hotspots);
    }
    if (data.pickups) {
      updatePickups(data.pickups);
    }
  }).catch(console.error);
};