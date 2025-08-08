import { useUser } from '@clerk/clerk-react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { ReportForm } from '../components/forms/report-form';
import { Camera } from 'lucide-react';

export default function ReportPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 sm:pt-20 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 text-sm sm:text-base">
              <Camera className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Waste Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary dark:text-white mb-3 sm:mb-4 px-4">
              Report a Waste Issue
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed">
              Help keep Kilimani clean by reporting waste problems. Your contribution earns carbon credits 
              and helps our community environmental efforts.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-12 px-2 sm:px-0">
            <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">1,247</div>
              <div className="text-xs sm:text-sm text-gray-500">Reports</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">89%</div>
              <div className="text-xs sm:text-sm text-gray-500">Resolved</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent">~3 days</div>
              <div className="text-xs sm:text-sm text-gray-500">Response</div>
            </div>
          </div>

          {/* Report Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
            <ReportForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}