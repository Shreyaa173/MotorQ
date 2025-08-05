// services/lockerService.js
import api from './api';

class LockerService {
  // Get all lockers
  async getAllLockers() {
    try {
      const response = await api.get('/lockers');
      return response.data;
    } catch (error) {
      console.error('Error fetching all lockers:', error);
      throw error;
    }
  }

  // Get locker by ID
  async getLockerById(lockerId) {
    try {
      const response = await api.get(`/lockers/${lockerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching locker by ID:', error);
      throw error;
    }
  }

  // Get locker by number
  async getLockerByNumber(lockerNumber) {
    try {
      const response = await api.get(`/lockers/number/${lockerNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching locker by number:', error);
      throw error;
    }
  }

  // Get lockers by status
  async getLockersByStatus(status) {
    try {
      const response = await api.get(`/lockers/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lockers by status:', error);
      throw error;
    }
  }

  // Get lockers by type
  async getLockersByType(type) {
    try {
      const response = await api.get(`/lockers/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lockers by type:', error);
      throw error;
    }
  }

  // Get available lockers
  async getAvailableLockers(type = null, location = null) {
    try {
      let endpoint = '/lockers/available';
      const params = new URLSearchParams();
      
      if (type) params.append('type', type);
      if (location) params.append('location', location);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching available lockers:', error);
      throw error;
    }
  }

  // Create new locker
  async createLocker(lockerData) {
    try {
      const response = await api.post('/lockers', lockerData);
      return response.data;
    } catch (error) {
      console.error('Error creating locker:', error);
      throw error;
    }
  }

  // Update locker
  async updateLocker(lockerId, updateData) {
    try {
      const response = await api.put(`/lockers/${lockerId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating locker:', error);
      throw error;
    }
  }

  // Update locker status
  async updateLockerStatus(lockerId, status, reason = '') {
    try {
      const response = await api.patch(`/lockers/${lockerId}/status`, {
        status,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error updating locker status:', error);
      throw error;
    }
  }

  // Set locker to maintenance
  async setLockerMaintenance(lockerId, maintenanceData) {
    try {
      const response = await api.post(`/lockers/${lockerId}/maintenance`, maintenanceData);
      return response.data;
    } catch (error) {
      console.error('Error setting locker maintenance:', error);
      throw error;
    }
  }

  // Remove locker from maintenance
  async removeLockerMaintenance(lockerId) {
    try {
      const response = await api.delete(`/lockers/${lockerId}/maintenance`);
      return response.data;
    } catch (error) {
      console.error('Error removing locker maintenance:', error);
      throw error;
    }
  }

  // Delete locker
  async deleteLocker(lockerId) {
    try {
      const response = await api.delete(`/lockers/${lockerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting locker:', error);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/lockers/stats/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data in case of error for development
      return {
        data: {
          totalLockers: 44,
          availableLockers: 24,
          occupiedLockers: 18,
          maintenanceLockers: 2,
          activeSessionsCount: 18,
          todayRevenue: 2450,
          utilizationRate: 40.9,
          revenueData: []
        }
      };
    }
  }

  // Get locker utilization stats
  async getUtilizationStats(timeframe = '7d') {
    try {
      const response = await api.get(`/lockers/stats/utilization?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching utilization stats:', error);
      throw error;
    }
  }

  // Get revenue stats
  async getRevenueStats(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/lockers/stats/revenue?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      throw error;
    }
  }

  // Get locker maintenance history
  async getMaintenanceHistory(lockerId) {
    try {
      const response = await api.get(`/lockers/${lockerId}/maintenance/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
      throw error;
    }
  }

  // Get locker usage history
  async getLockerUsageHistory(lockerId, limit = 50) {
    try {
      const response = await api.get(`/lockers/${lockerId}/usage?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching locker usage history:', error);
      throw error;
    }
  }

  // Search lockers with filters
  async searchLockers(searchParams) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== null && searchParams[key] !== undefined && searchParams[key] !== '') {
          if (Array.isArray(searchParams[key])) {
            searchParams[key].forEach(value => params.append(key, value));
          } else {
            params.append(key, searchParams[key]);
          }
        }
      });
      
      const response = await api.get(`/lockers/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching lockers:', error);
      throw error;
    }
  }

  // Get locker pricing
  async getLockerPricing(type, duration = null) {
    try {
      let endpoint = `/lockers/pricing/${type}`;
      if (duration) {
        endpoint += `?duration=${duration}`;
      }
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching locker pricing:', error);
      throw error;
    }
  }

  // Reserve locker
  async reserveLocker(lockerId, reservationData) {
    try {
      const response = await api.post(`/lockers/${lockerId}/reserve`, reservationData);
      return response.data;
    } catch (error) {
      console.error('Error reserving locker:', error);
      throw error;
    }
  }

  // Cancel locker reservation
  async cancelReservation(lockerId) {
    try {
      const response = await api.delete(`/lockers/${lockerId}/reserve`);
      return response.data;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  }

  // Bulk update lockers
  async bulkUpdateLockers(lockerIds, updateData) {
    try {
      const response = await api.patch('/lockers/bulk-update', {
        lockerIds,
        updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating lockers:', error);
      throw error;
    }
  }

  // Get system health
  async getSystemHealth() {
    try {
      const response = await api.get('/lockers/system/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }
}

// Export a single instance
export const lockerService = new LockerService();