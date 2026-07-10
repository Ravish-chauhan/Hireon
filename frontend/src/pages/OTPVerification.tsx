import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { tempToken, email } = location.state || {};

  if (!tempToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-6 text-primary-500">Invalid Access</h2>
            <p className="text-gray-600 mb-4">Please register first to verify your email address.</p>
            <Link to="/register" className="inline-block bg-accent-500 text-white px-6 py-2 rounded-md hover:bg-accent-600">
              Go to Register
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyRegistrationOTP(tempToken, otp);
      toast.success('Registration completed successfully! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      const response = await authService.resendRegistrationOTP(tempToken);
      toast.success('New OTP sent successfully');
      // Update tempToken if needed
      if (response.tempToken) {
        location.state.tempToken = response.tempToken;
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-primary-500">Verify Email Address</h2>
          
          <div className="text-accent-500 text-5xl mb-4">📧</div>
          <p className="text-gray-700 mb-6">
            We've sent a 6-digit OTP to <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button 
              type="submit" 
              className="w-full px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-gray-600">Didn't receive the OTP?</p>
            <button
              onClick={handleResendOTP}
              disabled={resending}
              className="text-accent-500 hover:text-accent-600 transition"
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>

          <p className="text-center mt-6 text-gray-600">
            Want to change your details? <Link to="/register" className="text-accent-500 font-semibold">Go back</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OTPVerification;