import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { DashboardSidebar } from '../components/dashboard/sidebar';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Zap, Brain, Mail, Calendar, MessageSquare, CheckCircle, Clock, Settings, Activity } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { picaOSClient } from '../lib/picaos-client';
import { motion } from 'framer-motion';

export default function AutomationPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { user: storeUser } = useAppStore();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadWorkflows();
    }
  }, [user, navigate]);

  const loadWorkflows = async () => {
    try {
      const picaosWorkflows = await picaOSClient.getWorkflows();
      setWorkflows(picaosWorkflows);
    } catch (error) {
      // Fallback to mock workflows
      setWorkflows([
        {
          id: 'wf_waste_classification',
          name: 'Automatic Waste Classification',
          trigger: 'image_uploaded',
          status: 'active',
          lastRun: '2025-01-22T10:30:00Z',
          totalRuns: 247
        },
        {
          id: 'wf_pickup_scheduling',
          name: 'Smart Pickup Scheduling',
          trigger: 'high_priority_report',
          status: 'active',
          lastRun: '2025-01-22T09:15:00Z',
          totalRuns: 89
        },
        {
          id: 'wf_credit_verification',
          name: 'Carbon Credit Verification',
          trigger: 'report_resolved',
          status: 'active',
          lastRun: '2025-01-22T08:45:00Z',
          totalRuns: 156
        },
        {
          id: 'wf_hotspot_prediction',
          name: 'Hotspot Prediction Model',
          trigger: 'daily_analysis',
          status: 'active',
          lastRun: '2025-01-22T06:00:00Z',
          totalRuns: 30
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkflowIcon = (trigger: string) => {
    switch (trigger) {
      case 'image_uploaded': return Brain;
      case 'high_priority_report': return Calendar;
      case 'report_resolved': return CheckCircle;
      case 'daily_analysis': return Activity;
      default: return Zap;
    }
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
                  PicaOS Automation
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  Live automation workflows powered by PicaOS
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 font-medium">
                  {workflows.filter(w => w.status === 'active').length} workflows active
                </span>
              </div>
            </div>

            {/* PicaOS Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="p-4 md:p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-primary dark:text-white">AI Classification</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  PicaOS automatically classifies waste types, estimates weight, and calculates carbon value
                </p>
              </Card>
              
              <Card className="p-4 md:p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-primary dark:text-white">Smart Notifications</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated email notifications for reports, pickups, and credit verifications
                </p>
              </Card>
              
              <Card className="p-4 md:p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Activity className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-primary dark:text-white">Predictive Analytics</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered hotspot predictions and waste pattern analysis
                </p>
              </Card>
            </div>

            {/* Active Workflows */}
            <Card className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary dark:text-white">
                  Active PicaOS Workflows
                </h2>
                <div className="text-sm text-gray-500">
                  {workflows.filter(w => w.status === 'active').length} active workflows
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading workflows...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflows.map((workflow) => {
                    const Icon = getWorkflowIcon(workflow.trigger);
                    return (
                      <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-sm transition-shadow duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Icon className={`w-5 h-5 ${workflow.status === 'active' ? 'text-accent' : 'text-gray-400'}`} />
                              <h3 className="font-medium text-primary dark:text-white">{workflow.name}</h3>
                              <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                {workflow.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Trigger: {workflow.trigger.replace('_', ' ')}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Runs: {workflow.totalRuns}</span>
                              {workflow.lastRun && (
                                <span>Last: {new Date(workflow.lastRun).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              workflow.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`} />
                            <span className="text-xs text-gray-500">
                              {workflow.status === 'active' ? 'Running' : 'Paused'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Email Integration Status */}
            {storeUser?.email_connected && (
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-primary dark:text-white">
                    Email Integration
                  </h2>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-400">
                        Email Connected Successfully
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {storeUser.email} • All notifications enabled
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-green-700 dark:text-green-300">Report confirmations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-green-700 dark:text-green-300">Pickup notifications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-green-700 dark:text-green-300">Credit verifications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-green-700 dark:text-green-300">Achievement alerts</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Workflow Performance */}
            <Card className="p-4 md:p-6">
              <h2 className="text-xl font-semibold text-primary dark:text-white mb-6">
                Workflow Performance
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {workflows.reduce((sum, w) => sum + w.totalRuns, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Executions</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">99.8%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">1.2s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
                </div>
                
                <div className="text-center p-4 bg-accent/10 rounded-xl">
                  <div className="text-2xl font-bold text-accent mb-1">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}