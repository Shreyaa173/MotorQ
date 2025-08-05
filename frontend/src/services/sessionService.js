// services/sessionService.js
import api from './api';

class SessionService {
  // Create new session (check-in)
  async createSession(sessionData) {
    try {
      const response = await api.post('/sessions', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  // Get session by ID
  async getSessionById(sessionId) {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session by ID:', error);
      throw error;
    }
  }

  // Get session by ticket number
  async getSessionByTicket(ticketNumber) {
    try {
      const response = await api.get(`/sessions/ticket/${ticketNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session by ticket:', error);
      throw error;
    }
  }

  // Get active session by locker
  async getActiveSessionByLocker(lockerId) {
    try {
      const response = await api.get(`/sessions/locker/${lockerId}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active session by locker:', error);
      throw error;
    }
  }

  // Get all active sessions
  async getActiveSessions() {
    try {
      const response = await api.get('/sessions/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      throw error;
    }
  }

  // Get all sessions
  async getAllSessions(page = 1, limit = 50) {
    try {
      const response = await api.get(`/sessions?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all sessions:', error);
      throw error;
    }
  }

  // Update session
  async updateSession(sessionId, updateData) {
    try {
      const response = await api.put(`/sessions/${sessionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  // End session (check-out)
  async endSession(sessionId, checkoutData = {}) {
    try {
      const response = await api.patch(`/sessions/${sessionId}/checkout`, checkoutData);
      return response.data;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  // End session by ticket (check-out)
  async endSessionByTicket(ticketNumber, checkoutData = {}) {
    try {
      const response = await api.patch(`/sessions/ticket/${ticketNumber}/checkout`, checkoutData);
      return response.data;
    } catch (error) {
      console.error('Error ending session by ticket:', error);
      throw error;
    }
  }

  // Extend session
  async extendSession(sessionId, extensionData) {
    try {
      const response = await api.patch(`/sessions/${sessionId}/extend`, extensionData);
      return response.data;
    } catch (error) {
      console.error('Error extending session:', error);
      throw error;
    }
  }

  // Cancel session
  async cancelSession(sessionId, reason = '') {
    try {
      const response = await api.patch(`/sessions/${sessionId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error canceling session:', error);
      throw error;
    }
  }

  // Calculate session cost
  async calculateSessionCost(sessionData) {
    try {
      const response = await api.post('/sessions/calculate-cost', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error calculating session cost:', error);
      throw error;
    }
  }

  // Get session cost by ID
  async getSessionCost(sessionId) {
    try {
      const response = await api.get(`/sessions/${sessionId}/cost`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session cost:', error);
      throw error;
    }
  }

  // Process payment for session
  async processPayment(sessionId, paymentData) {
    try {
      const response = await api.post(`/sessions/${sessionId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Get session payment status
  async getPaymentStatus(sessionId) {
    try {
      const response = await api.get(`/sessions/${sessionId}/payment/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }

  // Get sessions by date range
  async getSessionsByDateRange(startDate, endDate, page = 1, limit = 50) {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await api.get(`/sessions/range?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions by date range:', error);
      throw error;
    }
  }

  // Get sessions by customer
  async getSessionsByCustomer(customerInfo) {
    try {
      const response = await api.post('/sessions/customer', customerInfo);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions by customer:', error);
      throw error;
    }
  }

  // Search sessions
  async searchSessions(searchParams) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== null && searchParams[key] !== undefined && searchParams[key] !== '') {
          params.append(key, searchParams[key]);
        }
      });
      
      const response = await api.get(`/sessions/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching sessions:', error);
      throw error;
    }
  }

  // Get overdue sessions
  async getOverdueSessions() {
    try {
      const response = await api.get('/sessions/overdue');
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue sessions:', error);
      throw error;
    }
  }

  // Get session statistics
  async getSessionStats(timeframe = '7d') {
    try {
      const response = await api.get(`/sessions/stats?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session stats:', error);
      throw error;
    }
  }

  // Get revenue statistics
  async getRevenueStats(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/sessions/stats/revenue?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      throw error;
    }
  }

  // Get today's sessions
  async getTodaySessions() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/sessions/date/${today}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s sessions:', error);
      throw error;
    }
  }

  // Send notification/reminder
  async sendSessionNotification(sessionId, notificationType, customMessage = '') {
    try {
      const response = await api.post(`/sessions/${sessionId}/notify`, {
        type: notificationType,
        message: customMessage
      });
      return response.data;
    } catch (error) {
      console.error('Error sending session notification:', error);
      throw error;
    }
  }

  // Generate session receipt
  async generateReceipt(sessionId) {
    try {
      const response = await api.get(`/sessions/${sessionId}/receipt`);
      return response.data;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  }

  // Export session data
  async exportSessions(filters = {}, format = 'csv') {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/sessions/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting sessions:', error);
      throw error;
    }
  }

  // Validate ticket number
  async validateTicket(ticketNumber) {
    try {
      const response = await api.get(`/sessions/validate/${ticketNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error validating ticket:', error);
      throw error;
    }
  }

  // Get session history by locker
  async getSessionHistoryByLocker(lockerId, limit = 20) {
    try {
      const response = await api.get(`/sessions/locker/${lockerId}/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session history by locker:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateSessions(sessionIds, updateData) {
    try {
      const response = await api.patch('/sessions/bulk-update', {
        sessionIds,
        updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating sessions:', error);
      throw error;
    }
  }

  // Emergency unlock (admin only)
  async emergencyUnlock(lockerId, reason, adminId) {
    try {
      const response = await api.post(`/sessions/emergency-unlock`, {
        lockerId,
        reason,
        adminId
      });
      return response.data;
    } catch (error) {
      console.error('Error performing emergency unlock:', error);
      throw error;
    }
  }
}

// Export a single instance
export const sessionService = new SessionService();