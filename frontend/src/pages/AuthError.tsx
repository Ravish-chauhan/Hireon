import { Link, useSearchParams } from 'react-router-dom';

const AuthError = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  
  const getErrorContent = () => {
    if (reason === 'registration_required') {
      return {
        icon: '📝',
        title: 'Registration Required',
        message: 'Please register first before using Google login. We only allow existing users to login with Google.',
        buttonText: 'Register Now',
        buttonLink: '/register'
      };
    }
    
    return {
      icon: '❌',
      title: 'Authentication Failed',
      message: 'There was an error during the authentication process. Please try again.',
      buttonText: 'Back to Login',
      buttonLink: '/login'
    };
  };
  
  const { icon, title, message, buttonText, buttonLink } = getErrorContent();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-y-3">
          <Link 
            to={buttonLink}
            className="block bg-accent-500 text-white px-6 py-2 rounded-md hover:bg-accent-600"
          >
            {buttonText}
          </Link>
          {reason === 'registration_required' && (
            <Link 
              to="/login"
              className="block bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthError;