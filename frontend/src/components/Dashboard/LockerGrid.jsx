import React from 'react';
import { Package, Lock, Wrench, Clock, MapPin } from 'lucide-react';

const LockerGrid = ({ lockers, onLockerClick, selectedLocker }) => {
  const getLockerIcon = (status, type) => {
    if (status === 'Maintenance') return Wrench;
    if (status === 'Occupied') return Lock;
    return Package;
  };

  const getLockerColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'Occupied':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'Maintenance':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      'Small': 'S',
      'Medium': 'M',
      'Large': 'L',
      'Special': 'SP'
    };
    return iconMap[type] || 'U';
  };

  const LockerCard = ({ locker }) => {
    const Icon = getLockerIcon(locker.status, locker.type);
    const isSelected = selectedLocker?._id === locker._id;
    
    return (
      <div
        onClick={() => onLockerClick(locker)}
        className={`
          relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
          ${getLockerColor(locker.status)}
          ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
      >
        {/* Locker Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-white bg-opacity-75 text-xs font-bold px-2 py-1 rounded-full">
            {getTypeIcon(locker.type)}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center space-y-2">
          <Icon className="h-8 w-8" />
          <div className="text-center">
            <p className="font-semibold text-sm">{locker.lockerNumber}</p>
            <p className="text-xs opacity-75">{locker.type}</p>
          </div>
          
          {/* Status Badge */}
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${locker.status === 'Available' ? 'bg-green-200 text-green-800' : ''}
            ${locker.status === 'Occupied' ? 'bg-red-200 text-red-800' : ''}
            ${locker.status === 'Maintenance' ? 'bg-yellow-200 text-yellow-800' : ''}
          `}>
            {locker.status}
          </span>

          {/* Additional Info for Occupied Lockers */}
          {locker.status === 'Occupied' && locker.currentSession && (
            <div className="text-xs text-center mt-2 p-2 bg-white bg-opacity-50 rounded">
              <div className="flex items-center justify-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(locker.currentSession.checkInTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Location Info */}
        {locker.location && (
          <div className="absolute bottom-2 left-2">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 opacity-60" />
              <span className="text-xs opacity-60">{locker.location}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!lockers || lockers.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Lockers Found</h3>
        <p className="text-gray-500">No lockers match your current filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Locker Grid ({lockers.length} lockers)
        </h3>
        
        {/* Legend */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-200 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-200 rounded-full"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {lockers.map((locker) => (
          <LockerCard key={locker._id} locker={locker} />
        ))}
      </div>

      {/* Selected Locker Info */}
      {selectedLocker && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Selected Locker Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Number:</span>
              <p>{selectedLocker.lockerNumber}</p>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Type:</span>
              <p>{selectedLocker.type}</p>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Status:</span>
              <p>{selectedLocker.status}</p>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Location:</span>
              <p>{selectedLocker.location || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockerGrid;
