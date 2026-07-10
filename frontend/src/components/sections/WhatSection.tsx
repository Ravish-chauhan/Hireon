import React from "react";
import { FaBuilding, FaEnvelope, FaPhone } from "react-icons/fa";
import { useScrollReveal, getAnimationClasses } from "../../hooks/useScrollReveal";

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  iconType?: "image" | "component";
}

export const WhatSection = (): JSX.Element => {
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal({ delay: 200 });

  const features: FeatureCard[] = [
    {
      icon: "/call (1).png",
      title: "Instant Confirmation",
      description: "Receive immediate confirmation and welcome email",
      iconType: "image",
    },
    {
      icon: "/illustration1.jpg",
      title: "Expert Assignment",
      description: "We match you with the perfect counselor for your goals",
      iconType: "image",
    },
    {
      icon: "/call (2).png",
      title: "Personalized Call",
      description:
        "Get a call within 24 hours to discuss your educational journey",
      iconType: "image",
    },
  ];

  return (
    <section className="bg-[#d4d4ff38] py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 w-full 2xl:max-w-[1350px] 2xl:mx-auto">
          <div className="relative w-full lg:w-[622px] h-auto lg:h-[427px] flex flex-col lg:block">
            {features.map((feature, index) => (
              <FeatureItem key={index} feature={feature} index={index} />
            ))}
          </div>

          <div
            ref={imageRef}
            className={`w-full lg:w-[486px] h-auto lg:h-[427px] ${getAnimationClasses(imageVisible, 'fadeInRight', 'duration-1000')}`}
          >
            <img
              className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500 shadow-lg hover:shadow-2xl"
              alt="Educational counseling session"
              src="/write.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  feature: FeatureCard;
  index: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, index }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 150 });
  const animationType = index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight';

  return (
    <article
      ref={ref}
      className={`
        ${index === 0
          ? "lg:absolute lg:top-0 lg:left-0"
          : ""
        }
        ${index === 1
          ? "lg:absolute lg:top-[153px] lg:left-[97px]"
          : ""
        }
        ${index === 2
          ? "lg:absolute lg:top-[306px] lg:left-0"
          : ""
        }
        inline-flex flex-col items-start p-6 bg-white rounded-3xl shadow-lg mb-6 lg:mb-0 group cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-500
        ${index === 0
          ? "w-full lg:w-[461px]"
          : ""
        }
        ${index === 1
          ? "w-full lg:w-[477px]"
          : ""
        }
        ${index === 2
          ? "w-full lg:w-[517px]"
          : ""
        }
        ${getAnimationClasses(isVisible, animationType as any, 'duration-700')}
      `}
    >
      <div className="relative w-full h-[73px] flex items-center">
        <div className="w-[73px] h-[73px] bg-[#ebf3ff] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#2925f3] group-hover:scale-110 transition-all duration-300">
          {index === 2 ? (
            <FaPhone className="w-8 h-8 text-[#2925f3] group-hover:text-white transition-colors duration-300" />
          ) : index === 1 ? (
            <FaBuilding className="w-8 h-8 text-[#2925f3] group-hover:text-white transition-colors duration-300" />
          ) : (
            <FaEnvelope className="w-8 h-8 text-[#2925f3] group-hover:text-white transition-colors duration-300" />
          )}
        </div>

        <div className="ml-4 flex-1">
          <h3 className="font-bold text-[#191A15] text-base sm:text-lg lg:text-xl leading-tight mb-1 group-hover:text-[#2925f3] transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-[#696983] text-xs sm:text-sm lg:text-base leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </article>
  );
};
