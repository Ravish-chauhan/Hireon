import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import HeroSection from '../components/about/HeroSection'
import AboutSection from '../components/about/AboutSection'
import PhilosophySection from '../components/about/PhilosophySection'
import DualFocusSection from '../components/about/DualFocusSection'
import ExpertiseTimeline from '../components/about/ExpertiseTimeline'
import VisionSection from '../components/about/VisionSection'
import CTASection from '../components/about/CTASection'
import { seoConfig } from '../config/seoConfig'



export function AboutUs() {
  return (
    <div className="bg-white w-full overflow-hidden">
      <Helmet>
        <title>{seoConfig.about.title}</title>
        <meta name="description" content={seoConfig.about.description} />
        <meta name="keywords" content={seoConfig.about.keywords} />
        <link rel="canonical" href={seoConfig.about.canonical} />
      </Helmet>
      <Header />
      <HeroSection />
      <AboutSection />
      <PhilosophySection />
      <DualFocusSection />
      <ExpertiseTimeline />
      <VisionSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default AboutUs