import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTokens } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refresh');

    console.log('🔍 AuthSuccess: URL params check:', {
      hasToken: !!token,
      hasRefresh: !!refreshToken,
      fullURL: window.location.href,
      searchParams: Object.fromEntries(searchParams.entries())
    });

    if (token && refreshToken) {
      console.log('🎉 OAuth Success: Processing tokens...');
      setTokens(token, refreshToken).then(() => {
        toast.success('Login successful! Welcome to EduNiaa');
        const redirectPath = sessionStorage.getItem('oauthRedirect') || '/';
        sessionStorage.removeItem('oauthRedirect');
        navigate(redirectPath, { replace: true });
      }).catch((error) => {
        console.error('❌ setTokens failed:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      });
    } else {
      console.log('❌ OAuth Success: No tokens found in URL');
      console.log('Current URL:', window.location.href);
      // Wait a bit longer before redirecting in case tokens are coming
      setTimeout(() => {
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }, 2000);
    }
  }, [searchParams, navigate, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;