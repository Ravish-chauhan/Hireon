import React from 'react'
import { Carousel } from '../ui/Carousel'
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'
import { Star, Briefcase, Quote } from 'lucide-react'

const testimonials = [
    {
        name: 'Priya Mehta',
        role: 'Software Engineer',
        company: 'Google',
        image: 'https://randomuser.me/api/portraits/women/32.jpg',
        testimonial: 'The AI suggestions were spot-on! I went from zero callbacks to landing interviews at top tech companies within a week of updating my resume.',
        rating: 5,
    },
    {
        name: 'Aanya Sharma',
        role: 'Admitted Student',
        company: 'Stanford',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        testimonial: 'The AI suggestions helped me articulate my research experience perfectly. Got accepted to Stanford and 2 other Ivy League schools!',
        rating: 5,
    },
    {
        name: 'Rahul Sharma',
        role: 'Product Manager',
        company: 'Microsoft',
        image: 'https://randomuser.me/api/portraits/men/45.jpg',
        testimonial: 'I was skeptical at first, but the templates are genuinely professional. The ATS optimization feature really works – my application response rate tripled.',
        rating: 5,
    },
    {
        name: 'Rohan Patel',
        role: 'Admitted Student',
        company: 'MIT',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        testimonial: 'I struggled to present my extracurriculars compellingly. This builder organized everything beautifully for my MIT application.',
        rating: 5,
    },
    {
        name: 'Anjali Verma',
        role: 'Marketing Lead',
        company: 'Meta',
        image: 'https://randomuser.me/api/portraits/women/28.jpg',
        testimonial: 'Creating a standout resume used to take me hours. Now I can tailor a perfect version for each job in under 10 minutes. Absolutely game-changing!',
        rating: 5,
    },
    {
        name: 'Priyanka Verma',
        role: 'Admitted Student',
        company: 'Oxford',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        testimonial: 'The templates are exactly what UK universities expect. Perfect for international applications - got into Oxford and Cambridge!',
        rating: 5,
    },
]

const ResumeTestimonials: React.FC = () => {
    const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })

    // Group testimonials for desktop view (3 per slide)
    const desktopTestimonialGroups = []
    for (let i = 0; i < testimonials.length; i += 3) {
        desktopTestimonialGroups.push(testimonials.slice(i, i + 3))
    }

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={`text-center mb-12 ${getAnimationClasses(headerVisible, 'fadeInUp')}`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 mb-6">
                        <Star className="w-4 h-4 text-green-600 fill-green-600" />
                        <span className="text-green-800 font-medium text-sm">Success Stories</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Trusted by{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                            Professionals & Students Worldwide
                        </span>
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                        See how our resume builder has helped candidates land roles at top companies and admissions at elite universities
                    </p>
                </div>

                {/* Desktop Carousel (3 items per slide) */}
                <div className="hidden lg:block">
                    <Carousel autoPlay={true} interval={6000}>
                        {desktopTestimonialGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="grid grid-cols-3 gap-6 px-4">
                                {group.map((testimonial, index) => (
                                    <TestimonialCard key={index} testimonial={testimonial} />
                                ))}
                            </div>
                        ))}
                    </Carousel>
                </div>

                {/* Tablet Carousel (2 items per slide) */}
                <div className="hidden md:block lg:hidden">
                    <Carousel autoPlay={true} interval={5000}>
                        {Array.from({ length: Math.ceil(testimonials.length / 2) }, (_, groupIndex) => (
                            <div key={groupIndex} className="grid grid-cols-2 gap-4 px-4">
                                {testimonials.slice(groupIndex * 2, groupIndex * 2 + 2).map((testimonial, index) => (
                                    <TestimonialCard key={index} testimonial={testimonial} />
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
                                <TestimonialCard testimonial={testimonial} />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    )
}

interface TestimonialCardProps {
    testimonial: typeof testimonials[0]
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            {/* Quote Icon */}
            <div className="mb-4">
                <Quote className="w-8 h-8 text-blue-100 fill-blue-100" />
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-600 leading-relaxed flex-grow mb-6">
                "{testimonial.testimonial}"
            </p>

            {/* Rating */}
            <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200 fill-gray-200'
                            }`}
                    />
                ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span>{testimonial.role}</span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1 text-blue-600">
                            <Briefcase className="w-3 h-3" />
                            {testimonial.company}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeTestimonials
