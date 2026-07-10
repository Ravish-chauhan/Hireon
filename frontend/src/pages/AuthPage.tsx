import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { ArrowRightIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { seoConfig } from '../config/seoConfig'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const AuthPage = () => {
  const location = useLocation()
  const [isSignUp, setIsSignUp] = useState(false)
  const { login, register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  console.log('AuthPage location.state:', location.state) // Debug log

  useEffect(() => {
    setIsSignUp(location.pathname === '/register')
  }, [location.pathname])

  const loginForm = useForm<LoginForm>()
  const registerForm = useForm<RegisterForm>()

  const handleLoginSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      await login(data.email, data.password, data.rememberMe)
      const from = location.state?.from || '/'
      console.log('Redirecting to:', from) // Debug log
      navigate(from, { replace: true })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      await registerUser(data)
      const from = location.state?.from || '/'
      navigate(from, { replace: true })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{seoConfig.auth.title}</title>
        <meta name="description" content={seoConfig.auth.description} />
        <meta name="keywords" content={seoConfig.auth.keywords} />
        <link rel="canonical" href={seoConfig.auth.canonical} />
      </Helmet>
      <style>
        {`
          input::placeholder {
            color: rgba(202, 196, 196, 1) !important;
          }
        `}
      </style>
      <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content */}
      <div className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center max-w-7xl mx-auto">
            {/* Left Side - Info Card - Hidden on small screens */}
            <div 
              className="hidden lg:flex rounded-[20px] p-6 md:p-[42px_35px] flex-col w-full relative overflow-hidden items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0D0A6A 0%, #110EAB 100%)',
                width: window.innerWidth >= 1440 ? '612px' : 'auto',
                height: window.innerWidth >= 1440 ? (isSignUp ? '632px' : '582px') : 'auto',
                maxWidth: '612px',
                minHeight: isSignUp ? '632px' : '582px',
                gap: isSignUp ? '40px' : '2.5rem'
              }}
            >
              {/* Decorative Circle */}
              <div 
                className="absolute"
                style={{
                  width: '803.19px',
                  height: '792.79px',
                  top: '-300px',
                  left: '-320px',
                  transform: 'rotate(-153.16deg)',
                  background: 'linear-gradient(135deg, rgba(247, 250, 252, 0.1) 0%, rgba(237, 242, 247, 0) 100%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />
              {/* Main Heading */}
              <h1 
                className="text-white font-bold text-center relative z-10 text-2xl md:text-3xl lg:text-4xl"
                style={{
                  fontFamily: 'Poppins',
                  lineHeight: '110%',
                  letterSpacing: '0%',
                  width: '542px',
                  height: '54px',
                  maxWidth: '100%'
                }}
              >
                {isSignUp ? (
                  <>Join <span style={{color: '#f8a859'}}>EduNiaa</span> Today!</>
                ) : (
                  <>Begin Your <span style={{color: '#f8a859'}}>EduNiaa</span> Journey</>
                )}
              </h1>
              <img
                src={isSignUp ? "/register.png" : "/login.png"}
                alt={isSignUp ? "Register illustration" : "Login illustration"}
                className="relative z-10"
                style={{
                  width: '542px',
                  height: '333px',
                  borderRadius: '20px',
                  maxWidth: '100%',
                  objectFit: 'cover'
                }}
              />
              <p 
                className="text-white text-center relative z-10"
                style={{
                  fontFamily: 'Poppins',
                  fontWeight: '500',
                  fontSize: '13px',
                  lineHeight: '24px',
                  letterSpacing: '1%',
                  width: '544px',
                  height: '48px',
                  maxWidth: '100%'
                }}
              >
                With expert insights and personalized support, EduNiaa helps students make confident decisions for universities across India and abroad.
              </p>
            </div>

            {/* Right Side - Auth Form - Full width on small screens */}
            <div className="w-full max-w-md lg:max-w-md mx-auto relative">
              
              <div className="bg-white rounded-2xl shadow-xl relative z-10" style={isSignUp ? {
                width: '462px',
                height: 'auto',
                minHeight: '594px',
                borderRadius: '18px',
                border: '0.4px solid #e5e7eb',
                padding: '44px 30px',
                maxWidth: '100%'
              } : {
                width: '462px',
                borderRadius: '18px',
                border: '0.4px solid #e5e7eb',
                padding: '2rem',
                maxWidth: '100%'
              }}>
                {/* Toggle Tabs */}
                <div className="flex gap-2 mb-6 rounded-lg p-1" style={{ backgroundColor: 'rgba(237, 235, 250, 1)' }}>
                  <button
                    onClick={() => {
                      setIsSignUp(false)
                      navigate('/login')
                    }}
                    className={`flex-1 py-2 rounded-md font-semibold transition-all`}
                    style={{
                      backgroundColor: !isSignUp ? 'rgba(15, 12, 137, 1)' : 'transparent',
                      color: !isSignUp ? 'white' : 'black'
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsSignUp(true)
                      navigate('/register')
                    }}
                    className={`flex-1 py-2 rounded-md font-semibold transition-all`}
                    style={{
                      backgroundColor: isSignUp ? 'rgba(15, 12, 137, 1)' : 'transparent',
                      color: isSignUp ? 'white' : 'black'
                    }}
                  >
                    Register
                  </button>
                </div>

                {/* Login Form */}
                {!isSignUp && (
                  <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-3.5">
                    {/* Welcome Header - Only visible when left side is hidden */}
                    <div className="lg:hidden mb-6 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                      <p className="text-gray-600 text-sm">Continue your education journey</p>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        style={{
                          width: '410px',
                          height: '41px',
                          borderRadius: '10px',
                          padding: '14px 15px',
                          maxWidth: '100%'
                        }}
                        placeholder="Enter your email"
                        {...loginForm.register('email', { required: 'Email is required' })}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        style={{
                          width: '410px',
                          height: '41px',
                          borderRadius: '10px',
                          padding: '14px 15px',
                          maxWidth: '100%'
                        }}
                        placeholder="Enter your password"
                        {...loginForm.register('password', { required: 'Password is required' })}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          {...loginForm.register('rememberMe')}
                        />
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-red-600 hover:text-red-700 font-medium">
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="text-white font-semibold transition-colors flex items-center justify-center group"
                      style={{
                        width: '410px',
                        height: '50px',
                        borderRadius: '10px',
                        padding: '0',
                        gap: '10px',
                        backgroundColor: 'rgba(15, 12, 137, 1)',
                        maxWidth: '100%',
                        border: 'none',
                        whiteSpace: 'nowrap',
                        marginTop: '20px'
                      }}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Google OAuth */}
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          onClick={() => {
                            window.location.href = 'https://api.eduniaa.com/api/auth/google'
                          }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span className="ml-2">Continue with Google</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Register Form */}
                {isSignUp && (
                  <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-2">
                    {/* Welcome Header - Only visible when left side is hidden */}
                    <div className="lg:hidden mb-6 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Join EduNiaa</h2>
                      <p className="text-gray-600 text-sm">Start your educational journey today</p>
                    </div>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        User Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        style={{
                          width: '402px',
                          height: '41px',
                          borderRadius: '10px',
                          padding: '14px 15px',
                          maxWidth: '100%'
                        }}
                        placeholder="Enter your name"
                        {...registerForm.register('name', { required: 'Name is required' })}
                      />
                      {registerForm.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email 
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        style={{
                          width: '402px',
                          height: '41px',
                          borderRadius: '10px',
                          padding: '14px 15px',
                          maxWidth: '100%'
                        }}
                        placeholder="sample@gmail.com"
                        {...registerForm.register('email', { required: 'Email is required' })}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        style={{
                          width: '402px',
                          height: '41px',
                          borderRadius: '10px',
                          padding: '14px 15px',
                          maxWidth: '100%'
                        }}
                        placeholder="e.g., +91 98XXXXXX10"
                        {...registerForm.register('phone', { required: 'Phone is required' })}
                      />
                      {registerForm.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        style={{
                          width: '402px',
                          height: '41px',
                          borderRadius: '10px',
                          padding: '14px 15px',
                          maxWidth: '100%'
                        }}
                        placeholder="Enter your password"
                        {...registerForm.register('password', { required: 'Password is required', minLength: 6 })}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        style={{
                          width: '402px',
                          height: '41px',
                          borderRadius: '10px',
                          padding: '14px 15px',
                          maxWidth: '100%'
                        }}
                        placeholder="Confirm your password"
                        {...registerForm.register('confirmPassword', {
                          required: 'Please confirm password',
                          validate: (val) => registerForm.watch('password') === val || 'Passwords do not match',
                        })}
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="text-white font-semibold transition-colors flex items-center justify-center group"
                      style={{
                        width: '402px',
                        height: '50px',
                        borderRadius: '10px',
                        padding: '0',
                        gap: '10px',
                        backgroundColor: 'rgba(15, 12, 137, 1)',
                        maxWidth: '100%',
                        border: 'none',
                        whiteSpace: 'nowrap',
                        marginTop: '12px'
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}

                {/* Terms */}
                {isSignUp && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    By registering you accept our{' '}
                    <Link to="/terms" className="hover:underline" style={{color: 'rgba(10, 8, 75, 1)'}}>
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link to="/privacy" className="hover:underline" style={{color: 'rgba(10, 8, 75, 1)'}}>
                      Privacy Policy
                    </Link>
                  </p>
                )}
              </div>

              {/* Social Proof */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Trusted by students from{' '}
                  <span className="font-semibold text-red-600">15+ countries</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <TestimonialsSection authPage={true} />
      
      <Footer />
      </div>
    </>
  )
}

export default AuthPage