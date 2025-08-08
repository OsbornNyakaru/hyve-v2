import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  MessageSquare, 
  Users, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Phone,
  Globe,
  Award,
  Target,
  CheckCircle,
  Clock,
  Plus,
  Send,
  Activity,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { whatsappService, CommunityGroup, CommunityChallenge, EventCoordination } from '../../lib/whatsapp-service';

export function CommunityDashboard() {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [events, setEvents] = useState<EventCoordination[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    target: '',
    unit: 'kg',
    duration: '7'
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      // Mock data for development
      setGroups([
        {
          id: 'group-001',
          name: 'Kilimani Green Club',
          whatsappGroupId: 'whatsapp-001',
          adminPhone: '+254700123456',
          adminName: 'Mary Wanjiku',
          memberCount: 45,
          totalCredits: 1250,
          weeklyTarget: 200,
          language: 'mixed',
          location: {
            area: 'Yaya Centre Area',
            coordinates: [-1.2921, 36.8219]
          },
          isActive: true,
          joinedAt: '2025-01-15T10:00:00Z',
          lastActivity: '2025-01-22T14:30:00Z'
        },
        {
          id: 'group-002',
          name: 'Eco Warriors Kilimani',
          whatsappGroupId: 'whatsapp-002',
          adminPhone: '+254700789012',
          adminName: 'John Kamau',
          memberCount: 32,
          totalCredits: 890,
          weeklyTarget: 150,
          language: 'en',
          location: {
            area: 'Kilimani Primary Area',
            coordinates: [-1.2950, 36.8200]
          },
          isActive: true,
          joinedAt: '2025-01-18T09:00:00Z',
          lastActivity: '2025-01-22T11:15:00Z'
        }
      ]);

      setChallenges([
        {
          id: 'challenge-001',
          title: 'Plastic Collection Drive',
          description: 'Collect 500kg of plastic waste',
          target: 500,
          unit: 'kg',
          startDate: '2025-01-20T00:00:00Z',
          endDate: '2025-01-27T23:59:59Z',
          participants: ['group-001', 'group-002'],
          progress: 320,
          rewards: {
            credits: 50,
            badges: ['🏆', '♻️']
          },
          isActive: true
        }
      ]);

      setEvents([
        {
          id: 'event-001',
          title: 'Community Cleanup Day',
          description: 'Join us for a neighborhood cleanup',
          date: '2025-01-25T08:00:00Z',
          location: 'Yaya Centre Parking',
          organizer: 'group-001',
          rsvpList: [
            { phone: '+254700123456', name: 'Mary W.', status: 'yes', timestamp: '2025-01-22T10:00:00Z' },
            { phone: '+254700789012', name: 'John K.', status: 'yes', timestamp: '2025-01-22T11:00:00Z' }
          ],
          remindersSent: 1
        }
      ]);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (!selectedGroup || !newChallenge.title || !newChallenge.target) return;

    try {
      const challenge = await whatsappService.createCommunityChallenge(
        selectedGroup,
        newChallenge.title,
        parseInt(newChallenge.target),
        newChallenge.unit,
        parseInt(newChallenge.duration)
      );

      if (challenge) {
        setChallenges(prev => [...prev, challenge]);
        setNewChallenge({ title: '', target: '', unit: 'kg', duration: '7' });
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!selectedGroup || !newEvent.title || !newEvent.date || !newEvent.location) return;

    try {
      const event = await whatsappService.createCommunityEvent(
        selectedGroup,
        newEvent.title,
        newEvent.description,
        newEvent.date,
        newEvent.location
      );

      if (event) {
        setEvents(prev => [...prev, event]);
        setNewEvent({ title: '', description: '', date: '', location: '' });
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const sendWeeklySummary = async (groupId: string) => {
    try {
      await whatsappService.sendWeeklySummary(groupId);
      // Show success message
    } catch (error) {
      console.error('Error sending weekly summary:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading community data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white">
            WhatsApp Communities
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage community groups and coordinate environmental initiatives
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-600 font-medium">
            {groups.filter(g => g.isActive).length} active groups
          </span>
        </div>
      </div>

      {/* Community Groups Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary dark:text-white text-sm md:text-base">
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {group.location.area}
                    </p>
                  </div>
                </div>
                <Badge variant={group.isActive ? 'default' : 'secondary'} className="text-xs">
                  {group.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-accent">{group.memberCount}</div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-accent">{group.totalCredits}</div>
                  <div className="text-xs text-gray-500">Credits</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Weekly Target</span>
                  <span className="font-medium">{group.weeklyTarget} credits</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Language</span>
                  <span className="font-medium capitalize">{group.language}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Admin</span>
                  <span className="font-medium">{group.adminName}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendWeeklySummary(group.id)}
                  className="flex-1 text-xs"
                >
                  <Send className="w-3 h-3 mr-1" />
                  Summary
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSelectedGroup(group.id)}
                  className="flex-1 text-xs"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Manage
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Challenges */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            Community Challenges
          </h2>
          <Trophy className="w-5 h-5 text-accent" />
        </div>

        <div className="space-y-4">
          {challenges.map((challenge) => {
            const progressPercent = Math.round((challenge.progress / challenge.target) * 100);
            const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={challenge.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-primary dark:text-white">{challenge.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                  </div>
                  <Badge variant={challenge.isActive ? 'default' : 'secondary'} className="text-xs">
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium">
                      {challenge.progress}/{challenge.target} {challenge.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, progressPercent)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{progressPercent}% complete</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {challenge.participants.length} participating groups
                  </div>
                  <div className="text-xs font-medium text-accent">
                    Reward: +{challenge.rewards.credits} credits
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create New Challenge */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-primary dark:text-white mb-4">Create New Challenge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Challenge title"
              value={newChallenge.title}
              onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
            />
            <div className="flex space-x-2">
              <Input
                placeholder="Target amount"
                type="number"
                value={newChallenge.target}
                onChange={(e) => setNewChallenge(prev => ({ ...prev, target: e.target.value }))}
                className="flex-1"
              />
              <Select value={newChallenge.unit} onValueChange={(value) => setNewChallenge(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="items">items</SelectItem>
                  <SelectItem value="bags">bags</SelectItem>
                  <SelectItem value="trees">trees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={newChallenge.duration} onValueChange={(value) => setNewChallenge(prev => ({ ...prev, duration: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">1 Week</SelectItem>
                <SelectItem value="14">2 Weeks</SelectItem>
                <SelectItem value="30">1 Month</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateChallenge} className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            Community Events
          </h2>
          <Calendar className="w-5 h-5 text-accent" />
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-primary dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {new Date(event.date).toLocaleDateString()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="ml-2 font-medium">{event.location}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">RSVPs:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {event.rsvpList.filter(r => r.status === 'yes').length} attending
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Organized by {groups.find(g => g.id === event.organizer)?.name}
                </div>
                <div className="text-xs text-accent">
                  {event.remindersSent} reminders sent
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create New Event */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-primary dark:text-white mb-4">Create New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Event description"
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
            />
            <Input
              placeholder="Event location"
              value={newEvent.location}
              onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
            />
            <div className="md:col-span-2">
              <Button onClick={handleCreateEvent} className="bg-accent hover:bg-accent/90 w-full md:w-auto">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* WhatsApp Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Users className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary dark:text-white">
            {groups.reduce((sum, g) => sum + g.memberCount, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Members</div>
        </Card>

        <Card className="p-4 text-center">
          <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary dark:text-white">247</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Messages Today</div>
        </Card>

        <Card className="p-4 text-center">
          <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary dark:text-white">
            {groups.reduce((sum, g) => sum + g.totalCredits, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Group Credits</div>
        </Card>

        <Card className="p-4 text-center">
          <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary dark:text-white">89%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</div>
        </Card>
      </div>

      {/* WhatsApp Setup Instructions */}
      <Card className="p-4 md:p-6">
        <h2 className="text-xl font-semibold text-primary dark:text-white mb-4">
          WhatsApp Integration Setup
        </h2>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">
                Community WhatsApp Number
              </h3>
              <div className="text-2xl font-bold text-green-600 mb-2">+254 700 HYVE (4983)</div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Community leaders can message this number to register their groups and start coordinating environmental activities.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-primary dark:text-white mb-3">For Community Leaders</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Send "Join" to register your group</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Share photos of waste for instant reporting</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Get automated credit updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Coordinate cleanup events</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-primary dark:text-white mb-3">Supported Languages</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>English (Full support)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Kiswahili (Full support)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Mixed mode (Code-switching)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}