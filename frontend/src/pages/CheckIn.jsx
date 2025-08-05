import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Package, FileText, Camera, QrCode } from 'lucide-react';
import CheckInForm from '../components/Luggage/CheckInForm';
import LuggageSearch from '../components/Luggage/LuggageSearch';

const CheckIn = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [searchResults, setSearchResults] = useState([]);
  const [recentCheckIns, setRecentCheckIns] = useState([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recent_checkins') || '[]');
    setRecentCheckIns(recent.slice(0, 5));
  }, []);

  const handleCheckInSuccess = (checkInData) => {
    const updatedRecent = [checkInData, ...recentCheckIns].slice(0, 5);
    setRecentCheckIns(updatedRecent);
    localStorage.setItem('recent_checkins', JSON.stringify(updatedRecent));
    
    toast.success(`Luggage checked in successfully! Tag: ${checkInData.tagNumber}`);
  };

  const tabs = [
    { id: 'checkin', label: 'New Check-in', icon: Package },
    { id: 'search', label: 'Search Luggage', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="text-blue-600" size={32} />
                Luggage Check-In
              </h1>
              <p className="text-gray-600 mt-2">Register new luggage and manage existing items</p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-white rounded-lg shadow p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-blue-600">127</div>
                <div className="text-sm text-gray-600">Today's Check-ins</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-green-600">892</div>
                <div className="text-sm text-gray-600">Active Storage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-3">
            {activeTab === 'checkin' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">New Luggage Check-In</h2>
                  <p className="text-gray-600 mt-1">Fill in the details to register new luggage</p>
                </div>
                <div className="p-6">
                  <CheckInForm onSuccess={handleCheckInSuccess} />
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Search Luggage</h2>
                    <p className="text-gray-600 mt-1">Find existing luggage records</p>
                  </div>
                  <div className="p-6">
                    <LuggageSearch onResults={setSearchResults} />
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {searchResults.map((item, index) => (
                        <div key={index} className="p-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.tagNumber}</p>
                                <p className="text-sm text-gray-500">{item.ownerName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-900">{item.status}</p>
                              <p className="text-sm text-gray-500">{item.checkInDate}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Check-ins */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Check-ins</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentCheckIns.length > 0 ? (
                  recentCheckIns.map((item, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.tagNumber}</p>
                          <p className="text-sm text-gray-500">{item.ownerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{item.checkInTime}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <Package className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm">No recent check-ins</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
                  <FileText size={18} className="text-gray-400" />
                  Generate Report
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
                  <Camera size={18} className="text-gray-400" />
                  Take Photo
                </button>
              </div>
            </div>

            {/* Daily Summary */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Today's Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Check-ins</span>
                  <span className="text-sm font-medium text-green-600">+127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Peak Hour</span>
                  <span className="text-sm font-medium">2:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Processing</span>
                  <span className="text-sm font-medium">3.2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
