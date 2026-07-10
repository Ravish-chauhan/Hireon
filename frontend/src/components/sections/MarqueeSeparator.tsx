import React from 'react'

interface MarqueeSeparatorProps {
    items?: string[]
    bgColor?: string
    textColor?: string
    speed?: 'slow' | 'normal' | 'fast'
}

export const MarqueeSeparator: React.FC<MarqueeSeparatorProps> = ({
    items = [
        '5,200+ Admissions Globally',
        '15+ Years of Excellence',
        '98% Success Rate',
        'AI-Powered Guidance',
        'Expert Counsellors',
        'Global University Network',
        'Trusted by Students',
    ],
    bgColor = 'bg-[#0F0C89]',
    textColor = 'text-white',
    speed = 'normal',
}) => {
    const speedClass = {
        slow: 'animate-marquee-slow',
        normal: 'animate-marquee',
        fast: 'animate-marquee-fast',
    }

    // Duplicate items for seamless loop
    const duplicatedItems = [...items, ...items]

    return (
        <div className={`${bgColor} py-4 overflow-hidden relative`}>
            {/* Gradient edges for smooth fade effect */}
            <div className={`absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 bg-gradient-to-r from-[#0F0C89] to-transparent pointer-events-none`}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 bg-gradient-to-l from-[#0F0C89] to-transparent pointer-events-none`}></div>

            {/* Marquee container */}
            <div className="flex whitespace-nowrap">
                <div className={`flex ${speedClass[speed]} hover:pause-animation`}>
                    {duplicatedItems.map((item, index) => (
                        <div key={index} className="flex items-center mx-4 sm:mx-6 md:mx-8">
                            {/* Star separator */}
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF9A35] mr-4 sm:mr-6 flex-shrink-0"
                                viewBox="0 0 20 19"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.9861 0L12.3435 6.90983H19.9722L13.8004 11.1803L16.1578 18.0902L9.9861 13.8197L3.81435 18.0902L6.17175 11.1803L5.72205e-06 6.90983H7.6287L9.9861 0Z" />
                            </svg>
                            <span className={`${textColor} font-medium text-sm sm:text-base md:text-lg`}>
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
                {/* Second copy for seamless loop */}
                <div className={`flex ${speedClass[speed]} hover:pause-animation`}>
                    {duplicatedItems.map((item, index) => (
                        <div key={`dup-${index}`} className="flex items-center mx-4 sm:mx-6 md:mx-8">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF9A35] mr-4 sm:mr-6 flex-shrink-0"
                                viewBox="0 0 20 19"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.9861 0L12.3435 6.90983H19.9722L13.8004 11.1803L16.1578 18.0902L9.9861 13.8197L3.81435 18.0902L6.17175 11.1803L5.72205e-06 6.90983H7.6287L9.9861 0Z" />
                            </svg>
                            <span className={`${textColor} font-medium text-sm sm:text-base md:text-lg`}>
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
