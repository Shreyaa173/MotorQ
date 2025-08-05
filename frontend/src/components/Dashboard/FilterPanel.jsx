import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Download, Settings } from 'lucide-react';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onRefresh, 
  onExport, 
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleTypeChange = (type) => {
    const newTypes = filters.types?.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...(filters.types || []), type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleStatusChange = (status) => {
    const newStatuses = filters.statuses?.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...(filters.statuses || []), status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    onFiltersChange({
      search: '',
      types: [],
      statuses: [],
      location: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.types?.length > 0) count += filters.types.length;
    if (filters.statuses?.length > 0) count += filters.statuses.length;
    if (filters.location) count++;
    return count;
  };

  const lockerTypes = ['Small', 'Medium', 'Large', 'Special'];
  const lockerStatuses = ['Available', 'Occupied', 'Maintenance'];
  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            title="Advanced Filters"
          >
            <Settings className="h-4 w-4" />
          </button>
          
          <button
            onClick={onExport}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            title="Export Data"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by locker number (e.g., T1-L12)"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick Filter Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Locker Types */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Locker Type</label>
          <div className="space-y-1">
            {lockerTypes.map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types?.includes(type) || false}
                  onChange={() => handleTypeChange(type)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Locker Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="space-y-1">
            {lockerStatuses.map((status) => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.statuses?.includes(status) || false}
                  onChange={() => handleStatusChange(status)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quick Filters</label>
          <div className="space-y-1">
            <button
              onClick={() => onFiltersChange({ ...filters, statuses: ['Available'] })}
              className="w-full text-left px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
            >
              Available Only
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, statuses: ['Occupied'] })}
              className="w-full text-left px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
            >
              Occupied Only
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, statuses: ['Maintenance'] })}
              className="w-full text-left px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
            >
              Maintenance Only
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Actions</label>
          <div className="space-y-1">
            <button
              onClick={clearAllFilters}
              className="w-full text-left px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, types: lockerTypes })}
              className="w-full text-left px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
            >
              Select All Types
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Advanced Filters</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={filters.location || ''}
                onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                <option value="Terminal 1">Terminal 1</option>
                <option value="Terminal 2">Terminal 2</option>
                <option value="Terminal 3">Terminal 3</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'lockerNumber'}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lockerNumber">Locker Number</option>
                <option value="type">Locker Type</option>
                <option value="status">Status</option>
                <option value="location">Location</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filter Summary */}
      {activeFilterCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              <strong>{activeFilterCount}</strong> filter{activeFilterCount !== 1 ? 's' : ''} applied
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;