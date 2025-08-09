import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Leaf, 
  TrendingUp, 
  DollarSign, 
  Heart, 
  ShoppingCart, 
  History,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { picaOSClient } from '../../lib/picaos-client';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export function CreditDashboard() {
  const { user, redeemCredits } = useAppStore();
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemMethod, setRedeemMethod] = useState<'cash' | 'donation' | 'marketplace'>('cash');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [creditHistory, setCreditHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadCreditHistory();
    }
  }, [user]);

  const loadCreditHistory = async () => {
    if (!user) return;
    
    try {
      const history = await picaOSClient.getCarbonCredits(user.id);
      // --- CHANGED: Ensure creditHistory is always an array ---
      setCreditHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      // Fallback to mock data
      setCreditHistory([
        {
          id: 'credit-001',
          amount: 25,
          source: 'waste_report',
          status: 'verified',
          createdAt: '2025-01-20T10:30:00Z',
          verifiedAt: '2025-01-22T16:30:00Z',
          metadata: { reportId: 'KLM-001247', wasteType: 'plastic', weight: 15.5 }
        },
        {
          id: 'credit-002',
          amount: 12,
          source: 'recycling',
          status: 'verified',
          createdAt: '2025-01-19T14:45:00Z',
          verifiedAt: '2025-01-20T09:15:00Z',
          metadata: { wasteType: 'organic', weight: 8.2 }
        }
      ]);
    }
  };

  const handleRedeem = async () => {
    if (!user || !redeemAmount || isRedeeming) return;
    
    const amount = parseInt(redeemAmount);
    if (amount > user.credits || amount <= 0) return;

    setIsRedeeming(true);
    try {
      await redeemCredits(amount, redeemMethod);
      setRedeemAmount('');
      loadCreditHistory();
    } catch (error) {
      console.error('Redemption failed:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const getRedemptionRate = (method: string) => {
    switch (method) {
      case 'cash': return 0.05; // $0.05 per credit
      case 'donation': return 1.2; // 20% bonus for donations
      case 'marketplace': return 0.08; // Higher rate for marketplace
      default: return 0.05;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'waste_report': return Target;
      case 'recycling': return Award;
      case 'cleanup': return Leaf;
      case 'verification': return CheckCircle;
      default: return Zap;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Card className="p-4 md:p-6 bg-gradient-to-br from-accent/5 to-accent/10">
          <div className="flex items-center justify-between mb-2">
            <Leaf className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
            {user.credits}
          </div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Available Credits
          </div>
          <div className="text-xs text-accent mt-1">
            ≈ ${(user.credits * 0.05).toFixed(2)} USD
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
            {user.total_earned}
          </div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Total Earned
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            <Badge variant="secondary" className="text-xs">
              {user.verified_reports} verified
            </Badge>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-1">
            {user.recycling_score}%
          </div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Recycling Score
          </div>
        </Card>
      </div>

      {/* Credit Redemption */}
      <Card className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-primary dark:text-white mb-4 md:mb-6">
          Redeem Carbon Credits
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {[
            {
              method: 'cash' as const,
              icon: DollarSign,
              title: 'Cash Out',
              description: 'Convert to cash via M-Pesa',
              rate: '$0.05 per credit',
              color: 'text-green-600'
            },
            {
              method: 'donation' as const,
              icon: Heart,
              title: 'Donate',
              description: 'Support environmental projects',
              rate: '20% bonus credits',
              color: 'text-red-600'
            },
            {
              method: 'marketplace' as const,
              icon: ShoppingCart,
              title: 'Marketplace',
              description: 'Trade on carbon market',
              rate: '$0.08 per credit',
              color: 'text-blue-600'
            }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.method}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  redeemMethod === option.method
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-accent/50'
                }`}
                onClick={() => setRedeemMethod(option.method)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${option.color}`} />
                  <h4 className="font-medium text-primary dark:text-white text-sm md:text-base">
                    {option.title}
                  </h4>
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {option.description}
                </p>
                <div className="text-xs font-medium text-accent">
                  {option.rate}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Amount to redeem"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              max={user.credits}
              min="1"
              className="w-full h-10 md:h-12 px-3 md:px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary dark:text-white text-sm md:text-base"
            />
            <div className="text-xs text-gray-500 mt-1">
              Max: {user.credits} credits available
            </div>
          </div>
          <Button
            onClick={handleRedeem}
            disabled={!redeemAmount || parseInt(redeemAmount) > user.credits || isRedeeming}
            className="bg-accent hover:bg-accent/90 h-10 md:h-12 px-4 md:px-6"
          >
            {isRedeeming ? 'Processing...' : `Redeem ${redeemAmount || 0} Credits`}
          </Button>
        </div>

        {redeemAmount && (
          <div className="mt-3 md:mt-4 p-3 md:p-4 bg-accent/5 rounded-lg">
            <div className="text-sm md:text-base font-medium text-accent">
              You'll receive: {redeemMethod === 'cash' 
                ? `$${(parseInt(redeemAmount) * getRedemptionRate(redeemMethod)).toFixed(2)} USD`
                : redeemMethod === 'donation'
                ? `${Math.round(parseInt(redeemAmount) * getRedemptionRate(redeemMethod))} credits to charity`
                : `$${(parseInt(redeemAmount) * getRedemptionRate(redeemMethod)).toFixed(2)} USD`
              }
            </div>
          </div>
        )}
      </Card>

      {/* Credit History */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-primary dark:text-white">
            Credit History
          </h3>
          <History className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
        </div>

        <div className="space-y-3 md:space-y-4">
          {(Array.isArray(creditHistory) ? creditHistory : []).map((credit) => {
            const Icon = getSourceIcon(credit.source);
            return (
              <div key={credit.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-primary dark:text-white text-sm md:text-base">
                      +{credit.amount} Credits
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {credit.source.replace('_', ' ')} • {formatDistanceToNow(new Date(credit.createdAt), { addSuffix: true })}
                    </div>
                    {credit.metadata.reportId && (
                      <div className="text-xs text-gray-500">
                        Report #{credit.metadata.reportId}
                      </div>
                    )}
                  </div>
                </div>
                <Badge 
                  variant={credit.status === 'verified' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {credit.status === 'verified' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
              </div>
            );
          })}

          {creditHistory.length === 0 && (
            <div className="text-center py-6 md:py-8">
              <Leaf className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h4 className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400 mb-2">
                No credit history yet
              </h4>
              <p className="text-xs md:text-sm text-gray-500">
                Start reporting waste to earn your first carbon credits
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Credit Marketplace */}
      <Card className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-primary dark:text-white mb-4 md:mb-6">
          Carbon Credit Marketplace
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-medium text-primary dark:text-white text-sm md:text-base">
              Current Market Rates
            </h4>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center p-2 md:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Verified Plastic</span>
                <span className="font-medium text-green-600">$0.08/credit</span>
              </div>
              <div className="flex justify-between items-center p-2 md:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Organic Waste</span>
                <span className="font-medium text-blue-600">$0.06/credit</span>
              </div>
              <div className="flex justify-between items-center p-2 md:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">E-Waste</span>
                <span className="font-medium text-purple-600">$0.12/credit</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h4 className="font-medium text-primary dark:text-white text-sm md:text-base">
              Impact Projects
            </h4>
            <div className="space-y-2 md:space-y-3">
              <div className="p-2 md:p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="font-medium text-primary dark:text-white text-sm">
                  Kilimani Tree Planting
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  50 credits = 1 tree planted
                </div>
              </div>
              <div className="p-2 md:p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="font-medium text-primary dark:text-white text-sm">
                  Solar Panel Fund
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  200 credits = 1m² solar panel
                </div>
              </div>
              <div className="p-2 md:p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="font-medium text-primary dark:text-white text-sm">
                  Clean Water Access
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  100 credits = 1 month clean water
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}