import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { DashboardSidebar } from '../components/dashboard/sidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import { FileText, Search, Filter, MapPin, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { formatDistanceToNow } from 'date-fns';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { reports, updateReport } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <AlertTriangle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-orange-600" />;
    }
  };

  const handleStatusChange = (reportId: string, newStatus: string) => {
    updateReport(reportId, { 
      status: newStatus as any,
      resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-14 sm:pt-16 pb-16 md:pb-0">
        <DashboardSidebar />
        
        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full min-w-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary dark:text-white">
                  Waste Reports
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Manage and track all waste reports in Kilimani
                </p>
              </div>
              <Button className="bg-accent hover:bg-accent/90 w-full sm:w-auto" onClick={() => navigate('/report')}>
                New Report
              </Button>
            </div>

            {/* Filters */}
            <Card className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 sm:pl-10 text-sm"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="hazardous">Hazardous</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start">
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{filteredReports.length} of {reports.length} reports</span>
                  <span className="sm:hidden">{filteredReports.length}/{reports.length}</span>
                </div>
              </div>
            </Card>

            {/* Reports List */}
            <div className="space-y-3 sm:space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        report.status === 'resolved' 
                          ? 'bg-green-100 dark:bg-green-900/20' 
                          : report.status === 'in-progress'
                          ? 'bg-blue-100 dark:bg-blue-900/20'
                          : 'bg-orange-100 dark:bg-orange-900/20'
                      }`}>
                        {getStatusIcon(report.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-primary dark:text-white text-sm sm:text-base">
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Waste Report
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.urgency === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            report.urgency === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {report.urgency} priority
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'resolved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : report.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                          {report.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{report.location.address}</span>
                          </div>
                          <span className="hidden sm:inline">#{report.id}</span>
                          <span className="hidden md:inline">{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                          <span className="text-accent font-medium">+{report.credits} credits</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReport(report)}
                        className="flex-1 sm:flex-none"
                      >
                        <Eye className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      
                      {report.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(report.id, 'in-progress')}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Start Progress</span>
                          <span className="sm:hidden">Start</span>
                        </Button>
                      )}
                      
                      {report.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(report.id, 'resolved')}
                          className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Mark Resolved</span>
                          <span className="sm:hidden">Resolve</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredReports.length === 0 && (
                <Card className="p-8 sm:p-12 text-center">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                    No reports found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary dark:text-white">
                  Report Details
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedReport(null)}
                  size="sm"
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="font-semibold text-primary dark:text-white mb-2 text-sm sm:text-base">Report Information</h3>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div><strong>ID:</strong> {selectedReport.id}</div>
                      <div><strong>Type:</strong> {selectedReport.type}</div>
                      <div><strong>Urgency:</strong> {selectedReport.urgency}</div>
                      <div><strong>Status:</strong> {selectedReport.status}</div>
                      <div><strong>Credits:</strong> {selectedReport.credits}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-primary dark:text-white mb-2 text-sm sm:text-base">Location</h3>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div><strong>Address:</strong> {selectedReport.location.address}</div>
                      <div className="hidden sm:block"><strong>Coordinates:</strong> {selectedReport.location.coordinates.join(', ')}</div>
                      <div><strong>Submitted:</strong> {formatDistanceToNow(new Date(selectedReport.createdAt), { addSuffix: true })}</div>
                      {selectedReport.resolvedAt && (
                        <div><strong>Resolved:</strong> {formatDistanceToNow(new Date(selectedReport.resolvedAt), { addSuffix: true })}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary dark:text-white mb-2 text-sm sm:text-base">Description</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{selectedReport.description}</p>
                </div>
                
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-primary dark:text-white mb-2 text-sm sm:text-base">Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {selectedReport.images.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Report image ${index + 1}`}
                          className="w-full h-32 sm:h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedReport.status !== 'resolved' && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {selectedReport.status === 'pending' && (
                      <Button
                        onClick={() => {
                          handleStatusChange(selectedReport.id, 'in-progress');
                          setSelectedReport({ ...selectedReport, status: 'in-progress' });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                      >
                        Start Progress
                      </Button>
                    )}
                    
                    {selectedReport.status === 'in-progress' && (
                      <Button
                        onClick={() => {
                          handleStatusChange(selectedReport.id, 'resolved');
                          setSelectedReport({ ...selectedReport, status: 'resolved' });
                        }}
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}