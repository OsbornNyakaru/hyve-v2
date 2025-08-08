import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { Menu, X, Leaf, User, Moon, Sun, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../theme-provider';
import { useAppStore } from '../../lib/store';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user: storeUser } = useAppStore();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Report', href: '/report' },
    { name: 'Map', href: '/map' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hyve
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors duration-200 font-medium relative group text-sm lg:text-base"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 lg:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 lg:w-5 lg:h-5" /> : <Moon className="w-4 h-4 lg:w-5 lg:h-5" />}
            </button>
            
            <SignedIn>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="text-xs lg:text-sm text-right hidden lg:block">
                  <div className="font-medium text-primary dark:text-white">
                    {clerkUser?.firstName} {clerkUser?.lastName}
                  </div>
                  <div className="text-accent text-xs lg:text-xs">
                    {storeUser?.credits || 0} credits
                  </div>
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7 lg:w-8 lg:h-8"
                    }
                  }}
                />
              </div>
            </SignedIn>
            
            <SignedOut>
              <Button variant="outline" size="sm" asChild className="text-xs lg:text-sm px-2 lg:px-3">
                <Link to="/login">
                <User className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Sign In</span>
                <span className="lg:hidden">Login</span>
                </Link>
              </Button>
            </SignedOut>
            
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-xs lg:text-sm px-2 lg:px-3" asChild>
              <Link to="/report">
              <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              <span className="hidden lg:inline">Report Waste</span>
              <span className="lg:hidden">Report</span>
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="px-3 py-3 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-gray-600 dark:text-gray-300 hover:text-accent transition-colors duration-200 py-3 font-medium text-base"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <SignedIn>
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm">
                    <div className="font-medium text-primary dark:text-white">
                      {clerkUser?.firstName} {clerkUser?.lastName}
                    </div>
                    <div className="text-accent">{storeUser?.credits || 0} credits</div>
                  </div>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </div>
              </SignedIn>
              
              <SignedOut>
                <Button variant="outline" className="w-full h-12 text-base" asChild>
                  <Link to="/login">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                  </Link>
                </Button>
              </SignedOut>
              
              <Button className="w-full bg-accent hover:bg-accent/90 h-12 text-base" asChild>
                <Link to="/report">
                <Zap className="w-4 h-4 mr-2" />
                Report Waste
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}