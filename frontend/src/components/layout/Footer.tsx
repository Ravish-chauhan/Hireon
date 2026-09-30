import React from 'react'
import { Link } from 'react-router-dom'
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from 'lucide-react'

// X (formerly Twitter) Icon Component
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const quickLinksData = [
  { label: "About Us", href: "/about" },
  { label: "Colleges", href: "/colleges" },
  { label: "Exams", href: "/exams" },
  { label: "The Quantum Corner", href: "/blogs" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "#contact", isContact: true },
];

const servicesData = [
  { label: "AI Mock Interview", href: "/ai-interview" },
  { label: "DSA Mock Interview", href: "/dsa-interview" },
  { label: "Resume Builder", href: "/resume-builder" },
  { label: "Resume Analyzer", href: "/resume-upload" },
  { label: "Job Search", href: "/jobs" },
  { label: "Career Counseling", href: "/book-consultation" },
  { label: "University Admissions", href: "/colleges" },
];

const officesData = [
  {
    title: "Pune Office:",
    address: "V18, EduNiaa Global LearnX,\nOffice no-205, opp. Cummins India Office,\nBalewadi High Street, Balewadi\nPune-411045",
  },
  {
    title: "Mumbai Office:",
    address: "Office No.: 909, 9th floor, Satra Plaza,\nPalm Beach Rd, Phase 2, Sector 19D,\nVashi, Navi Mumbai, Maharashtra-400703",
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a084b] text-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 2xl:max-w-[1350px]">
        <div className="flex flex-col md:flex-row lg:flex-row items-start justify-between gap-8 lg:gap-12">
          {/* Left Column - Company Info */}
          <div className="flex flex-col w-full lg:w-[440px] items-start">
            <Link to="/" className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="Eduniaa Logo"
                className="lg:w-16 lg:h-14 lg:scale-[2.8] md:w-16 md:h-16 md:scale-[3.0] w-14 h-14 scale-[2.5] object-contain lg:ml-10 md:ml-0 ml-8"
              />
            </Link>

            <p className="text-white text-sm leading-relaxed mb-2">
              Your gateway to academic excellence. We provide expert guidance to
              help students achieve their educational goals.
            </p>

            <div className="flex items-center gap-3 mb-3">
              <a
                href="https://www.facebook.com/eduniaa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <FacebookIcon size={17} className="text-white" />
              </a>
              <a
                href="https://x.com/eduniaa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <XIcon size={17} />
              </a>
              <a
                href="https://www.linkedin.com/company/eduniaa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={14} className="text-white" />
              </a>
              <a
                href="https://www.instagram.com/teameduniaa?igsh=NnRkNjVwbDJmbGV6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <InstagramIcon size={17} className="text-white" />
              </a>
            </div>

            <div className="flex flex-col items-start gap-3">
              <a
                href="tel:+919163591151"
                className="flex items-center gap-5 hover:underline"
              >
                <PhoneIcon size={18} className="text-white" />
                <span className="text-white text-sm">
                  +91 9163591151
                </span>
              </a>

              <a
                href="mailto:contact@eduniaa.com"
                className="flex items-center gap-5 hover:underline"
              >
                <MailIcon size={18} className="text-white" />
                <span className="text-white text-sm">
                  contact@eduniaa.com
                </span>
              </a>
            </div>
          </div>

          {/* Middle Columns - Links */}
          <div className="flex flex-col md:flex-row sm:flex-row gap-8 lg:gap-14 order-3 md:order-2 items-start">
            <nav className="flex flex-col w-full sm:w-auto md:w-[93px] items-start">
              <h2 className="font-bold text-white text-base mb-5">
                Quick Links
              </h2>

              <ul className="flex flex-wrap lg:flex-col items-start gap-x-4 gap-y-2 lg:gap-5 lg:mt-0 mt-0">
                {quickLinksData.map((link, index) => (
                  <li key={index}>
                    {link.isContact ? (
                      <button
                        onClick={() => window.dispatchEvent(new Event('openContactForm'))}
                        className="text-white text-sm hover:underline transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-white text-sm hover:underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="flex flex-col w-full sm:w-auto md:w-40 items-start">
              <div className="h-[44px] flex items-end">
                <h2 className="font-bold text-white text-base mb-5">
                  Our Services
                </h2>
              </div>

              <ul className="flex flex-col items-start gap-5 mt-6">
                {servicesData.map((service, index) => (
                  <li key={index}>
                    <Link
                      to={service.href}
                      className="text-white text-sm hover:underline transition-colors"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Column - Offices */}
          <div className="flex flex-col w-full lg:w-[334px] items-start gap-6 md:gap-8 order-2 md:order-3">
            <h2 className="font-bold text-white text-base mb-3 md:mb-0 md:hidden lg:block">
              Our Offices
            </h2>
            {officesData.map((office, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <div className="w-5 h-5 md:w-7 md:h-7 flex items-center justify-center flex-shrink-0 mt-1 md:mt-0">
                  <MapPinIcon size={16} className="text-white md:w-[18px] md:h-[18px]" />
                </div>

                <div className="flex flex-col w-full lg:w-[292px] items-start gap-1 md:gap-2">
                  <div className="font-semibold md:font-normal text-white text-sm leading-relaxed">
                    {office.title}
                  </div>
                  <p className="text-white text-xs md:text-sm leading-relaxed">
                    {office.address.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < office.address.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-5 mt-8 lg:mt-12 pt-5 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <p className="text-white text-sm">
              © {currentYear} Eduniaa. All rights reserved.
            </p>

            <nav className="flex items-center gap-5">
              <Link
                to="/privacy-policy"
                className="text-white text-sm hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="text-white text-sm hover:underline transition-colors"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}