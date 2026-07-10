import React from 'react'
import { Helmet } from 'react-helmet-async'
import ResumeHero from '../components/ResumeHero'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ResumeMarqueeSeparator } from '../components/resume/ResumeMarqueeSeparator'
import HowItWorks from '../components/HowItWorks'
import AIBulletPoints from '../components/AIBulletPoints'
import WhyChooseUs from '../components/WhyChooseUs'
import ResumeExamples from '../components/ResumeExamples'
import FAQAccordion from '../components/FAQAccordion'
import ResumeTestimonials from '../components/resume/ResumeTestimonials'
import ResumeCTASection from '../components/resume/ResumeCTASection'
import { seoConfig } from '../config/seoConfig'

const ResumeBuilder: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Helmet>
        <title>{seoConfig.resumeBuilder.title}</title>
        <meta name="description" content={seoConfig.resumeBuilder.description} />
        <meta name="keywords" content={seoConfig.resumeBuilder.keywords} />
        <link rel="canonical" href={seoConfig.resumeBuilder.canonical} />
      </Helmet>
      <Header />
      <main>
        <ResumeHero />
        <ResumeMarqueeSeparator />
        <HowItWorks />
        <AIBulletPoints />
        <WhyChooseUs />
        <ResumeExamples />
        <ResumeTestimonials />
        <FAQAccordion />
        <ResumeCTASection />
      </main>
      <Footer />
    </div>
  )
}

export default ResumeBuilder
