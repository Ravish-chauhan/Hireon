import React from 'react'
import { Carousel } from '../ui/Carousel'
import { TestimonialCard } from '../ui/TestimonialCard'

interface TestimonialsSectionProps {
  authPage?: boolean
}

export const TestimonialsSection = ({ authPage = false }: TestimonialsSectionProps) => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'MBBS Student, AIIMS Delhi',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      testimonial:
        "Eduniaa's guidance was instrumental in my NEET preparation. Their personalized study plan and mentor support helped me secure a seat at AIIMS Delhi.",
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      role: 'Engineering Student, IIT Bombay',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      testimonial:
        "I was struggling with JEE preparation until I joined Eduniaa's mentorship program. Their structured approach and mock tests boosted my confidence and performance.",
      rating: 5,
    },
    {
      name: 'Ananya Patel',
      role: 'MBA Student, IIM Ahmedabad',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      testimonial:
        'The CAT coaching and interview preparation at Eduniaa were exceptional. Their guidance on essays and personal interviews was crucial for my IIM selection.',
      rating: 4,
    },
    {
      name: 'Vikram Singh',
      role: 'Law Student, NLSIU Bangalore',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      testimonial:
        "Eduniaa's CLAT preparation strategy was comprehensive and effective. Their mentors provided invaluable insights that helped me crack the exam.",
      rating: 5,
    },
    {
      name: 'Neha Gupta',
      role: 'Study Abroad Student, Stanford University',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      testimonial:
        "From SAT prep to university applications, Eduniaa guided me through every step of my study abroad journey. I couldn't have made it to Stanford without their support.",
      rating: 5,
    },
    {
      name: 'Arjun Mehta',
      role: 'CA Student, ICAI',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      testimonial:
        "Eduniaa's CA Foundation and Intermediate coaching was outstanding. Their expert faculty and comprehensive study materials helped me clear both levels with distinction.",
      rating: 5,
    },
  ]

  // Group testimonials for desktop view (3 per slide)
  const desktopTestimonialGroups = []
  for (let i = 0; i < testimonials.length; i += 3) {
    desktopTestimonialGroups.push(testimonials.slice(i, i + 3))
  }

  if (authPage) {
    // Auth page: Show only carousel
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="hidden lg:block">
            <Carousel autoPlay={true} interval={6000}>
              {desktopTestimonialGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="grid grid-cols-3 gap-6 px-4">
                  {group.map((testimonial, index) => (
                    <TestimonialCard
                      key={index}
                      name={testimonial.name}
                      role={testimonial.role}
                      testimonial={testimonial.testimonial}
                      image={testimonial.image}
                      rating={testimonial.rating}
                    />
                  ))}
                </div>
              ))}
            </Carousel>
          </div>
          <div className="hidden md:block lg:hidden">
            <Carousel autoPlay={true} interval={5000}>
              {Array.from({ length: Math.ceil(testimonials.length / 2) }, (_, groupIndex) => (
                <div key={groupIndex} className="grid grid-cols-2 gap-4 px-4">
                  {testimonials.slice(groupIndex * 2, groupIndex * 2 + 2).map((testimonial, index) => (
                    <TestimonialCard
                      key={index}
                      name={testimonial.name}
                      role={testimonial.role}
                      testimonial={testimonial.testimonial}
                      image={testimonial.image}
                      rating={testimonial.rating}
                    />
                  ))}
                </div>
              ))}
            </Carousel>
          </div>
          <div className="md:hidden">
            <Carousel autoPlay={true} interval={4000}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-4">
                  <TestimonialCard
                    name={testimonial.name}
                    role={testimonial.role}
                    testimonial={testimonial.testimonial}
                    image={testimonial.image}
                    rating={testimonial.rating}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    )
  }

  // Home page: Show full section
  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Student Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from students who transformed their educational journey with
            Eduniaa's guidance.
          </p>
        </div>

        {/* Desktop Carousel (3 items per slide) */}
        <div className="hidden lg:block">
          <Carousel autoPlay={true} interval={6000}>
            {desktopTestimonialGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="grid grid-cols-3 gap-6 px-4"
              >
                {group.map((testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    name={testimonial.name}
                    role={testimonial.role}
                    testimonial={testimonial.testimonial}
                    image={testimonial.image}
                    rating={testimonial.rating}
                  />
                ))}
              </div>
            ))}
          </Carousel>
        </div>

        {/* Tablet Carousel (2 items per slide) */}
        <div className="hidden md:block lg:hidden">
          <Carousel autoPlay={true} interval={5000}>
            {Array.from({ length: Math.ceil(testimonials.length / 2) }, (_, groupIndex) => (
              <div
                key={groupIndex}
                className="grid grid-cols-2 gap-4 px-4"
              >
                {testimonials.slice(groupIndex * 2, groupIndex * 2 + 2).map((testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    name={testimonial.name}
                    role={testimonial.role}
                    testimonial={testimonial.testimonial}
                    image={testimonial.image}
                    rating={testimonial.rating}
                  />
                ))}
              </div>
            ))}
          </Carousel>
        </div>

        {/* Mobile Carousel (1 item per slide) */}
        <div className="md:hidden">
          <Carousel autoPlay={true} interval={4000}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-4">
                <TestimonialCard
                  name={testimonial.name}
                  role={testimonial.role}
                  testimonial={testimonial.testimonial}
                  image={testimonial.image}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  )
}