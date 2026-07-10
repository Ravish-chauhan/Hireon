import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { resumeTemplates } from '../components/resume/templates';
import { seoConfig } from '../config/seoConfig';

const mockResumeData = {
  personalInfo: {
    name: 'Alexandra Johnson',
    title: 'Senior Full-Stack Developer',
    contact: {
      email: 'alexandra.johnson@email.com',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexandra-johnson',
      github: 'github.com/alexandra-dev'
    },
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  summary: 'Innovative Full-Stack Developer with 7+ years of experience building scalable web applications and leading cross-functional teams. Expertise in React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions that drive business growth and improve user experience.',
  skills: [
    { id: '1', category: 'Frontend', skills: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS'] },
    { id: '2', category: 'Backend', skills: ['Node.js', 'Express.js', 'Python', 'Django', 'PostgreSQL', 'MongoDB', 'Redis'] },
    { id: '3', category: 'Cloud & DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform'] },
    { id: '4', category: 'Tools & Others', skills: ['Git', 'Jira', 'Figma', 'GraphQL', 'REST APIs', 'Microservices'] }
  ],
  experience: [
    {
      id: '1',
      title: 'Senior Full-Stack Developer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: [
        'Led development of microservices architecture serving 2M+ users, improving system performance by 40%',
        'Architected and implemented React-based dashboard reducing customer support tickets by 35%',
        'Mentored 5 junior developers and established code review processes improving team productivity',
        'Collaborated with product managers to define technical requirements for new features'
      ]
    },
    {
      id: '2',
      title: 'Full-Stack Developer',
      company: 'InnovateLab Inc.',
      location: 'San Francisco, CA',
      startDate: 'Mar 2019',
      endDate: 'Dec 2020',
      description: [
        'Developed and maintained 15+ RESTful APIs using Node.js and Express.js',
        'Built responsive web applications with React and TypeScript serving 500K+ monthly users',
        'Implemented automated testing strategies achieving 90% code coverage',
        'Optimized database queries reducing average response time by 60%'
      ]
    },
    {
      id: '3',
      title: 'Frontend Developer',
      company: 'StartupHub',
      location: 'Palo Alto, CA',
      startDate: 'Jun 2017',
      endDate: 'Feb 2019',
      description: [
        'Created pixel-perfect UI components using React and CSS3 for 10+ client projects',
        'Integrated third-party APIs and payment gateways including Stripe and PayPal',
        'Collaborated with UX designers to implement responsive designs across all devices'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      graduationDate: 'May 2017',
      gpa: '3.9',
      description: ['Specialization in Software Engineering and Machine Learning', 'Teaching Assistant for Data Structures and Algorithms']
    },
    {
      id: '2',
      degree: 'Bachelor of Science in Computer Engineering',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      graduationDate: 'May 2015',
      gpa: '3.7',
      description: ['Magna Cum Laude', 'President of Computer Science Society']
    }
  ],
  projects: [
    {
      id: '1',
      name: 'EcoTracker - Sustainability Platform',
      role: 'Lead Developer',
      startDate: 'Jan 2023',
      endDate: 'Mar 2023',
      description: [
        'Built full-stack web application helping users track carbon footprint with 10K+ active users',
        'Implemented real-time data visualization using D3.js and Chart.js',
        'Integrated with external APIs for environmental data and carbon calculations'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'D3.js', 'AWS'],
      link: 'github.com/alexandra-dev/ecotracker'
    },
    {
      id: '2',
      name: 'TaskFlow - Project Management Tool',
      role: 'Full-Stack Developer',
      startDate: 'Sep 2022',
      endDate: 'Nov 2022',
      description: [
        'Developed collaborative project management platform with real-time updates',
        'Implemented drag-and-drop functionality and team collaboration features',
        'Built RESTful API with authentication and role-based access control'
      ],
      technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Socket.io'],
      link: 'github.com/alexandra-dev/taskflow'
    }
  ],
  certificates: [
    { id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Mar 2023' },
    { id: '2', name: 'Google Cloud Professional Developer', issuer: 'Google Cloud', date: 'Jan 2023' },
    { id: '3', name: 'Certified Kubernetes Administrator', issuer: 'Cloud Native Computing Foundation', date: 'Nov 2022' }
  ],
  awards: [
    { id: '1', title: 'Employee of the Year', date: '2022', description: 'Recognized for outstanding technical leadership and innovation' },
    { id: '2', title: 'Best Innovation Award', date: '2021', description: 'Led development of AI-powered recommendation system' }
  ],
  languages: [
    { id: '1', language: 'English', proficiency: 'Native' },
    { id: '2', language: 'Spanish', proficiency: 'Conversational' },
    { id: '3', language: 'Mandarin', proficiency: 'Basic' }
  ],
  volunteer: [
    {
      id: '1',
      role: 'Coding Instructor',
      organization: 'Girls Who Code',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: 'Teaching programming fundamentals to underrepresented youth in technology'
    }
  ],
  memberships: [
    { id: '1', organization: 'Association for Computing Machinery (ACM)', role: 'Member', startDate: '2017', endDate: 'Present' }
  ],
  publications: [
    {
      id: '1',
      title: 'Scalable Microservices Architecture for Modern Web Applications',
      authors: 'A. Johnson, M. Smith, R. Davis',
      journal: 'IEEE Software Engineering Journal',
      date: 'Apr 2023',
      url: 'doi.org/10.1109/example.2023'
    }
  ]
};

const ResumeCollection: React.FC = () => {
  const navigate = useNavigate();

  const handleUseTemplate = (templateId: string) => {
    navigate(`/resume-form?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{seoConfig.resumeCollection.title}</title>
        <meta name="description" content={seoConfig.resumeCollection.description} />
        <meta name="keywords" content={seoConfig.resumeCollection.keywords} />
        <link rel="canonical" href={seoConfig.resumeCollection.canonical} />
      </Helmet>
      <Header />

      <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-white overflow-hidden">
        {/* Decorative background elements matching landing page style */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-[#0066FF]/5 rounded-full blur-3xl -z-1" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-[#0F0C89]/5 rounded-full blur-3xl -z-1" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Platform Badge Style */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(237,235,250,0.59)] mb-8 animate-fade-in">
            <svg
              className="w-5 h-5 fill-[#FF9A35]"
              viewBox="0 0 20 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.9861 0L12.3435 6.90983H19.9722L13.8004 11.1803L16.1578 18.0902L9.9861 13.8197L3.81435 18.0902L6.17175 11.1803L5.72205e-06 6.90983H7.6287L9.9861 0Z" />
            </svg>
            <span className="text-[#191A15] font-medium text-sm sm:text-base">
              Professional Resume Templates
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#191A15] leading-tight mb-6 max-w-4xl mx-auto">
            Choose Your <span className="text-[#0066FF]">Professional</span> Resume Template
          </h1>
          <p className="text-[#191A15] text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto opacity-80">
            Select from our collection of professionally designed templates to create your perfect resume and land your dream job.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {resumeTemplates.map((template) => {
            const TemplateComponent = template.component;
            return (
              <div
                key={template.id}
                className="group bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative h-96 overflow-hidden bg-gray-50/50">
                  <div className="scale-[0.34] origin-top-left w-[263%] h-[263%] pointer-events-none transform transition-transform duration-700 group-hover:scale-[0.36]">
                    <TemplateComponent data={mockResumeData} />
                  </div>
                  <div className="absolute inset-0 bg-[#0F0C89]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6 backdrop-blur-[2px]">
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className="w-full py-4 bg-white text-[#0F0C89] rounded-xl font-bold shadow-xl hover:bg-gray-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-[#191A15] mb-2 group-hover:text-[#0066FF] transition-colors">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{template.description}</p>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-[#0066FF]/10 text-[#0066FF] rounded-lg capitalize tracking-wide">
                    {template.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResumeCollection;