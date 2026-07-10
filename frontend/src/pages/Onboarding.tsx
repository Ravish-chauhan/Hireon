import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import BasicInfoForm from '../components/onboarding/BasicInfoForm';
import EducationForm from '../components/onboarding/EducationForm';
import ExperienceForm from '../components/onboarding/ExperienceForm';
import ExtracurricularsForm from '../components/onboarding/ExtracurricularsForm';
import TestHistoryForm from '../components/onboarding/TestHistoryForm';
import PreferencesForm from '../components/onboarding/PreferencesForm';
import DocumentsForm from '../components/onboarding/DocumentsForm';
import api from '../services/api';
import toast from 'react-hot-toast';

const Onboarding = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: '👤', component: BasicInfoForm },
    { id: 'education', title: 'Education', icon: '🎓', component: EducationForm },
    { id: 'experience', title: 'Experience', icon: '💼', component: ExperienceForm },
    { id: 'extracurriculars', title: 'Activities', icon: '🏆', component: ExtracurricularsForm },
    { id: 'tests', title: 'Test History', icon: '📝', component: TestHistoryForm },
    { id: 'preferences', title: 'Preferences', icon: '⚙️', component: PreferencesForm },
    { id: 'documents', title: 'Documents', icon: '📄', component: DocumentsForm }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      console.log('Fetched profile data:', JSON.stringify(response.data, null, 2));
      setProfileData(response.data.data);
      // Set current step based on onboarding progress
      if (response.data.data?.onboarding?.currentStep) {
        setCurrentStep(response.data.data.onboarding.currentStep - 1);
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      if (error.status === 403) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      // Update onboarding progress
      try {
        await api.patch('/users/onboarding', {
          currentStep: newStep + 1,
          completedSteps: [...(profileData?.onboarding?.completedSteps || []), currentStep + 1]
        });
      } catch (error) {
        console.error('Failed to update onboarding progress');
      }
    } else {
      // Complete onboarding
      try {
        await api.patch('/users/onboarding', {
          isCompleted: true,
          currentStep: steps.length,
          completedSteps: steps.map((_, index) => index + 1)
        });
        toast.success('Profile completed successfully!');
        navigate('/profile');
      } catch (error) {
        toast.error('Failed to complete onboarding');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
          <h2 className="text-2xl font-black text-[#6B3410] mb-4">Please Login</h2>
          <p className="text-[#8B4513]">You need to be logged in to complete your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
      </div>
    );
  }

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-[#FFF8F0] w-full">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#FFF5E9] via-[#FFE4D6] to-[#FFEFD5] pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4 leading-tight text-[#6B3410]">
              ✏️ Complete Your Profile
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[#8B4513] leading-relaxed mb-4 sm:mb-6 px-4">
              Help us understand you better to provide personalized recommendations
            </p>
            <div className="max-w-sm sm:max-w-md mx-auto">
              <div className="w-full bg-[#FFE4D6] rounded-full h-2 sm:h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] h-2 sm:h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm text-[#8B4513] font-semibold">
                Step {currentStep + 1} of {steps.length} ({Math.round(((currentStep + 1) / steps.length) * 100)}% Complete)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Step Navigation */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <div className="flex lg:grid lg:grid-cols-7 gap-2 bg-white rounded-2xl p-3 md:p-4 shadow-lg min-w-max lg:min-w-0 border border-[#FF6B4A]/10">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={`flex flex-col items-center space-y-1 md:space-y-2 px-3 md:px-2 py-2 md:py-4 rounded-xl transition-all text-xs flex-shrink-0 ${
                    currentStep === index
                      ? 'bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] text-white shadow-lg'
                      : index < currentStep
                      ? 'bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6] text-[#FF6B4A] border border-[#FF6B4A]/20'
                      : 'text-[#8B4513] hover:bg-gradient-to-br hover:from-[#FFF5E9] hover:to-[#FFE4D6]'
                  }`}
                >
                  <span className="text-lg md:text-xl">{step.icon}</span>
                  <span className="font-black text-center leading-tight text-xs md:text-xs whitespace-nowrap">{step.title}</span>
                  {index < currentStep && <span className="text-[#FF6B4A] text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-[#FF6B4A]/10">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-[#6B3410] flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">{steps[currentStep].icon}</span>
              {steps[currentStep].title}
            </h2>
            <p className="text-[#8B4513] mt-2">
              {currentStep === 0 && "Let's start with your basic information"}
              {currentStep === 1 && "Tell us about your educational background"}
              {currentStep === 2 && "Share your work experience and internships"}
              {currentStep === 3 && "Highlight your achievements and activities"}
              {currentStep === 4 && "Add your test scores and certifications"}
              {currentStep === 5 && "Set your preferences for recommendations"}
              {currentStep === 6 && "Upload important documents"}
            </p>
          </div>

          <CurrentComponent 
            profileData={profileData} 
            onUpdate={fetchProfile}
            onNext={nextStep}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-3 sm:gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-[#8B4513] text-white rounded-full font-bold hover:bg-[#6B3410] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm lg:text-base"
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white text-[#FF6B4A] border-2 border-[#FF6B4A]/30 hover:border-[#FF6B4A] rounded-full font-bold transition-colors text-xs sm:text-sm lg:text-base"
          >
            View Profile
          </button>

          <button
            onClick={nextStep}
            className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] text-white rounded-full font-bold hover:shadow-lg transition-all text-xs sm:text-sm lg:text-base"
          >
            <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Onboarding;