import React from 'react';
import { Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const LockerGrid = ({ lockers, onLockerClick, selectedLocker }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      case 'Occupied':
        return 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200';
      case 'Maintenance':
        return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return <CheckCircle size={16} />;
      case 'Occupied':
        return <Package size={16} />;
      case 'Maintenance':
        return <AlertTriangle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getSizeIndicator = (type) => {
    switch (type) {
      case 'Small':
        return 'S';
      case 'Medium':
        return 'M';
      case 'Large':
        return 'L';
      default:
        return 'M';
    }
  };

  if (!lockers || lockers.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Lockers Found</h3>
        <p className="text-gray-600">No lockers match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Locker Grid</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span>Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
          {lockers.map((locker) => (
            <div
              key={locker._id || locker.lockerNumber}
              onClick={() => onLockerClick && onLockerClick(locker)}
              className={`
                relative aspect-square rounded-lg border-2 cursor-pointer transition-all duration-200
                flex flex-col items-center justify-center p-2 text-xs font-medium
                ${getStatusColor(locker.status)}
                ${selectedLocker && selectedLocker._id === locker._id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              `}
              title={`${locker.lockerNumber} - ${locker.status} (${locker.type})`}
            >
              {/* Status Icon */}
              <div className="mb-1">
                {getStatusIcon(locker.status)}
              </div>
              
              {/* Locker Number */}
              <div className="text-center leading-tight">
                <div className="font-semibold">
                  {locker.lockerNumber?.split('-').pop() || locker.lockerNumber}
                </div>
                
                {/* Size indicator */}
                <div className="text-xs opacity-75">
                  {getSizeIndicator(locker.type)}
                </div>
              </div>

              {/* Occupied indicator with owner info */}
              {locker.status === 'Occupied' && locker.currentLuggage && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white">
                  <Clock size={8} className="text-white absolute top-0.5 left-0.5" />
                </div>
              )}

              {/* Selection indicator */}
              {selectedLocker && selectedLocker._id === locker._id && (
                <div className="absolute inset-0 rounded-lg bg-blue-500 bg-opacity-20 pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Selected Locker Details */}
        {selectedLocker && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">Selected Locker Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Locker:</span>
                <span className="ml-2 font-medium">{selectedLocker.lockerNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{selectedLocker.type}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 font-medium ${
                  selectedLocker.status === 'Available' ? 'text-green-600' :
                  selectedLocker.status === 'Occupied' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {selectedLocker.status}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 font-medium">{selectedLocker.location}</span>
              </div>
              
              {selectedLocker.status === 'Occupied' && selectedLocker.currentLuggage && (
                <>
                  <div className="md:col-span-2 border-t border-gray-200 pt-3 mt-2">
                    <h5 className="font-medium text-gray-900 mb-2">Current Luggage</h5>
                  </div>
                  <div>
                    <span className="text-gray-600">Owner:</span>
                    <span className="ml-2 font-medium">{selectedLocker.currentLuggage.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tag:</span>
                    <span className="ml-2 font-medium">{selectedLocker.currentLuggage.tagNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <span className="ml-2 font-medium">
                      {selectedLocker.currentLuggage.checkInDate} {selectedLocker.currentLuggage.checkInTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{selectedLocker.currentLuggage.ownerPhone}</span>
                  </div>
                  {selectedLocker.currentLuggage.description && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Description:</span>
                      <span className="ml-2">{selectedLocker.currentLuggage.description}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LockerGrid;