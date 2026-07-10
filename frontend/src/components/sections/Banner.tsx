import React from "react";
import { useNavigate } from 'react-router-dom';

export const Banner = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <section className="relative w-screen bg-[#d4d4ff52] rounded-3xl overflow-hidden mx-0 my-8 md:my-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-4 md:p-8 lg:p-12 mx-4 md:mx-8 lg:mx-12 2xl:max-w-7xl 2xl:mx-auto">
        {/* Content Section */}
        <div className="flex flex-col w-full lg:w-auto lg:max-w-2xl items-start justify-center gap-4 md:gap-6">
          <div className="flex flex-col items-start justify-center gap-4 md:gap-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#191A15] leading-tight">
              Not Sure Which Service Is Right For You?
            </h2>

            <p className="text-[#191A15] text-base sm:text-lg md:text-xl leading-relaxed">
              Schedule a free consultation with our experts, who will assess your
              profile, clarify your doubts, and guide you toward the most suitable
              career or admission pathway tailored to your aspirations.
            </p>
          </div>

          <button
            className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 bg-[#0f0c89] rounded-lg hover:bg-[#0d0a70] focus:outline-none focus:ring-2 focus:ring-[#0f0c89] focus:ring-offset-2 transition-colors cursor-pointer"
            type="button"
            aria-label="Schedule Free Consultation"
            onClick={() => navigate('/book-consultation')}
          >
            <span className="text-white text-center text-base sm:text-lg font-medium leading-tight">
              Schedule Free Consultation
            </span>
          </button>
        </div>

        {/* Image Section */}
        <div className="relative flex-shrink-0 mr-24 self-end hidden lg:block">
          <img
            className="w-72 h-88 md:w-80 md:h-[26rem] object-cover rounded-lg"
            alt="Consultation representative"
            src="/Rectangle.png"
          />
          
          {/* Call 2 - Top Right */}
          <img
            className="absolute -top-20 left-40 z-10 scale-[0.6] md:scale-[0.9]"
            alt="Call 2"
            src="/call (2).png"
          />
          
          {/* Call 1 - Bottom Left */}
          <img
            className="absolute -bottom-7 right-20 z-10 scale-[0.5] md:scale-[0.8]"
            alt="Call 1"
            src="/call (1).png"
          />
        </div>
      </div>
    </section>
  );
};