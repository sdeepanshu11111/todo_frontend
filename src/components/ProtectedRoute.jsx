import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Verify token with backend
        await api.get('/auth/verify');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}