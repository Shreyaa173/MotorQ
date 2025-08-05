import React from 'react';
import { Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const DashboardPage = ({ stats, revenueData }) => {
  const {
    totalLockers = 0,
    availableLockers = 0,
    occupiedLockers = 0,
    maintenanceLockers = 0,
    activeSessionsCount = 0,
    todayRevenue = 0
  } = stats;

  const utilizationRate = totalLockers > 0 ? ((occupiedLockers / totalLockers) * 100).toFixed(1) : 0;

  const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle }) => (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Lockers"
          value={totalLockers}
          icon={Package}
          color="text-blue-600"
          bgColor="bg-white"
        />
        <StatCard
          title="Available"
          value={availableLockers}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-white"
          subtitle={`${((availableLockers / totalLockers) * 100).toFixed(1)}% free`}
        />
        <StatCard
          title="Occupied"
          value={occupiedLockers}
          icon={Clock}
          color="text-orange-600"
          bgColor="bg-white"
          subtitle={`${utilizationRate}% utilized`}
        />
        <StatCard
          title="Maintenance"
          value={maintenanceLockers}
          icon={AlertTriangle}
          color="text-red-600"
          bgColor="bg-white"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Sessions</p>
              <p className="text-3xl font-bold">{activeSessionsCount}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Today's Revenue</p>
              <p className="text-3xl font-bold">₹{todayRevenue}</p>
            </div>
            <Package className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Utilization Rate</p>
              <p className="text-3xl font-bold">{utilizationRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            New Check-in
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Process Check-out
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Set Maintenance
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;