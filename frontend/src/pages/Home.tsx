import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { HeroSection } from '../components/sections/HeroSection'
import { MarqueeSeparator } from '../components/sections/MarqueeSeparator'
import { AboutSection } from '../components/sections/AboutSection'
import { Banner } from '../components/sections/Banner'
import { ServicesSection } from '../components/sections/ServicesSection'
import { PricingSection } from '../components/sections/PricingSection'
import { ConsultationSection } from '../components/sections/ConsultationSection'
import { WhatSection } from '../components/sections/WhatSection'
import { ResumeSection } from '../components/sections/ResumeSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { NewsSection } from '../components/sections/NewsSection'
import { CTASection } from '../components/sections/CTASection'
import { seoConfig } from '../config/seoConfig'
import { OrganizationSchema } from '../components/seo/OrganizationSchema'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Helmet>
        <title>{seoConfig.home.title}</title>
        <meta name="description" content={seoConfig.home.description} />
        <meta name="keywords" content={seoConfig.home.keywords} />
        <link rel="canonical" href={seoConfig.home.canonical} />
      </Helmet>
      <OrganizationSchema />
      <Header />
      <main className="w-full">
        <HeroSection />
        <MarqueeSeparator />
        <AboutSection />
        <Banner />
        <ServicesSection />
        <PricingSection />
        <ConsultationSection />
        <WhatSection />
        <ResumeSection />
        <TestimonialsSection />
        <NewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default Home