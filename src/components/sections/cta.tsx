import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone } from 'lucide-react';
import { Button } from '../ui/button';

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-accent to-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6">
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Available Now</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Kilimani?
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join over 1,000 residents already making a difference. Start reporting waste issues 
            and earning carbon credits today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 font-semibold"
              asChild
            >
              <Link to="/report">
                Start Your First Report
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/map">
                Explore the Map
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-white/80 mb-4">Trusted by leading environmental organizations</p>
            <div className="flex justify-center space-x-8 opacity-60">
              <div className="text-sm">UNEP Partner</div>
              <div className="text-sm">Green Belt Movement</div>
              <div className="text-sm">Nairobi City Council</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}