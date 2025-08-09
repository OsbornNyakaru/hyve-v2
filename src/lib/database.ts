import { supabase } from './supabase';
import type { WasteReport, User } from './store';

// --- MOCK DATA SECTION ---

const mockUser: User = {
  id: 'mock-user-1',
  name: 'Jane Demo',
  email: 'jane.demo@hyve.com',
  credits: 180,
  total_earned: 250,
  reportsCount: 7,
  verified_reports: 5,
  recycling_score: 88,
  badges: ['🏆', '♻️', '🌱'],
  joinedAt: '2024-01-15T10:00:00.000Z',
  isAuthenticated: true,
  email_connected: true,
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    automationEnabled: true,
    realTimeUpdates: true
  }
};

const mockWasteReports: WasteReport[] = [
  {
    id: 'mock-report-1',
    type: 'plastic',
    location: {
      address: 'Kilimani Road, Nairobi',
      coordinates: [-1.2921, 36.8219]
    },
    description: 'Plastic bottles scattered near the bus stop.',
    urgency: 'medium',
    status: 'resolved',
    images: ['/mock/plastic1.jpg'],
    createdAt: '2024-07-01T09:30:00.000Z',
    resolvedAt: '2024-07-02T14:00:00.000Z',
    credits: 20,
    userId: 'mock-user-1',
    aiAnalysis: { weight: 1.2, carbon_value: 2.5 }
  },
  {
    id: 'mock-report-2',
    type: 'organic',
    location: {
      address: 'Wood Avenue, Kilimani',
      coordinates: [-1.2930, 36.8225]
    },
    description: 'Rotten fruits dumped by the roadside.',
    urgency: 'high',
    status: 'pending',
    images: ['/mock/organic1.jpg'],
    createdAt: '2024-07-03T11:15:00.000Z',
    resolvedAt: undefined,
    credits: 15,
    userId: 'mock-user-1',
    aiAnalysis: { weight: 0.8, carbon_value: 1.1 }
  },
  {
    id: 'mock-report-3',
    type: 'other',
    location: {
      address: 'Argwings Kodhek Rd, Nairobi',
      coordinates: [-1.2940, 36.8200]
    },
    description: 'Discarded cans and scrap metal.',
    urgency: 'low',
    status: 'resolved',
    images: ['/mock/metal1.jpg'],
    createdAt: '2024-07-05T08:00:00.000Z',
    resolvedAt: '2024-07-06T10:30:00.000Z',
    credits: 10,
    userId: 'mock-user-1',
    aiAnalysis: { weight: 2.0, carbon_value: 3.0 }
  },
  {
    id: 'mock-report-4',
    type: 'other',
    location: {
      address: 'Dennis Pritt Rd, Kilimani',
      coordinates: [-1.2955, 36.8190]
    },
    description: 'Broken glass bottles near the playground.',
    urgency: 'medium',
    status: 'pending',
    images: ['/mock/glass1.jpg'],
    createdAt: '2024-07-07T13:45:00.000Z',
    resolvedAt: undefined,
    credits: 12,
    userId: 'mock-user-1',
    aiAnalysis: { weight: 0.5, carbon_value: 0.9 }
  },
  {
    id: 'mock-report-5',
    type: 'electronic',
    location: {
      address: 'Yaya Centre Parking Lot',
      coordinates: [-1.2970, 36.8230]
    },
    description: 'Old phone batteries dumped in parking.',
    urgency: 'high',
    status: 'resolved',
    images: ['/mock/ewaste1.jpg'],
    createdAt: '2024-07-10T16:20:00.000Z',
    resolvedAt: '2024-07-11T09:00:00.000Z',
    credits: 25,
    userId: 'mock-user-1',
    aiAnalysis: { weight: 0.3, carbon_value: 2.2 }
  },
  {
    id: 'mock-report-6',
    type: 'other',
    location: {
      address: 'Kindaruma Rd, Nairobi',
      coordinates: [-1.2980, 36.8240]
    },
    description: 'Piles of old newspapers.',
    urgency: 'low',
    status: 'pending',
    images: ['/mock/paper1.jpg'],
    createdAt: '2024-07-12T10:00:00.000Z',
    resolvedAt: undefined,
    credits: 8,
    userId: 'mock-user-1',
    aiAnalysis: { weight: 1.0, carbon_value: 0.7 }
  },
  {
    id: 'mock-report-7',
    type: 'plastic',
    location: {
      address: 'Adams Arcade, Nairobi',
      coordinates: [-1.2990, 36.8250]
    },
    description: 'Plastic bags in the drainage.',
    urgency: 'high',
    status: 'resolved',
    images: ['/mock/plastic2.jpg'],
    createdAt: '2024-07-13T12:30:00.000Z',
    resolvedAt: '2024-07-14T15:00:00.000Z',
    credits: 30,
    userId: 'mock-user-1',
    aiAnalysis: { weight: 1.5, carbon_value: 2.8 }
  }
];

// --- FALLBACK LOGIC ---

async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn('Database unavailable, using mock data:', error);
    return fallback;
  }
}

// --- DATABASE SERVICE WITH FALLBACKS ---

export class DatabaseService {
  // User Profile Operations
  async createUserProfile(clerkUserId: string, userData: Partial<User>): Promise<User | null> {
    return withFallback(
      async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .insert({
            clerk_user_id: clerkUserId,
            name: userData.name || '',
            email: userData.email || '',
            credits: userData.credits || 0,
            total_earned: userData.credits || 0,
            reports_count: 0,
            verified_reports: 0,
            recycling_score: 50,
            badges: userData.badges || [],
            preferences: userData.preferences || {
              emailNotifications: true,
              smsNotifications: false,
              pushNotifications: true,
              automationEnabled: true,
              realTimeUpdates: true
            },
            email_connected: false
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create user profile: ${error.message}`);
        }
        return this.mapUserProfileToUser(data);
      },
      clerkUserId === mockUser.id ? mockUser : null
    );
  }

  async getUserProfile(clerkUserId: string): Promise<User | null> {
    return withFallback(
      async () => {
        if (!clerkUserId) return null;
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null;
          throw new Error(error.message);
        }
        return this.mapUserProfileToUser(data);
      },
      clerkUserId === mockUser.id ? mockUser : null
    );
  }

  async updateUserProfile(clerkUserId: string, updates: Partial<User>): Promise<User | null> {
    return withFallback(
      async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            name: updates.name,
            email: updates.email,
            credits: updates.credits,
            total_earned: updates.total_earned,
            reports_count: updates.reportsCount,
            verified_reports: updates.verified_reports,
            recycling_score: updates.recycling_score,
            badges: updates.badges,
            preferences: updates.preferences,
            email_connected: updates.email_connected
          })
          .eq('clerk_user_id', clerkUserId)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update user profile: ${error.message}`);
        }
        return this.mapUserProfileToUser(data);
      },
      clerkUserId === mockUser.id ? mockUser : null
    );
  }

  // Waste Report Operations
  async createWasteReport(reportData: Omit<WasteReport, 'id' | 'createdAt'>): Promise<WasteReport | null> {
    return withFallback(
      async () => {
        const { data, error } = await supabase
          .from('waste_reports')
          .insert({
            user_id: reportData.userId,
            type: reportData.type,
            location: reportData.location,
            description: reportData.description,
            urgency: reportData.urgency,
            status: reportData.status,
            images: reportData.images,
            credits: reportData.credits || 0,
            classification: reportData.classification,
            estimated_weight: reportData.estimatedWeight,
            carbon_credits: reportData.carbonCredits
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create waste report: ${error.message}`);
        }
        return this.mapWasteReportFromDB(data);
      },
      null
    );
  }

  async getWasteReports(): Promise<WasteReport[]> {
    return withFallback(
      async () => {
        const { data, error } = await supabase
          .from('waste_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }
        return data ? data.map(this.mapWasteReportFromDB) : [];
      },
      mockWasteReports
    );
  }

  async getUserWasteReports(userId: string): Promise<WasteReport[]> {
    return withFallback(
      async () => {
        const { data, error } = await supabase
          .from('waste_reports')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }
        return data.map(report => this.mapWasteReportFromDB(report));
      },
      mockWasteReports.filter(r => r.userId === userId)
    );
  }

  async updateWasteReport(id: string, updates: Partial<WasteReport>): Promise<WasteReport | null> {
    return withFallback(
      async () => {
        const { data, error } = await supabase
          .from('waste_reports')
          .update({
            type: updates.type,
            location: updates.location,
            description: updates.description,
            urgency: updates.urgency,
            status: updates.status,
            images: updates.images,
            credits: updates.credits,
            classification: updates.classification,
            estimated_weight: updates.estimatedWeight,
            carbon_credits: updates.carbonCredits,
            resolved_at: updates.resolvedAt
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update waste report: ${error.message}`);
        }
        return this.mapWasteReportFromDB(data);
      },
      null
    );
  }

  // Subscription methods with error handling
  subscribeToWasteReports(callback: (reports: WasteReport[]) => void) {
    try {
      const subscription = supabase
        .channel('waste_reports_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'waste_reports' },
          async () => {
            try {
              const reports = await this.getWasteReports();
              callback(reports);
            } catch (error) {
              console.error('Error in waste reports subscription callback:', error);
            }
          }
        )
        .subscribe();

      return {
        unsubscribe: () => {
          try {
            subscription.unsubscribe();
          } catch (error) {
            console.error('Error unsubscribing from waste reports:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error setting up waste reports subscription:', error);
      return {
        unsubscribe: () => {}
      };
    }
  }

  subscribeToUserProfile(clerkUserId: string, callback: (user: User | null) => void) {
    try {
      const subscription = supabase
        .channel('user_profile_changes')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'user_profiles',
            filter: `clerk_user_id=eq.${clerkUserId}`
          },
          async () => {
            try {
              const user = await this.getUserProfile(clerkUserId);
              callback(user);
            } catch (error) {
              console.error('Error in user profile subscription callback:', error);
            }
          }
        )
        .subscribe();

      return {
        unsubscribe: () => {
          try {
            subscription.unsubscribe();
          } catch (error) {
            console.error('Error unsubscribing from user profile:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error setting up user profile subscription:', error);
      return {
        unsubscribe: () => {}
      };
    }
  }

  // Helper methods with error handling
  private mapUserProfileToUser(profile: any): User {
    try {
      return {
        id: profile.clerk_user_id,
        name: profile.name || '',
        email: profile.email || '',
        credits: profile.credits || 0,
        total_earned: profile.total_earned || 0,
        reportsCount: profile.reports_count || 0,
        verified_reports: profile.verified_reports || 0,
        recycling_score: profile.recycling_score || 50,
        badges: profile.badges || [],
        joinedAt: profile.created_at || new Date().toISOString(),
        isAuthenticated: true,
        email_connected: profile.email_connected || false,
        preferences: profile.preferences || {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          automationEnabled: true,
          realTimeUpdates: true
        }
      };
    } catch (error) {
      return {
        id: profile?.clerk_user_id || '',
        name: profile?.name || 'Unknown User',
        email: profile?.email || '',
        credits: 0,
        total_earned: 0,
        reportsCount: 0,
        verified_reports: 0,
        recycling_score: 50,
        badges: [],
        joinedAt: new Date().toISOString(),
        isAuthenticated: true,
        email_connected: false,
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          automationEnabled: true,
          realTimeUpdates: true
        }
      };
    }
  }

  private mapWasteReportFromDB(report: any): WasteReport {
    let coordinates: [number, number] = [-1.2921, 36.8219];
    if (report.location_coordinates) {
      const coordMatch = report.location_coordinates.match(/\(([^,]+),([^)]+)\)/);
      if (coordMatch) {
        coordinates = [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
      }
    }
    return {
      id: report.id,
      type: report.type,
      location: {
        address: report.location_address,
        coordinates
      },
      description: report.description,
      urgency: report.urgency,
      status: report.status,
      images: report.images || [],
      createdAt: report.created_at,
      resolvedAt: report.resolved_at,
      credits: report.credits,
      userId: report.user_id,
      aiAnalysis: report.ai_analysis
    };
  }
}

// ...existing code...
export const db = new DatabaseService();