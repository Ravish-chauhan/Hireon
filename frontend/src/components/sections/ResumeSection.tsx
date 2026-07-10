import React from "react";
import { useNavigate } from "react-router-dom";
import { useScrollReveal, getAnimationClasses } from "../../hooks/useScrollReveal";

export const ResumeSection = (): JSX.Element => {
  const navigate = useNavigate();

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 });
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal({ delay: 200 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal({ delay: 300 });

  return (
    <section className="bg-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-12 md:gap-16">
          <header
            ref={headerRef}
            className={`flex flex-col items-center justify-center gap-6 text-center max-w-4xl ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
          >
            <div className="inline-flex items-center gap-0.5 px-4 py-2 rounded-xl bg-[#2925f3]">
              <span className="text-white text-center font-medium text-sm sm:text-base leading-tight">
                CV Creator
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#191A15] text-center leading-tight">
                AI Resume Builder
              </h1>

              <p className="text-[#191A15] text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-3xl">
                Create a standout resume using AI. Fast templates, smart
                suggestions, and completely free to use.
              </p>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 w-full 2xl:max-w-[1350px] 2xl:mx-auto">
            <div
              ref={imageRef}
              className={`w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[409px] h-auto mx-auto lg:mx-0 lg:order-2 ${getAnimationClasses(imageVisible, 'fadeInRight', 'duration-1000')}`}
            >
              <img
                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500 drop-shadow-2xl animate-float"
                alt="Professional woman holding resume document"
                src="/resumee.png"
              />
            </div>

            <section
              ref={contentRef}
              className={`flex flex-col w-full lg:w-[667px] items-start justify-center gap-6 sm:gap-8 lg:gap-10 lg:order-1 ${getAnimationClasses(contentVisible, 'fadeInLeft', 'duration-700')}`}
            >
              <div className="flex flex-col items-start justify-center gap-6 sm:gap-8 lg:gap-10 w-full">
                <h2 className="font-bold text-[#191A15] text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight">
                  A Smarter Way To Build Your Career Resume
                </h2>

                <p className="text-[#6b6969] text-sm sm:text-base leading-relaxed text-justify">
                  Create a polished, job-ready resume in minutes with our smart
                  Resume Builder. Simply enter your details, and our system
                  organizes your information into a clean, professional format.
                  <br />
                  <br />
                  With ATS-friendly templates, guided suggestions, and
                  expert-approved layouts, you can highlight your strengths
                  effortlessly and make a strong first impression every time.
                </p>
              </div>

              <button
                className="w-full sm:w-auto bg-[#0f0c89] hover:bg-[#1a16b8] hover:scale-105 text-white font-medium text-sm sm:text-base lg:text-lg py-2.5 sm:py-3 px-6 sm:px-8 lg:px-12 rounded-lg transition-all duration-300 hover:shadow-xl group"
                onClick={() => navigate("/resume-builder")}
                type="button"
                aria-label="Build My Resume"
              >
                <span className="inline-flex items-center gap-2">
                  Build My Resume
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};
