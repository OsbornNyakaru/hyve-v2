import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { DashboardSidebar } from '../components/dashboard/sidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { User, Edit, Save, X } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { formatDistanceToNow } from 'date-fns';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const { user: storeUser, reports, setUser } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (!clerkUser) {
      navigate('/login');
    } else if (storeUser) {
      setEditData({
        name: storeUser.name,
        email: storeUser.email
      });
    }
  }, [clerkUser, storeUser, navigate]);

  const userReports = reports.filter(r => r.userId === storeUser?.id);
  const totalCredits = userReports.reduce((sum, r) => sum + r.credits, 0);
  const resolvedReports = userReports.filter(r => r.status === 'resolved').length;

  const handleSave = () => {
    if (storeUser) {
      setUser({
        ...storeUser,
        name: editData.name,
        email: editData.email
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (storeUser) {
      setEditData({
        name: storeUser.name,
        email: storeUser.email
      });
    }
    setIsEditing(false);
  };

  if (!clerkUser || !storeUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-16">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary dark:text-white">
                Profile
              </h1>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Profile Card */}
            <Card className="p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-accent" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Full Name"
                      />
                      <Input
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email Address"
                        type="email"
                      />
                      <div className="flex space-x-3">
                        <Button onClick={handleSave} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
                        {storeUser.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {storeUser.email}
                      </p>
                      <p className="text-accent font-medium">
                        {storeUser.credits > 200 ? 'Environmental Champion' : 
                         storeUser.credits > 100 ? 'Eco Warrior' : 
                         'Community Member'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">{storeUser.credits}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Carbon Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary dark:text-white mb-1">{storeUser.reportsCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reports Filed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{resolvedReports}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Issues Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{storeUser.badges.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
                </div>
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary dark:text-white mb-4">
                Achievements & Badges
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {storeUser.badges.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-4xl mb-2">{badge}</div>
                    <div className="text-sm font-medium text-primary dark:text-white">
                      {badge === '🏆' ? 'Top Contributor' :
                       badge === '♻️' ? 'Recycling Hero' :
                       badge === '🌱' ? 'Green Pioneer' : 'Achievement'}
                    </div>
                  </div>
                ))}
                
                {storeUser.badges.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No badges earned yet. Keep reporting to unlock achievements!
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-primary dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {userReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-primary dark:text-white">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)} waste reported
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {report.location.address} • {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="text-accent font-medium">
                      +{report.credits} credits
                    </div>
                  </div>
                ))}
                
                {userReports.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No activity yet. Start by submitting your first waste report!
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}