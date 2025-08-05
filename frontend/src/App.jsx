import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';
// import Analytics from './pages/Analytics';
// import Maintenance from './pages/Maintenance';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Main App Routes */}
        <Routes>
          {/* Layout wrapper for all pages */}
          <Route path="/" element={<Layout />}>
            {/* Dashboard - Default route */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Luggage Operations */}
            <Route path="checkin" element={<CheckIn />} />
            <Route path="checkout" element={<CheckOut />} />
            
            {/* Analytics & Reports
            <Route path="analytics" element={<Analytics />} /> */}
            
            {/* Maintenance */}
            {/* <Route path="maintenance" element={<Maintenance />} /> */}
            
            {/* Redirect unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
