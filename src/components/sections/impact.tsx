import { Link } from 'react-router-dom';
import { TrendingUp, Leaf, Users, Globe } from 'lucide-react';
import { Button } from '../ui/button';

export function Impact() {
  const stats = [
    {
      icon: TrendingUp,
      value: '1,247',
      label: 'Waste Reports',
      description: 'Issues identified and reported by the community',
      color: 'text-blue-600'
    },
    {
      icon: Leaf,
      value: '45.2T',
      label: 'CO₂ Credits Earned',
      description: 'Carbon credits generated through waste management',
      color: 'text-green-600'
    },
    {
      icon: Users,
      value: '2,345',
      label: 'Active Members',
      description: 'Kilimani residents actively participating',
      color: 'text-purple-600'
    },
    {
      icon: Globe,
      value: '89%',
      label: 'Resolution Rate',
      description: 'Reported issues successfully resolved',
      color: 'text-accent'
    }
  ];

  const achievements = [
    {
      title: 'Plastic Reduction',
      description: 'Reduced plastic waste by 34% in participating areas',
      percentage: 34,
      color: 'bg-blue-500'
    },
    {
      title: 'Community Engagement',
      description: 'Increased environmental awareness by 67%',
      percentage: 67,
      color: 'bg-green-500'
    },
    {
      title: 'Response Time',
      description: 'Average issue resolution time improved by 45%',
      percentage: 45,
      color: 'bg-purple-500'
    }
  ];

  return (
    <section className="py-24 bg-primary dark:bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Community Impact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real Results, Real Impact
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            See how Kilimani residents are transforming their neighborhood through 
            collective environmental action and smart waste management.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-2">
                  {stat.label}
                </div>
                <p className="text-sm text-white/70">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Progress Bars */}
        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">
                {achievement.title}
              </h3>
              <p className="text-sm text-white/80 mb-4">
                {achievement.description}
              </p>
              <div className="relative">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className={`${achievement.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${achievement.percentage}%` }}
                  />
                </div>
                <div className="text-right mt-2">
                  <span className="text-2xl font-bold">{achievement.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Be Part of the Solution
            </h3>
            <p className="text-white/80 mb-6">
              Every report matters. Every action counts. Join the movement that's 
              transforming Kilimani into a model sustainable community.
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3" asChild>
              <Link to="/report">Join the Movement</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}