// pages/Dashboard.jsx - Layout Fix with Explicit Heights
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardOverview from '../components/Dashboard/DashboardPage';
import LockerGrid from '../components/Dashboard/LockerGrid';
import FilterPanel from '../components/Dashboard/FilterPanel';
import Loading from '../components/Common/Loading';
import { lockerService } from '../services/lockerService';
import { sessionService } from '../services/sessionService';

const Dashboard = () => {
  // State Management
  const [lockers, setLockers] = useState([]);
  const [filteredLockers, setFilteredLockers] = useState([]);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [stats, setStats] = useState({
    totalLockers: 0,
    availableLockers: 0,
    occupiedLockers: 0,
    maintenanceLockers: 0,
    activeSessionsCount: 0,
    todayRevenue: 0,
    utilizationRate: 0,
    revenueData: []
  });
  const [filters, setFilters] = useState({
    search: '',
    types: [],
    statuses: [],
    location: '',
    sortBy: 'lockerNumber'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Apply filters whenever filters or lockers change
  useEffect(() => {
    applyFilters();
  }, [filters, lockers]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch lockers and stats in parallel
      const [lockersResponse, statsResponse] = await Promise.all([
        lockerService.getAllLockers(),
        lockerService.getDashboardStats()
      ]);

      // Safely extract data with fallbacks
      const lockersData = lockersResponse?.data || [];
      const statsData = statsResponse?.data || {};

      setLockers(lockersData);
      setStats({
        totalLockers: statsData.totalLockers || 0,
        availableLockers: statsData.availableLockers || 0,
        occupiedLockers: statsData.occupiedLockers || 0,
        maintenanceLockers: statsData.maintenanceLockers || 0,
        activeSessionsCount: statsData.activeSessionsCount || 0,
        todayRevenue: statsData.todayRevenue || 0,
        utilizationRate: statsData.utilizationRate || 0,
        revenueData: statsData.revenueData || []
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set default stats in case of error
      setStats({
        totalLockers: 0,
        availableLockers: 0,
        occupiedLockers: 0,
        maintenanceLockers: 0,
        activeSessionsCount: 0,
        todayRevenue: 0,
        utilizationRate: 0,
        revenueData: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchDashboardData();
      toast.success('Dashboard refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setIsRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...lockers];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(locker =>
        locker.lockerNumber?.toLowerCase().includes(searchTerm) ||
        locker.location?.toLowerCase().includes(searchTerm)
      );
    }

    // Type filter
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(locker =>
        filters.types.includes(locker.type)
      );
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(locker =>
        filters.statuses.includes(locker.status)
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(locker =>
        locker.location === filters.location
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        default:
          return (a.lockerNumber || '').localeCompare(b.lockerNumber || '');
      }
    });

    setFilteredLockers(filtered);
  };

  const handleLockerClick = async (locker) => {
    setSelectedLocker(locker);
    
    // If locker is occupied, fetch session details
    if (locker.status === 'Occupied') {
      try {
        const sessionResponse = await sessionService.getActiveSessionByLocker(locker._id);
        setSelectedLocker({
          ...locker,
          currentSession: sessionResponse?.data
        });
      } catch (error) {
        console.error('Error fetching session details:', error);
      }
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExport = async () => {
    try {
      const exportData = filteredLockers.map(locker => ({
        'Locker Number': locker.lockerNumber || 'N/A',
        'Type': locker.type || 'N/A',
        'Status': locker.status || 'N/A',
        'Location': locker.location || 'N/A',
        'Last Updated': locker.updatedAt ? new Date(locker.updatedAt).toLocaleString('en-IN') : 'N/A'
      }));

      if (exportData.length === 0) {
        toast.error('No data to export');
        return;
      }

      // Convert to CSV
      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `lockers-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Locker data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loading message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div 
      className="h-full overflow-y-auto bg-gray-50 dashboard-container"
      style={{ 
        height: 'calc(100vh - 60px)', // Adjust based on your header height
        paddingBottom: '2rem'
      }}
    >
      {/* Wrapper with explicit constraints */}
      <div className="h-full">
        {/* Container with proper spacing */}
        <div className="px-4 py-6 mx-auto" style={{ maxWidth: 'none' }}>
          
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Luggage Storage Dashboard
                </h1>
                <p className="text-gray-600">
                  Real-time locker management and monitoring
                </p>
              </div>
              
              {/* Real-time indicator */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
                <span className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard Overview - Give it more space */}
          <div className="mb-12">
            <DashboardOverview 
              stats={stats}
              revenueData={stats.revenueData}
            />
          </div>

          {/* Filter Panel - More space */}
          <div className="mb-10">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onRefresh={handleRefresh}
              onExport={handleExport}
              isLoading={isRefreshing}
            />
          </div>

          {/* Results Summary */}
          <div className="mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <strong>{filteredLockers.length}</strong> of <strong>{lockers.length}</strong> lockers
                  {filters.search && (
                    <span> matching "<strong>{filters.search}</strong>"</span>
                  )}
                </div>
                
                {selectedLocker && (
                  <button
                    onClick={() => setSelectedLocker(null)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Locker Grid - Ensure it has space */}
          <div className="mb-12" style={{ minHeight: '400px' }}>
            <LockerGrid
              lockers={filteredLockers}
              onLockerClick={handleLockerClick}
              selectedLocker={selectedLocker}
            />
          </div>

          {/* Quick Stats Footer */}
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.availableLockers || 0}
                </div>
                <div className="text-sm text-gray-600">Available Now</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.occupiedLockers || 0}
                </div>
                <div className="text-sm text-gray-600">Currently Occupied</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.activeSessionsCount || 0}
                </div>
                <div className="text-sm text-gray-600">Active Sessions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ₹{stats.todayRevenue || 0}
                </div>
                <div className="text-sm text-gray-600">Today's Revenue</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;