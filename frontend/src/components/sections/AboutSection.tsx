import React from 'react'
import { UserCheck, FileText, Plane } from 'lucide-react'

interface ServiceCard {
  id: number
  icon: string
  iconBg: string
  title: string
  description: string
  iconAlt: string
}

export const AboutSection = (): JSX.Element => {
  const serviceCards: ServiceCard[] = [
    {
      id: 1,
      icon: '/hero.jpg',
      iconBg: '#ebf3ff',
      title: 'Career & Admission Counselling',
      description:
        'Provides expert guidance to help you choose the right path and achieve success in India or abroad.',
      iconAlt: 'Career counselling icon',
    },
    {
      id: 2,
      icon: '/hero.jpg',
      iconBg: '#ebf3ff',
      title: 'Profile Evaluation & Building',
      description:
        'We assess your strengths, goals, and experiences to craft an authentic and impactful profile story.',
      iconAlt: 'Profile evaluation icon',
    },
    {
      id: 3,
      icon: '/hero.jpg',
      iconBg: '#ebf3ff',
      title: 'Application & Visa Support',
      description:
        'You receive seamless assistance for SOPs, LORs, applications, and visas, ensuring a smooth journey from start to finish.',
      iconAlt: 'Application support icon',
    },
  ]

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 2xl:max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-12 md:gap-16">
          <header className="flex flex-col items-center justify-center gap-6 text-center max-w-4xl">
            <div className="inline-flex items-center gap-0.5 px-4 py-2 rounded-xl bg-[#2925f3]">
              <span className="text-white text-center font-medium text-sm sm:text-base leading-tight">
                About Us
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#191A15] text-center leading-tight">
                Who We Are
              </h1>

              <p className="text-[#191A15] text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-3xl">
                Bharat's And The World's #1 AI-driven admission guidance platform backed with human intel, built to change the narrative of how students choose their careers and universities.
              </p>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 w-full px-2">
            {/* Image section - shows first on mobile/tablet */}
            <div
              className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[588px] h-[220px] sm:h-[280px] md:h-[360px] lg:h-[469px] flex-shrink-0 mx-auto lg:mx-0 order-1 lg:order-1"
              role="img"
              aria-label="Collage of educational images"
            >
              {/* Blue accent box */}
              <div
                className="absolute top-[155px] sm:top-[200px] md:top-[260px] lg:top-[336px] left-[220px] sm:left-[275px] md:left-[355px] lg:left-[462px] w-[60px] sm:w-[75px] md:w-[95px] lg:w-[126px] h-[65px] sm:h-[80px] md:h-[100px] lg:h-[133px] bg-[#0066ff] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] lg:rounded-[10px]"
                aria-hidden="true"
              />

              {/* Orange accent box */}
              <div
                className="absolute top-0 left-0 w-[70px] sm:w-[88px] md:w-[112px] lg:w-[149px] h-[65px] sm:h-[80px] md:h-[103px] lg:h-[137px] bg-[#ff9a35] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] lg:rounded-[10px]"
                aria-hidden="true"
              />

              {/* Career guidance image */}
              <img
                className="absolute top-[5px] sm:top-[7px] md:top-[9px] lg:top-3 left-[7px] sm:left-[10px] md:left-[13px] lg:left-4 w-[125px] sm:w-[158px] md:w-[202px] lg:w-[264px] h-[75px] sm:h-[93px] md:h-[117px] lg:h-[158px] object-cover rounded-lg"
                alt="Career guidance and counselling"
                src="/career-hero.jpg"
              />

              {/* Culture image */}
              <img
                className="absolute top-[88px] sm:top-[110px] md:top-[140px] lg:top-[186px] left-[7px] sm:left-[10px] md:left-[13px] lg:left-4 w-[117px] sm:w-[145px] md:w-[188px] lg:w-[248px] h-[130px] sm:h-[163px] md:h-[210px] lg:h-[272px] object-cover rounded-lg"
                alt="Educational culture and environment"
                src="/culture.jpg"
              />

              {/* JEE preparation image */}
              <img
                className="absolute top-[17px] sm:top-[21px] md:top-[27px] lg:top-9 left-[138px] sm:left-[172px] md:left-[220px] lg:left-[291px] w-[140px] sm:w-[175px] md:w-[225px] lg:w-[297px] h-[107px] sm:h-[136px] md:h-[175px] lg:h-[229px] object-cover rounded-lg"
                alt="JEE preparation and guidance"
                src="/jee.jpg"
              />

              {/* Hero image */}
              <img
                className="absolute top-[130px] sm:top-[163px] md:top-[210px] lg:top-[275px] left-[133px] sm:left-[166px] md:left-[212px] lg:left-[280px] w-[138px] sm:w-[172px] md:w-[220px] lg:w-[290px] h-[84px] sm:h-[105px] md:h-[135px] lg:h-[179px] object-cover rounded-lg"
                alt="Educational excellence and success"
                src="/hero.jpg"
              />
            </div>

            {/* Content section - shows second on mobile/tablet */}
            <div className="relative flex flex-col w-full max-w-[550px] items-start gap-4 sm:gap-5 order-2 lg:order-2">
              {/* Light blue blur gradient background */}
              <div className="absolute -inset-8 bg-gradient-to-br from-blue-200/50 via-blue-100/40 to-blue-50/30 rounded-[3rem] blur-2xl -z-10"></div>
              <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-100/30 via-blue-50/20 to-transparent rounded-3xl blur-xl -z-10"></div>
              
              {serviceCards.map((card) => (
                <article
                  key={card.id}
                  className="relative flex flex-col h-auto min-h-32 items-center justify-center p-6 w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100/50"
                >
                  <div className="flex items-center gap-5 w-full">
                    <div
                      className="relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: card.iconBg }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        {card.id === 1 && <UserCheck className="w-5 h-5 text-[#2925f3]" />}
                        {card.id === 2 && <FileText className="w-5 h-5 text-[#2925f3]" />}
                        {card.id === 3 && <Plane className="w-5 h-5 text-[#2925f3]" />}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-[#191A15] text-lg sm:text-xl mb-3 leading-tight">
                        {card.title}
                      </h3>

                      <p className="text-[#191A15] text-sm sm:text-base leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
              
              <a
                href="/about"
                className="inline-flex items-center gap-2 no-underline hover:opacity-80 transition-opacity self-end mt-2"
                aria-label="Learn more about our services"
              >
                <span className="font-medium text-[#0f0c89] text-base sm:text-lg">
                  Learn More
                </span>

                <div
                  className="w-6 h-6 rotate-[-90deg] flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="w-3 h-3 border-r-2 border-b-2 border-[#0f0c89] rotate-45"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}