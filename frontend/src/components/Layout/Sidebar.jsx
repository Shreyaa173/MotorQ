import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LogIn, 
  LogOut, 
  BarChart3, 
  Settings, 
  Package,
  X,
  Clock,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview & Statistics'
    },
    {
      name: 'Check-In',
      href: '/checkin',
      icon: LogIn,
      description: 'New Luggage Storage'
    },
    {
      name: 'Check-Out',
      href: '/checkout',
      icon: LogOut,
      description: 'Retrieve Luggage'
    },
    // {
    //   name: 'Analytics',
    //   href: '/analytics',
    //   icon: BarChart3,
    //   description: 'Reports & Insights'
    // },
    // {
    //   name: 'Maintenance',
    //   href: '/maintenance',
    //   icon: Settings,
    //   description: 'Locker Management'
    // }
  ];

   return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">LuggageHub</h1>
              <p className="text-xs text-gray-500">Airport Storage</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-600">
                    {item.description}
                  </div>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>System Status: Online</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Last sync: {new Date().toLocaleTimeString('en-IN')}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;