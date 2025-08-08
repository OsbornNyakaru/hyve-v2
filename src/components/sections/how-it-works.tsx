import { Link } from 'react-router-dom';
import { Camera, MapPin, Award, Users } from 'lucide-react';
import { Button } from '../ui/button';

export function HowItWorks() {
  const steps = [
    {
      icon: Camera,
      title: 'Report Waste',
      description: 'Spot a waste issue? Take a photo, add location details, and submit your report in seconds.',
      step: '01'
    },
    {
      icon: MapPin,
      title: 'Track Progress',
      description: 'Watch your report appear on the community map and track its resolution progress in real-time.',
      step: '02'
    },
    {
      icon: Award,
      title: 'Earn Credits',
      description: 'Receive verified carbon credits for each report. The more you contribute, the more you earn.',
      step: '03'
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Join the leaderboard, earn badges, and inspire others to create environmental change.',
      step: '04'
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            How Hyve Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Making environmental impact has never been easier. Follow these simple steps 
            to start earning carbon credits while cleaning up Kilimani.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-accent to-transparent transform translate-x-4 z-0" />
                )}
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary dark:bg-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white dark:text-primary">
                      {step.step}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-4">
              Ready to Make an Impact?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join over 1,000 Kilimani residents who are already earning carbon credits 
              and creating positive environmental change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-accent hover:bg-accent/90 text-white" asChild>
                <Link to="/report">Start Reporting Now</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/map">View Community Map</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}