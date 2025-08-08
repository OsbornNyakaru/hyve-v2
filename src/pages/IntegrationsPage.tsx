import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { DashboardSidebar } from '../components/dashboard/sidebar';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Zap, 
  Mail, 
  Brain,
  Activity,
  CheckCircle,
  Settings,
  ArrowRight,
  Globe
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { EmailConnectionSetup } from '../components/email/connection-setup';
import { motion } from 'framer-motion';

export default function IntegrationsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { user: storeUser } = useAppStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const picaosFeatures = [
    {
      icon: Brain,
      title: 'AI Waste Classification',
      description: 'Automatically identify waste types with 95%+ accuracy',
      status: 'active',
      metrics: '247 classifications this week'
    },
    {
      icon: Activity,
      title: 'Hotspot Prediction',
      description: 'Predict waste accumulation areas using ML models',
      status: 'active',
      metrics: '12 hotspots predicted accurately'
    },
    {
      icon: CheckCircle,
      title: 'Credit Verification',
      description: 'Automated carbon credit calculation and verification',
      status: 'active',
      metrics: '156 credits verified automatically'
    },
    {
      icon: Mail,
      title: 'Smart Notifications',
      description: 'Context-aware email notifications and updates',
      status: storeUser?.email_connected ? 'active' : 'setup_required',
      metrics: storeUser?.email_connected ? '89 emails sent this week' : 'Email connection required'
    }
  ];

  const integrationBenefits = [
    'Zero-configuration AI workflows',
    'Real-time waste classification',
    'Automated carbon credit calculation',
    'Predictive hotspot analysis',
    'Smart pickup scheduling',
    'Seamless email notifications'
  ];

  if (!storeUser?.email_connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="flex pt-16">
          <DashboardSidebar />
          
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-2">
                  Connect to PicaOS
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Enable full automation by connecting your email
                </p>
              </div>
              <EmailConnectionSetup />
            </div>
          </main>
        </div>

        <Footer />
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-16">
        <DashboardSidebar />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white">
                  PicaOS Integration
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  AI-powered automation for seamless waste management
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 font-medium">
                  PicaOS Active
                </span>
              </div>
            </div>

            {/* PicaOS Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {picaosFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="p-4 md:p-6 cursor-pointer hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary dark:text-white text-sm md:text-base">
                              {feature.title}
                            </h3>
                            <Badge variant={feature.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {feature.status === 'active' ? 'Active' : 'Setup Required'}
                            </Badge>
                          </div>
                        </div>
                        {feature.status === 'active' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Settings className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {feature.description}
                      </p>
                      
                      <div className="text-xs text-accent font-medium">
                        {feature.metrics}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Integration Benefits */}
            <Card className="p-4 md:p-6">
              <h2 className="text-xl font-semibold text-primary dark:text-white mb-4">
                PicaOS Integration Benefits
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-primary dark:text-white mb-3">
                    Automated Workflows
                  </h3>
                  <div className="space-y-2">
                    {integrationBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Globe className="w-6 h-6 text-accent" />
                    <h3 className="font-medium text-primary dark:text-white">
                      Visit PicaOS Platform
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Access advanced workflow management and analytics on the PicaOS platform
                  </p>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={() => window.open('https://app.picaos.com', '_blank')}
                  >
                    Open PicaOS Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Email Connection */}
            {!storeUser?.email_connected && (
              <EmailConnectionSetup />
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}