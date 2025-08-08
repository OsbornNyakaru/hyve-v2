import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { Leaf, Shield, Users, Award, CheckCircle, Star } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const benefits = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Award,
      title: 'Earn Rewards',
      description: 'Get carbon credits for every environmental action'
    },
    {
      icon: Users,
      title: 'Join Community',
      description: '2,345+ residents creating positive change'
    }
  ];

  const stats = [
    { value: '1,247', label: 'Reports Filed' },
    { value: '89%', label: 'Success Rate' },
    { value: '45.2T', label: 'CO₂ Saved' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <main className="pt-16">
        <div className="min-h-screen flex">
          {/* Left Side - Branding & Benefits */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
            
            <div className="relative flex flex-col justify-center px-12 py-16 text-white">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-2xl font-bold">Hyve</span>
                </div>
                <h1 className="text-4xl font-bold mb-4 leading-tight">
                  Transform Kilimani Through
                  <span className="block text-emerald-200">Environmental Action</span>
                </h1>
                <p className="text-emerald-100 text-lg leading-relaxed">
                  Join thousands of residents making a real difference in our community through smart waste management and collective environmental action.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                        <p className="text-emerald-100 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-emerald-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-emerald-200" />
                    <span className="text-emerald-200 text-sm">SSL Secured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span className="text-emerald-200 text-sm">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-emerald-200" />
                    <span className="text-emerald-200 text-sm">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {isSignUp ? 'Join Hyve Community' : 'Welcome Back'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {isSignUp 
                    ? 'Start making environmental impact in Kilimani'
                    : 'Continue your environmental journey'
                  }
                </p>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:block text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {isSignUp 
                    ? 'Join the environmental movement'
                    : 'Access your dashboard'
                  }
                </p>
              </div>

              {/* Auth Form Container */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
                {isSignUp ? (
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg transition-all duration-200",
                        card: "shadow-none bg-transparent border-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors duration-200",
                        formFieldInput: "border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white",
                        formFieldLabel: "text-slate-700 dark:text-slate-300 font-medium",
                        footerActionLink: "text-emerald-600 hover:text-emerald-700 font-medium",
                        identityPreviewText: "text-slate-600 dark:text-slate-400",
                        formFieldInputShowPasswordButton: "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                        dividerLine: "bg-slate-200 dark:bg-slate-600",
                        dividerText: "text-slate-500 dark:text-slate-400",
                        formFieldErrorText: "text-red-600 dark:text-red-400",
                        alertClerkError: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      }
                    }}
                    forceRedirectUrl="/dashboard"
                    signInUrl="/login"
                  />
                ) : (
                  <SignIn 
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg transition-all duration-200",
                        card: "shadow-none bg-transparent border-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors duration-200",
                        formFieldInput: "border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white",
                        formFieldLabel: "text-slate-700 dark:text-slate-300 font-medium",
                        footerActionLink: "text-emerald-600 hover:text-emerald-700 font-medium",
                        identityPreviewText: "text-slate-600 dark:text-slate-400",
                        formFieldInputShowPasswordButton: "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                        dividerLine: "bg-slate-200 dark:bg-slate-600",
                        dividerText: "text-slate-500 dark:text-slate-400",
                        formFieldErrorText: "text-red-600 dark:text-red-400",
                        alertClerkError: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      }
                    }}
                    forceRedirectUrl="/dashboard"
                    signUpUrl="/login"
                  />
                )}

                {/* Toggle */}
                <div className="mt-6 text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="ml-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors duration-200"
                    >
                      {isSignUp ? 'Sign in' : 'Sign up'}
                    </button>
                  </p>
                </div>
              </div>

              {/* Mobile Benefits */}
              <div className="lg:hidden mt-8">
                <div className="text-center mb-6">
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    Join the environmental movement
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700">
                      <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800 dark:text-white text-sm">{benefit.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-xs">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center space-x-6 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">SSL Secured</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span className="text-xs">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}