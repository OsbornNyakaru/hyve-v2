import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Map, 
  FileText, 
  Users, 
  Settings, 
  Award,
  ChevronLeft,
  ChevronRight,
  User,
  Zap,
  Plug,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, reports } = useAppStore();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: BarChart3 },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Map View', href: '/map', icon: Map },
    { name: 'AI Automation', href: '/dashboard/automation', icon: Zap },
    { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
    { name: 'WhatsApp', href: '/dashboard/whatsapp', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Community', href: '/dashboard/community', icon: Users },
    { name: 'Achievements', href: '/dashboard/achievements', icon: Award },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="grid grid-cols-5 gap-1">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors duration-200 ${
                  isActive
                    ? 'text-accent bg-accent/5'
                    : 'text-gray-600 dark:text-gray-400 hover:text-accent'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs leading-none">{item.name === 'AI Automation' ? 'AI' : item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
      } hidden md:block`}>
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 z-10 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Carbon Credits Summary */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-accent/10 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary dark:text-white">Carbon Credits</span>
                  <Award className="w-4 h-4 text-accent" />
                </div>
                <div className="text-2xl font-bold text-accent">{user?.credits || 0}</div>
                <div className="text-xs text-gray-500">
                  +{reports.filter(r => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return r.userId === user?.id && new Date(r.createdAt) > weekAgo;
                  }).reduce((sum, r) => sum + r.credits, 0)} this week
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}