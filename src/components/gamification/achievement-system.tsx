import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Trophy, Star, Target, Award, Lock, CheckCircle, Gift } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export function AchievementSystem() {
  const { achievements, user, checkAchievements } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'reporting' | 'recycling' | 'community' | 'impact'>('all');
  const [showUnlockedModal, setShowUnlockedModal] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkAchievements(user.id);
    }
  }, [user, checkAchievements]);

  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'reporting', name: 'Reporting', icon: Target },
    { id: 'recycling', name: 'Recycling', icon: Award },
    { id: 'community', name: 'Community', icon: Star },
    { id: 'impact', name: 'Impact', icon: Gift }
  ];

  const filteredAchievements = (achievements || []).filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const completedCount = (achievements || []).filter(a => a.completed).length;
  const totalCreditsEarned = (achievements || [])
    .filter(a => a.completed)
    .reduce((sum, a) => sum + a.reward.credits, 0);

  const getProgressPercentage = (achievement: any) => {
    return Math.min(100, (achievement.progress / achievement.requirement) * 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reporting': return Target;
      case 'recycling': return Award;
      case 'community': return Star;
      case 'impact': return Gift;
      default: return Trophy;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Achievement Overview */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-primary dark:text-white">
            Achievements & Rewards
          </h2>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            <span className="text-sm md:text-base font-medium text-accent">
              {completedCount}/{(achievements || []).length}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="text-center p-3 md:p-4 bg-accent/5 rounded-xl">
            <div className="text-lg md:text-2xl font-bold text-accent">{completedCount}</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Unlocked</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-lg md:text-2xl font-bold text-green-600">{totalCreditsEarned}</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Credits</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-lg md:text-2xl font-bold text-purple-600">{(user?.badges || []).length}</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Badges</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-lg md:text-2xl font-bold text-blue-600">{Math.round((completedCount / (achievements || []).length) * 100)}%</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Complete</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id as any)}
                className="text-xs md:text-sm"
              >
                <Icon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredAchievements.map((achievement) => {
          const Icon = getCategoryIcon(achievement.category);
          const progress = getProgressPercentage(achievement);
          
          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`p-4 md:p-6 relative overflow-hidden transition-all duration-200 ${
                achievement.completed 
                  ? 'bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20' 
                  : 'hover:shadow-lg'
              }`}>
                {/* Achievement Icon */}
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-2xl md:text-3xl ${
                    achievement.completed 
                      ? 'bg-accent/10' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {achievement.completed ? achievement.icon : '🔒'}
                  </div>
                  
                  {achievement.completed && (
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  )}
                </div>

                {/* Achievement Info */}
                <h3 className={`font-semibold mb-2 text-sm md:text-base ${
                  achievement.completed 
                    ? 'text-accent' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {achievement.name}
                </h3>
                
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-3 md:mb-4">
                  <div className="flex justify-between items-center mb-1 md:mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {achievement.progress}/{achievement.requirement}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-2 rounded-full ${
                        achievement.completed ? 'bg-accent' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center justify-between">
                  <Badge variant={achievement.completed ? 'default' : 'secondary'} className="text-xs">
                    <Icon className="w-3 h-3 mr-1" />
                    {achievement.category}
                  </Badge>
                  <div className="text-xs font-medium text-accent">
                    +{achievement.reward.credits} credits
                  </div>
                </div>

                {/* Completion Overlay */}
                {achievement.completed && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-accent rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Unlock Modal */}
      <AnimatePresence>
        {showUnlockedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 max-w-md w-full text-center"
            >
              <div className="text-6xl md:text-8xl mb-4">{showUnlockedModal.icon}</div>
              <h2 className="text-xl md:text-2xl font-bold text-primary dark:text-white mb-2">
                Achievement Unlocked!
              </h2>
              <h3 className="text-lg md:text-xl font-semibold text-accent mb-3">
                {showUnlockedModal.name}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
                {showUnlockedModal.description}
              </p>
              <div className="bg-accent/10 rounded-xl p-4 mb-6">
                <div className="text-2xl md:text-3xl font-bold text-accent">
                  +{showUnlockedModal.reward.credits} Credits
                </div>
                {showUnlockedModal.reward.badge && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Badge: {showUnlockedModal.reward.badge}
                  </div>
                )}
              </div>
              <Button 
                onClick={() => setShowUnlockedModal(null)}
                className="w-full bg-accent hover:bg-accent/90"
              >
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}