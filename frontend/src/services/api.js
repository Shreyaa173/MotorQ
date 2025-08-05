// services/api.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate request duration for debugging
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          toast.error(data.message || 'Bad request. Please check your input.');
          break;
        case 401:
          toast.error('Authentication required. Please log in.');
          // Redirect to login or clear auth token
          localStorage.removeItem('auth_token');
          // window.location.href = '/login';
          break;
        case 403:
          toast.error('Access denied. You don\'t have permission for this action.');
          break;
        case 404:
          toast.error(data.message || 'Resource not found.');
          break;
        case 409:
          toast.error(data.message || 'Conflict. Resource already exists or is in use.');
          break;
        case 422:
          toast.error(data.message || 'Validation error. Please check your input.');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        case 503:
          toast.error('Service unavailable. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An unexpected error occurred.');
      }
      
      console.error('API Response Error:', {
        status,
        message: data.message,
        url: error.config.url,
        method: error.config.method
      });
      
    } else if (error.request) {
      // Request was made but no response received
      toast.error('Network error. Please check your connection.');
      console.error('API Network Error:', error.request);
      
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common operations
export const apiHelpers = {
  // Set authentication token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Clear authentication
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Handle file downloads
  downloadFile: async (url, filename) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
      throw error;
    }
  },

  // Upload file with progress
  uploadFile: async (url, formData, onProgress) => {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      
      toast.success('File uploaded successfully');
      return response;
    } catch (error) {
      toast.error('Failed to upload file');
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: 'Service unavailable' };
    }
  },

  // Retry request with exponential backoff
  retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        console.log(`Retrying request in ${backoffDelay}ms (attempt ${attempt + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
};

export default api;