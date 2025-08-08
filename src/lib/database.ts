import { supabase } from './supabase';
import type { WasteReport, User } from './store';

export class DatabaseService {
  // User Profile Operations
  async createUserProfile(clerkUserId: string, userData: Partial<User>): Promise<User | null> {
    try {
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
        console.error('Supabase error creating user profile:', error);
        throw new Error(`Failed to create user profile: ${error.message}`);
      }

      return this.mapUserProfileToUser(data);
    } catch (error) {
      console.error('Error creating user profile:', error);
      // Don't throw here, return null to allow graceful handling
      return null;
    }
  }

  async getUserProfile(clerkUserId: string): Promise<User | null> {
    try {
      if (!clerkUserId) {
        console.warn('No clerk user ID provided');
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User not found, return null
          return null;
        }
        console.error('Database error:', error);
        return null;
      }

      return this.mapUserProfileToUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Don't throw here, return null to allow graceful handling
      return null;
    }
  }

  async updateUserProfile(clerkUserId: string, updates: Partial<User>): Promise<User | null> {
    try {
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
        console.error('Supabase error updating user profile:', error);
        throw new Error(`Failed to update user profile: ${error.message}`);
      }

      return this.mapUserProfileToUser(data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Don't throw here, return null to allow graceful handling
      return null;
    }
  }

  // Waste Report Operations
  async createWasteReport(reportData: Omit<WasteReport, 'id' | 'createdAt'>): Promise<WasteReport | null> {
    try {
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
        console.error('Supabase error creating waste report:', error);
        throw new Error(`Failed to create waste report: ${error.message}`);
      }

      return this.mapWasteReportFromDB(data);
    } catch (error) {
      console.error('Error creating waste report:', error);
      // Don't throw here, return null to allow graceful handling
      return null;
    }
  }

  async getWasteReports(): Promise<WasteReport[]> {
    try {
      const { data, error } = await supabase
        .from('waste_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return [];
      }

      return data ? data.map(this.mapWasteReportFromDB) : [];
    } catch (error) {
      console.error('Error fetching waste reports:', error);
      // Return empty array instead of throwing
      return [];
    }
  }

  async getUserWasteReports(userId: string): Promise<WasteReport[]> {
    try {
      const { data, error } = await supabase
        .from('waste_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching user waste reports:', error);
        throw new Error(`Failed to fetch user waste reports: ${error.message}`);
      }

      return data.map(report => this.mapWasteReportFromDB(report));
    } catch (error) {
      console.error('Error fetching user waste reports:', error);
      // Return empty array instead of throwing
      return [];
    }
  }

  async updateWasteReport(id: string, updates: Partial<WasteReport>): Promise<WasteReport | null> {
    try {
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
        console.error('Supabase error updating waste report:', error);
        throw new Error(`Failed to update waste report: ${error.message}`);
      }

      return this.mapWasteReportFromDB(data);
    } catch (error) {
      console.error('Error updating waste report:', error);
      // Don't throw here, return null to allow graceful handling
      return null;
    }
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
      // Return a dummy subscription object
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
      // Return a dummy subscription object
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
      console.error('Error mapping user profile:', error);
      // Return a default user object
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
    // Parse coordinates from PostgreSQL point format
    let coordinates: [number, number] = [-1.2921, 36.8219]; // Default Kilimani center
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

export const db = new DatabaseService();