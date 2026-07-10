import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaEdit, FaGraduationCap, FaBriefcase, FaTrophy, FaFileAlt, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';
import { seoConfig } from '../config/seoConfig';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      console.log('Profile page data:', response.data);
      setProfileData(response.data.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-[#FF6B4A]/10">
          <h2 className="text-2xl font-black text-[#6B3410] mb-4">Please Login</h2>
          <p className="text-[#8B4513]">You need to be logged in to access your profile.</p>
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

  return (
    <div className="min-h-screen bg-[#FFF8F0] w-full">
      <Helmet>
        <title>{seoConfig.profile.title}</title>
        <meta name="description" content={seoConfig.profile.description} />
        <meta name="keywords" content={seoConfig.profile.keywords} />
        <link rel="canonical" href={seoConfig.profile.canonical} />
      </Helmet>
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#FFF5E9] via-[#FFE4D6] to-[#FFEFD5] pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4 leading-tight text-[#6B3410]">
              👤 My Profile
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[#8B4513] leading-relaxed px-4">
              Manage your personal information and track your progress.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-[#FF6B4A]/10">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6] flex items-center justify-center border-4 border-[#FF6B4A]/20">
                {profileData?.profilePicture?.url ? (
                  <img 
                    src={profileData.profilePicture.url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-12 h-12 sm:w-16 sm:h-16 text-[#FF6B4A]" />
                )}
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#6B3410] mb-2">
                {profileData?.profile?.fullName || 'User Name'}
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-[#8B4513] mb-4">
                {profileData?.email && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF6B4A]" />
                    <span className="text-xs sm:text-sm">{profileData.email}</span>
                  </div>
                )}
                {profileData?.profile?.phone && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF6B4A]" />
                    <span className="text-xs sm:text-sm">{profileData.profile.phone}</span>
                  </div>
                )}
                {profileData?.profile?.location?.city && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF6B4A]" />
                    <span className="text-xs sm:text-sm">{profileData.profile.location.city}, {profileData.profile.location.state}</span>
                  </div>
                )}
              </div>
              
              {/* Profile Completion */}
              {profileData?.profileCompletedPercent && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#8B4513]">Profile Completion</span>
                    <span className="text-sm font-black text-[#FF6B4A]">{profileData.profileCompletedPercent}%</span>
                  </div>
                  <div className="w-full bg-[#FFE4D6] rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${profileData.profileCompletedPercent}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button
                onClick={() => navigate('/onboarding')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-black hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Education Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-[#FF6B4A]/10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaGraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#6B3410]">Education</h2>
            </div>
            {profileData?.education?.length > 0 ? (
              <div className="space-y-4">
                {profileData.education.map((edu: any, index: number) => (
                  <div key={index} className="border-l-4 border-[#FF6B4A] pl-4 bg-gradient-to-r from-[#FFF5E9] to-transparent p-4 rounded-r-lg">
                    <h3 className="font-black text-[#6B3410]">{edu.level}</h3>
                    <p className="text-[#8B4513]">{edu.institution}</p>
                    <p className="text-sm text-[#8B4513]/70">{edu.boardOrUniversity} • {edu.yearOfCompletion}</p>
                    {edu.percentageOrCGPA && (
                      <p className="text-sm text-[#FF6B4A] font-semibold">Score: {edu.percentageOrCGPA}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#8B4513]/70 italic">No education information added yet.</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FF6B4A]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
                <FaBriefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-[#6B3410]">Experience</h2>
            </div>
            {profileData?.professionalExperience?.length > 0 ? (
              <div className="space-y-4">
                {profileData.professionalExperience.map((exp: any, index: number) => (
                  <div key={index} className="border-l-4 border-[#FF6B4A] pl-4 bg-gradient-to-r from-[#FFF5E9] to-transparent p-4 rounded-r-lg">
                    <h3 className="font-black text-[#6B3410]">{exp.title}</h3>
                    <p className="text-[#8B4513]">{exp.company}</p>
                    <p className="text-sm text-[#8B4513]/70">
                      {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).getFullYear()}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-[#8B4513] mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#8B4513]/70 italic">No work experience added yet.</p>
            )}
          </div>

          {/* Test History Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FF6B4A]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
                <FaFileAlt className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-[#6B3410]">Test History</h2>
            </div>
            {profileData?.testHistory?.length > 0 ? (
              <div className="space-y-4">
                {profileData.testHistory.map((test: any, index: number) => (
                  <div key={index} className="border-l-4 border-[#FF6B4A] pl-4 bg-gradient-to-r from-[#FFF5E9] to-transparent p-4 rounded-r-lg">
                    <h3 className="font-black text-[#6B3410]">{test.exam}</h3>
                    <p className="text-[#FF6B4A] font-semibold">Score: {test.score}</p>
                    <p className="text-sm text-[#8B4513]/70">
                      <FaCalendar className="inline w-3 h-3 mr-1" />
                      {new Date(test.attemptDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#8B4513]/70 italic">No test scores added yet.</p>
            )}
          </div>

          {/* Extracurriculars Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FF6B4A]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-xl flex items-center justify-center">
                <FaTrophy className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-[#6B3410]">Activities & Achievements</h2>
            </div>
            {profileData?.extracurriculars?.length > 0 ? (
              <div className="space-y-4">
                {profileData.extracurriculars.map((activity: any, index: number) => (
                  <div key={index} className="border-l-4 border-[#FF6B4A] pl-4 bg-gradient-to-r from-[#FFF5E9] to-transparent p-4 rounded-r-lg">
                    <h3 className="font-black text-[#6B3410]">{activity.title}</h3>
                    <p className="text-[#8B4513]">{activity.type}</p>
                    <p className="text-sm text-[#8B4513]/70">Year: {activity.year}</p>
                    {activity.description && (
                      <p className="text-sm text-[#8B4513] mt-2">{activity.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#8B4513]/70 italic">No activities added yet.</p>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mt-6 sm:mt-8 border border-[#FF6B4A]/10">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FF6B4A] to-[#E85D3F] rounded-lg sm:rounded-xl flex items-center justify-center">
              <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#6B3410]">Documents</h2>
          </div>
          {profileData?.documents?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {profileData.documents.map((doc: any, index: number) => (
                <div key={index} className="border border-[#FF6B4A]/20 rounded-lg p-4 hover:border-[#FF6B4A] transition-colors bg-gradient-to-br from-[#FFF5E9] to-[#FFE4D6]">
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="w-5 h-5 text-[#FF6B4A]" />
                    <div>
                      <p className="font-black text-[#6B3410] capitalize">{doc.type.replace('_', ' ')}</p>
                      <p className="text-sm text-[#8B4513]">{doc.verified ? 'Verified ✅' : 'Pending Verification ⏳'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#8B4513]/70 italic">No documents uploaded yet.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;