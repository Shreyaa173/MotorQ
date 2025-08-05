import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardOverview from '../components/Dashboard/DashboardPage';
import FilterPanel from '../components/Dashboard/FilterPanel';
import Loading from '../components/Common/Loading';

const Dashboard = () => {
  // State Management
  const [lockers, setLockers] = useState([]);
  const [filteredLockers, setFilteredLockers] = useState([]);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [luggageData, setLuggageData] = useState([]);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [stats, setStats] = useState({
    totalLockers: 100,
    availableLockers: 0,
    occupiedLockers: 0,
    maintenanceLockers: 5,
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

  // Load luggage data from localStorage
  const loadLuggageData = () => {
    try {
      const stored = localStorage.getItem('luggageStorage');
      const data = stored ? JSON.parse(stored) : [];
      setLuggageData(data);
      window.luggageStorage = data; // Sync with global variable
      
      // Get recent check-ins (last 10, sorted by most recent)
      const recent = data
        .filter(item => item.status === 'stored')
        .sort((a, b) => new Date(b.checkInDate + ' ' + (b.checkInTime || '00:00')) - new Date(a.checkInDate + ' ' + (a.checkInTime || '00:00')))
        .slice(0, 10);
      setRecentCheckIns(recent);
      
      return data;
    } catch (error) {
      console.error('Error loading luggage data:', error);
      return [];
    }
  };

  // Calculate stats from luggage data
  const calculateStats = (luggage) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Filter active (stored) luggage
    const activeLuggage = luggage.filter(item => item.status === 'stored');
    
    // Calculate today's revenue
    const todayRevenue = luggage
      .filter(item => item.checkInDate === today)
      .reduce((sum, item) => sum + (parseFloat(item.fees) || 0), 0);

    // Generate revenue data for the last 7 days
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dailyRevenue = luggage
        .filter(item => item.checkInDate === dateStr)
        .reduce((sum, item) => sum + (parseFloat(item.fees) || 0), 0);
      
      revenueData.push({
        date: dateStr,
        revenue: dailyRevenue
      });
    }

    const totalLockers = 100; // Your total locker capacity
    const occupiedLockers = activeLuggage.length;
    const availableLockers = totalLockers - occupiedLockers - 5; // 5 maintenance lockers
    const utilizationRate = totalLockers > 0 ? ((occupiedLockers / totalLockers) * 100) : 0;

    return {
      totalLockers,
      availableLockers: Math.max(0, availableLockers),
      occupiedLockers,
      maintenanceLockers: 5,
      activeSessionsCount: activeLuggage.length,
      todayRevenue: Math.round(todayRevenue),
      utilizationRate: Math.round(utilizationRate * 10) / 10,
      revenueData
    };
  };

  // Generate virtual lockers based on luggage data (kept for compatibility)
  const generateVirtualLockers = (luggage) => {
    const mockLockers = [];
    const totalLockers = 100;
    const occupiedLocations = {};
    
    // Map occupied lockers from luggage data
    luggage
      .filter(item => item.status === 'stored')
      .forEach(item => {
        if (item.storageLocation) {
          occupiedLocations[item.storageLocation] = item;
        }
      });

    // Generate locker grid
    const sections = ['A', 'B', 'C'];
    const shelvesPerSection = Math.ceil(totalLockers / (sections.length * 10));
    
    let lockerCount = 0;
    for (const section of sections) {
      for (let shelf = 1; shelf <= shelvesPerSection && lockerCount < totalLockers; shelf++) {
        for (let pos = 1; pos <= 10 && lockerCount < totalLockers; pos++) {
          const lockerNumber = `${section}-${shelf.toString().padStart(2, '0')}-${pos.toString().padStart(2, '0')}`;
          const locationKey = `${section}-${shelf.toString().padStart(2, '0')}`;
          
          let status = 'Available';
          let currentLuggage = null;
          
          // Check if this location is occupied
          if (occupiedLocations[locationKey]) {
            status = 'Occupied';
            currentLuggage = occupiedLocations[locationKey];
          }
          
          // Add some maintenance lockers
          if (lockerCount < 5) {
            status = 'Maintenance';
          }

          mockLockers.push({
            _id: `locker_${lockerCount}`,
            lockerNumber,
            type: pos <= 3 ? 'Small' : pos <= 7 ? 'Medium' : 'Large',
            status,
            location: `Station ${section}`,
            section,
            shelf,
            position: pos,
            storageLocation: locationKey,
            currentLuggage,
            updatedAt: new Date().toISOString()
          });
          
          lockerCount++;
        }
      }
    }

    return mockLockers;
  };

  // Fetch and calculate dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load luggage data from localStorage
      const luggage = loadLuggageData();
      
      // Generate virtual lockers
      const virtualLockers = generateVirtualLockers(luggage);
      setLockers(virtualLockers);

      // Calculate stats
      const calculatedStats = calculateStats(luggage);
      setStats(calculatedStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for luggage updates
  useEffect(() => {
    const handleLuggageUpdate = (event) => {
      console.log('Luggage updated:', event.detail);
      // Refresh dashboard data when luggage is updated
      fetchDashboardData();
      
      // Show appropriate toast message
      if (event.detail.type === 'checkin') {
        toast.success(`Luggage checked in - Tag: ${event.detail.data.tagNumber}`);
      } else if (event.detail.type === 'checkout') {
        toast.success(`Luggage checked out - Tag: ${event.detail.data.tagNumber}`);
      }
    };

    window.addEventListener('luggageUpdated', handleLuggageUpdate);
    
    return () => {
      window.removeEventListener('luggageUpdated', handleLuggageUpdate);
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Apply filters whenever filters or lockers change
  useEffect(() => {
    applyFilters();
  }, [filters, lockers]);

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
        locker.location?.toLowerCase().includes(searchTerm) ||
        locker.currentLuggage?.ownerName?.toLowerCase().includes(searchTerm) ||
        locker.currentLuggage?.tagNumber?.toLowerCase().includes(searchTerm)
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

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExport = async () => {
    try {
      const exportData = [];
      
      // Export recent check-ins data
      recentCheckIns.forEach(item => {
        exportData.push({
          'Tag Number': item.tagNumber || 'N/A',
          'Owner Name': item.ownerName || 'N/A',
          'Phone': item.ownerPhone || 'N/A',
          'Check-in Date': item.checkInDate || 'N/A',
          'Check-in Time': item.checkInTime || 'N/A',
          'Storage Location': item.storageLocation || 'N/A',
          'Luggage Size': item.luggageSize || 'N/A',
          'Fees': `₹${item.fees || 0}`,
          'Status': item.status || 'N/A'
        });
      });

      if (exportData.length === 0) {
        toast.error('No data to export');
        return;
      }

      // Convert to CSV
      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `recent-checkins-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Recent check-ins data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const formatDateTime = (date, time) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date + (time ? ` ${time}` : ''));
    return dateObj.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'stored': 'bg-green-100 text-green-800 border-green-200',
      'retrieved': 'bg-gray-100 text-gray-800 border-gray-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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
        height: 'calc(100vh - 60px)',
        paddingBottom: '2rem'
      }}
    >
      <div className="h-full">
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

          {/* Dashboard Overview */}
          <div className="mb-12">
            <DashboardOverview 
              stats={stats}
              revenueData={stats.revenueData}
            />
          </div>

          {/* Filter Panel */}
          {/* <div className="mb-10">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onRefresh={handleRefresh}
              onExport={handleExport}
              isLoading={isRefreshing}
            />
          </div> */}

          {/* Recent Check-ins Section */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Recent Check-ins</h2>
                    <p className="text-sm text-gray-600 mt-1">Latest luggage storage activities</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {recentCheckIns.length} active items
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {recentCheckIns.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No recent check-ins</p>
                    <p className="text-gray-400 text-sm">Check-ins will appear here once customers store their luggage</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tag Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-in Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fees
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentCheckIns.map((item, index) => (
                        <tr key={item.tagNumber || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.tagNumber || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.ownerName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{item.ownerPhone || 'No phone'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(item.checkInDate, item.checkInTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.storageLocation || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.luggageSize || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{item.fees || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(item.status)}`}>
                              {item.status || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              {recentCheckIns.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {recentCheckIns.length} most recent check-ins
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Footer */}
          

        </div>
      </div>
    </div>
  );
};

export default Dashboard;