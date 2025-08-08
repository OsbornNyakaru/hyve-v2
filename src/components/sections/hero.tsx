import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, TrendingUp, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/5 via-background to-primary/5 pt-14 sm:pt-16 px-3 sm:px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-[size:20px_20px] opacity-50" />
      
      <div className="relative max-w-7xl mx-auto py-8 sm:py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-accent/10 text-accent px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 text-sm sm:text-base"
            >
              <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Kilimani, Nairobi</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-primary dark:text-white leading-tight mb-4 sm:mb-6"
            >
              Turn Your Waste Into 
              <span className="text-accent block sm:inline lg:block xl:inline"> Impact</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Empower your community with AI-powered waste management. Report issues, track progress, 
              earn carbon credits, and create lasting environmental change in Kilimani.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12"
            >
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 sm:h-auto text-base font-semibold" asChild>
                <Link to="/report">
                  <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  Start Reporting
                  <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 sm:h-auto text-base font-semibold" asChild>
                <Link to="/map">View Waste Map</Link>
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 text-center"
            >
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">1,247</div>
                <div className="text-xs sm:text-sm text-gray-500">Reports</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">89%</div>
                <div className="text-xs sm:text-sm text-gray-500">Resolved</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">2,345</div>
                <div className="text-xs sm:text-sm text-gray-500">Credits</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-6 sm:mt-8 lg:mt-0 px-4 sm:px-0"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Recycle className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary dark:text-white text-sm sm:text-base">AI Waste Report</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Kilimani Ward</p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs sm:text-xs rounded-full">AI Analyzed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Credits</span>
                    <span className="font-semibold text-accent text-sm sm:text-base">+25 CO₂</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                    <span className="font-semibold text-purple-600 text-sm sm:text-base">94%</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 bg-accent/20 rounded-full flex items-center justify-center"
              >
                <TrendingUp className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-accent" />
              </motion.div>
              
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-xs sm:text-sm md:text-base font-bold text-primary dark:text-white">AI</div>
                  <div className="text-xs text-gray-500">Powered</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}