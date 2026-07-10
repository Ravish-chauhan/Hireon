import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    // Prevent double API calls in React StrictMode
    if (hasVerified.current) {
      return;
    }
    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const data = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.error || 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-primary-500">Email Verification</h2>
          
          {!searchParams.get('token') && email && (
            <div className="text-center">
              <div className="text-accent-500 text-5xl mb-4">📧</div>
              <p className="text-gray-700 mb-4">
                We've sent a verification email to <strong>{email}</strong>. 
                Please check your inbox and click the verification link.
              </p>
              <Link
                to="/login"
                className="inline-block bg-accent-500 text-white px-6 py-2 rounded-md hover:bg-accent-600"
              >
                Go to Login
              </Link>
            </div>
          )}
          
          {searchParams.get('token') && status === 'loading' && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
              <span className="ml-2">Verifying your email...</span>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <p className="text-green-700 mb-4">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-accent-500 text-white px-6 py-2 rounded-md hover:bg-accent-600"
              >
                Continue to Login
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <div className="text-red-600 text-5xl mb-4">✗</div>
              <p className="text-red-700 mb-4">{message}</p>
              <Link
                to="/register"
                className="inline-block bg-accent-500 text-white px-6 py-2 rounded-md hover:bg-accent-600"
              >
                Try Again
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}