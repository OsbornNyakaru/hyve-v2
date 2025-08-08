import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Mail, CheckCircle, AlertCircle, Shield, Zap, Settings } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { motion } from 'framer-motion';

export function EmailConnectionSetup() {
  const { user, connectEmail } = useAppStore();
  const [selectedProvider, setSelectedProvider] = useState<'gmail' | 'outlook' | 'other'>('gmail');
  const [email, setEmail] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'select' | 'authorize' | 'complete'>('select');

  const providers = [
    {
      id: 'gmail' as const,
      name: 'Gmail',
      icon: '📧',
      description: 'Connect your Gmail account for seamless notifications',
      features: ['Report confirmations', 'Pickup notifications', 'Weekly summaries', 'Achievement alerts']
    },
    {
      id: 'outlook' as const,
      name: 'Outlook',
      icon: '📮',
      description: 'Connect your Outlook account for email automation',
      features: ['Report confirmations', 'Pickup notifications', 'Weekly summaries', 'Achievement alerts']
    },
    {
      id: 'other' as const,
      name: 'Other',
      icon: '✉️',
      description: 'Connect any email provider via SMTP',
      features: ['Basic notifications', 'Report confirmations', 'Manual setup required']
    }
  ];

  const handleConnect = async () => {
    if (!email || isConnecting) return;
    
    setIsConnecting(true);
    setConnectionStep('authorize');
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      await connectEmail(email, selectedProvider);
      setConnectionStep('complete');
    } catch (error) {
      console.error('Email connection failed:', error);
      setConnectionStep('select');
    } finally {
      setIsConnecting(false);
    }
  };

  if (user?.email_connected) {
    return (
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-primary dark:text-white text-sm md:text-base">
                Email Connected
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {user.email} • All notifications enabled
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 md:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-400">
              PicaOS Automation Active
            </span>
          </div>
          <div className="text-xs md:text-sm text-green-700 dark:text-green-300">
            Your email is connected to PicaOS workflows for automatic notifications about:
          </div>
          <ul className="text-xs text-green-600 dark:text-green-400 mt-2 space-y-1">
            <li>• Report status updates</li>
            <li>• Pickup confirmations</li>
            <li>• Carbon credit verifications</li>
            <li>• Achievement unlocks</li>
          </ul>
        </div>
      </Card>
    );
  }

  if (connectionStep === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-6 md:p-8 text-center">
          <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-primary dark:text-white mb-2">
            Email Connected Successfully!
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
            Your email is now connected to PicaOS automation workflows. You'll receive real-time notifications for all your environmental activities.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-accent hover:bg-accent/90"
          >
            Continue to Dashboard
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (connectionStep === 'authorize') {
    return (
      <Card className="p-6 md:p-8 text-center">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 md:w-8 md:h-8 text-accent animate-pulse" />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-primary dark:text-white mb-2">
          Connecting to {providers.find(p => p.id === selectedProvider)?.name}
        </h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
          Please authorize Hyve to access your email account in the popup window...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-4 md:p-6">
        <div className="flex items-center space-x-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-primary dark:text-white">
              Connect Your Email
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Enable PicaOS automation for seamless notifications
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400 text-sm md:text-base">
                Secure & Private
              </h4>
              <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300 mt-1">
                We only use your email for waste management notifications. Your data is encrypted and never shared.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className={`p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedProvider === provider.id
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-accent/50'
              }`}
              onClick={() => setSelectedProvider(provider.id)}
            >
              <div className="text-center mb-3">
                <div className="text-2xl md:text-3xl mb-2">{provider.icon}</div>
                <h3 className="font-medium text-primary dark:text-white text-sm md:text-base">
                  {provider.name}
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-3">
                {provider.description}
              </p>
              <div className="space-y-1">
                {provider.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Email Input */}
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary dark:text-white mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm md:text-base"
            />
          </div>

          <Button
            onClick={handleConnect}
            disabled={!email || isConnecting}
            className="w-full bg-accent hover:bg-accent/90 h-10 md:h-12"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Connect {providers.find(p => p.id === selectedProvider)?.name}
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 md:mt-6 text-center">
          <p className="text-xs text-gray-500">
            By connecting your email, you agree to receive automated notifications from PicaOS workflows.
          </p>
        </div>
      </Card>
    </div>
  );
}