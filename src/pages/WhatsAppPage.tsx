import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { DashboardSidebar } from '../components/dashboard/sidebar';
import { CommunityDashboard } from '../components/whatsapp/community-dashboard';
import { MessageSquare, Users, Smartphone, Globe } from 'lucide-react';

export default function WhatsAppPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-16">
        <DashboardSidebar />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-600 px-4 py-2 rounded-full mb-4">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">WhatsApp Integration</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4">
                Community WhatsApp Extension
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Empower grassroots organizations and community groups to coordinate environmental 
                initiatives through WhatsApp - perfect for low-tech, low-bandwidth areas.
              </p>
            </div>

            {/* Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-primary dark:text-white mb-2">Simple Reporting</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send photos via WhatsApp to report waste issues instantly
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-primary dark:text-white mb-2">Group Coordination</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organize cleanup events and track group achievements
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Globe className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-primary dark:text-white mb-2">Multi-Language</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full support for English, Kiswahili, and mixed conversations
                </p>
              </div>
            </div>

            {/* Main Dashboard */}
            <CommunityDashboard />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}