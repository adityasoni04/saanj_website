import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getProfile } from '../services/auth';

const TOKEN_STORAGE_KEY = 'authToken';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));

  // Syncs the `token` state to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  // Use TanStack Query to fetch the user's profile
  // This query will only run if a token exists
  const { data: user, isLoading, isError, ...queryResult } = useQuery({
    queryKey: ['profile'], // The cache key
    queryFn: getProfile,   // The service function
    enabled: !!token,      // Only run if `token` is not null
    retry: 1,              // Don't retry on auth errors
  });


  const loginWithGoogle = () => {
    const popup = window.open(
      'https://saanj-backend-code.onrender.com/api/auth/google',
      // 'http://localhost:5000/api/auth/google',
      'google-login',
      'width=600,height=700'
    );

    window.addEventListener('message', (event) => {
      // Security check: ensure the message is from your backend
      // if (event.origin === 'http://localhost:5000') {
        if (event.origin === 'https://saanj-backend-code.onrender.com') {
        const { token, user } = event.data;
        if (token) {
          // 1. Set the token, which saves it to localStorage
          setToken(token);
          // 2. Instantly update the cache with the user data
          queryClient.setQueryData(['profile'], user);
          popup?.close();
        }
      }
    });
  };

  const logout = () => {
    setToken(null);
    queryClient.setQueryData(['profile'], null);
  };

  return {
    user,
    token,
    loginWithGoogle,
    logout,
    isLoading,
    isAuthenticated: !!user && !isError, // A convenient boolean
    queryResult,
  };
};