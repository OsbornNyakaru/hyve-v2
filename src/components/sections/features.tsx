import { Recycle, MapPin, Award, Users, Smartphone, BarChart3 } from 'lucide-react';
import { Card } from '../ui/card';

export function Features() {
  const features = [
    {
      icon: Smartphone,
      title: 'Easy Reporting',
      description: 'Report waste issues instantly with GPS location and photo capture. Simple, fast, and effective.'
    },
    {
      icon: MapPin,
      title: 'Real-time Map',
      description: 'View all waste reports on an interactive map. Track progress and see community impact in real-time.'
    },
    {
      icon: Award,
      title: 'Carbon Credits',
      description: 'Earn verified carbon credits for every report. Turn environmental action into tangible rewards.'
    },
    {
      icon: BarChart3,
      title: 'Impact Analytics',
      description: 'Track your environmental impact with detailed analytics and community leaderboards.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of Kilimani residents working together for a cleaner, greener neighborhood.'
    },
    {
      icon: Recycle,
      title: 'Smart Classification',
      description: 'AI-powered waste classification ensures proper disposal and maximizes recycling efficiency.'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 text-sm sm:text-base">
            <Recycle className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Platform Features</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary dark:text-white mb-3 sm:mb-4 px-4">
            Everything You Need for Environmental Impact
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed">
            Our comprehensive platform makes it easy to report waste issues, track progress, 
            and earn rewards while building a cleaner Kilimani community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary dark:text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}