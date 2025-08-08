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

      if (error) throw error;

      return this.mapUserProfileToUser(data);
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  async getUserProfile(clerkUserId: string): Promise<User | null> {
    try {
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
        throw error;
      }

      return this.mapUserProfileToUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
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

      if (error) throw error;

      return this.mapUserProfileToUser(data);
    } catch (error) {
      console.error('Error updating user profile:', error);
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
          location_address: reportData.location.address,
          location_coordinates: `(${reportData.location.coordinates[0]}, ${reportData.location.coordinates[1]})`,
          description: reportData.description,
          urgency: reportData.urgency,
          status: reportData.status,
          images: reportData.images,
          credits: reportData.credits,
          ai_analysis: reportData.aiAnalysis
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapWasteReportFromDB(data);
    } catch (error) {
      console.error('Error creating waste report:', error);
      return null;
    }
  }

  async getWasteReports(): Promise<WasteReport[]> {
    try {
      const { data, error } = await supabase
        .from('waste_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(this.mapWasteReportFromDB);
    } catch (error) {
      console.error('Error fetching waste reports:', error);
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

      if (error) throw error;

      return data.map(this.mapWasteReportFromDB);
    } catch (error) {
      console.error('Error fetching user waste reports:', error);
      return [];
    }
  }

  async updateWasteReport(id: string, updates: Partial<WasteReport>): Promise<WasteReport | null> {
    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.resolvedAt) updateData.resolved_at = updates.resolvedAt;
      if (updates.credits !== undefined) updateData.credits = updates.credits;
      if (updates.aiAnalysis) updateData.ai_analysis = updates.aiAnalysis;

      const { data, error } = await supabase
        .from('waste_reports')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.mapWasteReportFromDB(data);
    } catch (error) {
      console.error('Error updating waste report:', error);
      return null;
    }
  }

  // Helper methods to map database records to app types
  private mapUserProfileToUser(profile: any): User {
    return {
      id: profile.clerk_user_id,
      name: profile.name,
      email: profile.email,
      credits: profile.credits,
      total_earned: profile.total_earned,
      reportsCount: profile.reports_count,
      verified_reports: profile.verified_reports,
      recycling_score: profile.recycling_score,
      badges: profile.badges || [],
      joinedAt: profile.created_at,
      isAuthenticated: true,
      email_connected: profile.email_connected,
      preferences: profile.preferences || {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        automationEnabled: true,
        realTimeUpdates: true
      }
    };
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

  // Real-time subscriptions
  subscribeToWasteReports(callback: (reports: WasteReport[]) => void) {
    return supabase
      .channel('waste_reports_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'waste_reports' },
        () => {
          // Refetch all reports when changes occur
          this.getWasteReports().then(callback);
        }
      )
      .subscribe();
  }

  subscribeToUserProfile(clerkUserId: string, callback: (user: User | null) => void) {
    return supabase
      .channel('user_profile_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_profiles', filter: `clerk_user_id=eq.${clerkUserId}` },
        () => {
          // Refetch user profile when changes occur
          this.getUserProfile(clerkUserId).then(callback);
        }
      )
      .subscribe();
  }
}

export const db = new DatabaseService();