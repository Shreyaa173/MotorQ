import React, { useState, useEffect } from 'react';
import { Search, Package, User, Phone, MapPin, Clock, Filter } from 'lucide-react';

const LuggageSearch = ({ 
  onResults, 
  onSelect, 
  filterStatus = null, 
  showSelectButton = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(filterStatus || 'all');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load luggage data from storage
  const loadLuggageData = () => {
    try {
      // Try to get from window.luggageStorage first (in-memory)
      let luggageData = window.luggageStorage || [];
      
      // If not available, try localStorage
      if (luggageData.length === 0) {
        const stored = localStorage.getItem('luggageStorage');
        if (stored) {
          luggageData = JSON.parse(stored);
          window.luggageStorage = luggageData; // Cache in memory
        }
      }
      
      return luggageData;
    } catch (error) {
      console.error('Error loading luggage data:', error);
      return [];
    }
  };

  // Listen for luggage updates
  useEffect(() => {
    const handleLuggageUpdate = () => {
      if (searchTerm || statusFilter !== 'all') {
        performSearch(searchTerm, statusFilter);
      }
    };

    window.addEventListener('luggageUpdated', handleLuggageUpdate);
    return () => window.removeEventListener('luggageUpdated', handleLuggageUpdate);
  }, [searchTerm, statusFilter]);

  const performSearch = (term, status) => {
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const luggageData = loadLuggageData();
      let filteredResults = [...luggageData];

      // Filter by status
      if (status && status !== 'all') {
        filteredResults = filteredResults.filter(item => 
          item.status?.toLowerCase() === status.toLowerCase()
        );
      }

      // Filter by search term
      if (term.trim()) {
        const searchLower = term.toLowerCase().trim();
        filteredResults = filteredResults.filter(item =>
          item.tagNumber?.toLowerCase().includes(searchLower) ||
          item.ownerName?.toLowerCase().includes(searchLower) ||
          item.ownerPhone?.includes(searchLower) ||
          item.ownerEmail?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.storageLocation?.toLowerCase().includes(searchLower)
        );
      }

      // Sort by most recent first
      filteredResults.sort((a, b) => {
        const dateA = new Date(a.checkInTimestamp || a.createdAt || 0);
        const dateB = new Date(b.checkInTimestamp || b.createdAt || 0);
        return dateB - dateA;
      });

      setResults(filteredResults);
      if (onResults) {
        onResults(filteredResults);
      }
      setIsSearching(false);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchTerm, statusFilter);
  };

  const handleInputChange = (value) => {
    setSearchTerm(value);
    
    // Auto-search as user types (debounced)
    if (value.trim().length >= 2 || value.trim().length === 0) {
      performSearch(value, statusFilter);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    performSearch(searchTerm, status);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'stored': return 'text-green-600 bg-green-100';
      case 'checked-out': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search by tag number, owner name, phone, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="stored">Stored</option>
              <option value="checked-out">Checked Out</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </form>

      {/* Search Results */}
      {isSearching ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-500">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          
          <div className="space-y-3">
            {results.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <Package size={20} className="text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.tagNumber}
                        </h3>
                        <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium">{item.ownerName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{item.ownerPhone}</span>
                      </div>
                      
                      {item.storageLocation && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{item.storageLocation}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{formatDate(item.checkInTimestamp)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <div className="text-sm">
                        <span className="text-gray-600">Description:</span>
                        <p className="text-gray-900 mt-1">{item.description}</p>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {item.weight && <span>Weight: {item.weight}kg</span>}
                      {item.fees && <span>Fee: ₹{item.fees}</span>}
                      {item.hasValuables && <span className="text-orange-600">Contains valuables</span>}
                    </div>
                  </div>

                  {/* Select Button */}
                  {showSelectButton && onSelect && (
                    <div className="ml-4">
                      <button
                        onClick={() => onSelect(item)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : searchTerm || statusFilter !== 'all' ? (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filters
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search Luggage</h3>
          <p className="text-gray-500">
            Enter a tag number, owner name, or other details to search
          </p>
        </div>
      )}
    </div>
  );
};

export default LuggageSearch;