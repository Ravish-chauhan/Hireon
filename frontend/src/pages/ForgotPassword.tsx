import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/authService';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import toast from 'react-hot-toast';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await authService.requestPasswordReset(data.email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          {!emailSent ? (
            <>
              <h2 className="text-3xl font-display font-bold text-center mb-2 text-primary-500">Forgot Password</h2>
              <p className="text-center text-gray-600 mb-8">Enter your email to receive a password reset link</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <button 
                  type="submit" 
                  className="w-full px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="text-green-600 text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-bold mb-4 text-primary-500">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
            </div>
          )}

          <p className="text-center mt-6 text-gray-600">
            Remember your password? <Link to="/login" className="text-accent-500 font-semibold">Back to Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;