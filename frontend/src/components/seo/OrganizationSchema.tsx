import React from 'react';
import { Helmet } from 'react-helmet-async';

export const OrganizationSchema: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EduNiaa",
    "alternateName": "EduNiaa Global LearnX",
    "url": "https://eduniaa.com",
    "logo": "https://eduniaa.com/SVG.png",
    "description": "AI-powered college and career guidance platform helping students make informed decisions about their academic future with expert consultation and personalized recommendations.",
    "foundingDate": "2023",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@eduniaa.com",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/eduniaa",
      "https://www.facebook.com/eduniaa",
      "https://www.instagram.com/teameduniaa"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};