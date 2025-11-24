import axios, { AxiosInstance, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';
import { ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const session = await getSession();
          if (session?.user) {
            // Add token if available from session
            // config.headers.Authorization = `Bearer ${session.user.token}`;
          }
        } catch (error) {
          console.error('Failed to get session:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          statusCode: error.response?.status,
          error: error.response?.data?.error || error.code,
        };

        // Handle specific status codes
        if (error.response?.status === 401) {
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  get instance() {
    return this.axiosInstance;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
