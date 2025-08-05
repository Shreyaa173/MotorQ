import React, { useState, useEffect } from 'react';
import { Search, Filter, PackageOpen, User, Calendar, MapPin, Phone, Clock } from 'lucide-react';

const LuggageSearch = ({ onResults, filterStatus, showSelectButton = false, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('tagNumber');
  const [statusFilter, setStatusFilter] = useState(filterStatus || 'all');
  const [dateFilter, setDateFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockLuggageData = [
    {
      tagNumber: 'LUG-001',
      ownerName: 'Shreya Gupta',
      ownerPhone: '+1234567890',
      ownerEmail: 'john.doe@email.com',
      checkInDate: '2024-01-15',
      checkInTime: '10:30 AM',
      checkOutDate: null,
      checkOutTime: null,
      storageLocation: 'A-15',
      status: 'stored',
      description: 'Large black suitcase with wheels',
      fees: 300.00,
      specialInstructions: 'Handle with care - fragile items',
      weight: '23kg'
    },
    {
      tagNumber: 'LUG-002',
      ownerName: 'Shreya Gupta',
      ownerPhone: '+1987654321',
      ownerEmail: 'jane.smith@email.com',
      checkInDate: '2024-01-14',
      checkInTime: '2:15 PM',
      checkOutDate: '2024-01-15',
      checkOutTime: '11:45 AM',
      storageLocation: 'B-08',
      status: 'checked_out',
      description: 'Medium blue backpack',
      fees: 100.00,
      specialInstructions: null,
      weight: '8kg'
    },
    {
      tagNumber: 'LUG-003',
      ownerName: 'Shreya Gupta',
      ownerPhone: '+1122334455',
      ownerEmail: 'mike.johnson@email.com',
      checkInDate: '2024-01-16',
      checkInTime: '9:00 AM',
      checkOutDate: null,
      checkOutTime: null,
      storageLocation: 'C-22',
      status: 'stored',
      description: 'Red travel bag',
      fees: 200.00,
      specialInstructions: 'Owner prefers morning pickup',
      weight: '15kg'
    },
    {
      tagNumber: 'LUG-004',
      ownerName: 'Shreya Gupta',
      ownerPhone: '+1555666777',
      ownerEmail: 'sarah.wilson@email.com',
      checkInDate: '2024-01-13',
      checkInTime: '4:30 PM',
      checkOutDate: null,
      checkOutTime: null,
      storageLocation: 'A-03',
      status: 'overdue',
      description: 'Small green duffel bag',
      fees: 200.00,
      specialInstructions: null,
      weight: '12kg'
    }
  ];

  const performSearch = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filteredResults = mockLuggageData;

      // Apply search query filter
      if (searchQuery.trim()) {
        filteredResults = filteredResults.filter(item => {
          switch (searchType) {
            case 'tagNumber':
              return item.tagNumber.toLowerCase().includes(searchQuery.toLowerCase());
            case 'ownerName':
              return item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
            case 'ownerPhone':
              return item.ownerPhone.includes(searchQuery);
            case 'ownerEmail':
              return item.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
            default:
              return true;
          }
        });
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filteredResults = filteredResults.filter(item => item.status === statusFilter);
      }

      // Apply date filter
      if (dateFilter !== 'all') {
        const today = new Date();
        const itemDate = new Date(filteredResults.checkInDate);
        
        switch (dateFilter) {
          case 'today':
            filteredResults = filteredResults.filter(item => {
              const checkInDate = new Date(item.checkInDate);
              return checkInDate.toDateString() === today.toDateString();
            });
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredResults = filteredResults.filter(item => {
              const checkInDate = new Date(item.checkInDate);
              return checkInDate >= weekAgo;
            });
            break;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredResults = filteredResults.filter(item => {
              const checkInDate = new Date(item.checkInDate);
              return checkInDate >= monthAgo;
            });
            break;
        }
      }

      setResults(filteredResults);
      if (onResults) {
        onResults(filteredResults);
      }
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    performSearch();
  }, [statusFilter, dateFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'stored':
        return 'bg-green-100 text-green-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'stored':
        return 'Stored';
      case 'checked_out':
        return 'Checked Out';
      case 'overdue':
        return 'Overdue';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search term..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="tagNumber">Tag Number</option>
            <option value="ownerName">Owner Name</option>
            <option value="ownerPhone">Phone Number</option>
            <option value="ownerEmail">Email</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Searching...
              </>
            ) : (
              <>
                <Search size={16} />
                Search
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="stored">Stored</option>
              <option value="checked_out">Checked Out</option>
              <option value="overdue">Overdue</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </form>

      {/* Results */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="space-y-3">
              {results.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <PackageOpen className="h-10 w-10 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{item.tagNumber}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User size={14} />
                              <span>{item.ownerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              <span>{item.ownerPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span>Location: {item.storageLocation}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>Check-in: {item.checkInDate} at {item.checkInTime}</span>
                            </div>
                            {item.checkOutDate && (
                              <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>Check-out: {item.checkOutDate} at {item.checkOutTime}</span>
                              </div>
                            )}
                            <div className="text-sm">
                              <span className="font-medium">Fees: ₹{item.fees.toFixed(2)}</span>
                              <span className="ml-3">Weight: {item.weight}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600">
                          <p><span className="font-medium">Description:</span> {item.description}</p>
                          {item.specialInstructions && (
                            <p className="mt-1"><span className="font-medium">Instructions:</span> {item.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {showSelectButton && onSelect && (
                      <div className="ml-4">
                        <button
                          onClick={() => onSelect(item)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          Select
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <PackageOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuggageSearch;