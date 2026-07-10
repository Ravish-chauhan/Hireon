import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { BLOGS_DATA } from '../../data/blogsData';
import { useScrollReveal, getAnimationClasses } from '../../hooks/useScrollReveal'

interface NewsItem {
  _id?: string
  id?: string | number
  title: string
  summary: string
  createdAt?: string
  date?: string
  category: string
  image: string
}

export const NewsSection = () => {
  const navigate = useNavigate()
  const [selectedNews, setSelectedNews] = useState(0)

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ delay: 0 })

  const sideNewsItems = BLOGS_DATA.slice(0, 3).map((blog, index) => ({
    id: index + 1,
    category: blog.category,
    title: blog.title,
    summary: blog.summary,
    image: blog.image,
    createdAt: new Date(blog.createdAt).toLocaleDateString('en-GB')
  }));

  const handleNewsClick = (index: number) => {
    setSelectedNews(index)
  }

  const handleMobileNewsClick = () => {
    navigate('/blogs')
  }

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
                The Quantum Corner
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#191A15] text-center leading-tight">
                Latest news & Updates
              </h1>

              <p className="text-[#191A15] text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-3xl">
                Stay updated with the latest educational news and exam notifications
              </p>
            </div>
          </header>

          {/* Mobile View - Only News Cards */}
          <div className="flex flex-col lg:hidden items-start gap-6 w-full">
            {sideNewsItems.map((item, index) => (
              <MobileNewsCard
                key={item.id}
                item={item}
                index={index}
                onClick={handleMobileNewsClick}
              />
            ))}
          </div>

          {/* Desktop View - Interactive Layout */}
          <div className="hidden lg:flex flex-row items-start justify-between gap-12 w-full 2xl:max-w-[1350px] 2xl:mx-auto">
            <FeaturedNewsCard
              item={sideNewsItems[selectedNews]}
              onViewAll={() => navigate('/blogs')}
            />

            <div className="flex flex-col w-[676px] items-start gap-8">
              {sideNewsItems.map((item, index) => (
                <SideNewsCard
                  key={item.id}
                  item={item}
                  index={index}
                  isSelected={selectedNews === index}
                  onClick={() => handleNewsClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface MobileNewsCardProps {
  item: NewsItem
  index: number
  onClick: () => void
}

const MobileNewsCard: React.FC<MobileNewsCardProps> = ({ item, index, onClick }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 100 })

  return (
    <article
      ref={ref}
      className={`flex flex-col items-start gap-4 w-full cursor-pointer p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group ${getAnimationClasses(isVisible, 'fadeInUp', 'duration-500')}`}
      onClick={onClick}
    >
      <div className="relative w-full overflow-hidden rounded-lg">
        <img
          className="w-full h-[200px] object-cover group-hover:scale-110 transition-transform duration-500"
          alt={item.title}
          src={item.image}
        />
        <div className="absolute top-4 left-4 bg-[#0066ff] px-3 py-1 rounded-full">
          <span className="text-white text-xs font-medium">
            {item.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 w-full">
        <time className="text-[#191a1561] text-xs">
          {item.createdAt}
        </time>

        <h3 className="font-bold text-[#191A15] text-lg leading-tight group-hover:text-[#0066ff] transition-colors duration-300">
          {item.title}
        </h3>

        <p className="text-[#6b6969] text-sm leading-relaxed">
          {item.summary}
        </p>
      </div>
    </article>
  )
}

interface FeaturedNewsCardProps {
  item: NewsItem
  onViewAll: () => void
}

const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({ item, onViewAll }) => {
  const { ref, isVisible } = useScrollReveal({ delay: 0 })

  return (
    <article
      ref={ref}
      className={`flex flex-col w-[459px] items-start gap-4 relative ${getAnimationClasses(isVisible, 'fadeInLeft', 'duration-700')}`}
    >
      <div className="relative w-full overflow-hidden rounded-lg">
        <img
          className="w-full h-[262px] object-cover hover:scale-105 transition-transform duration-500"
          alt={item.title}
          src={item.image}
        />
        <div className="absolute top-4 left-4 bg-[#0066ff] px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">
            {item.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 w-full">
        <div className="flex flex-col items-start gap-2 w-full">
          <time className="text-[#191a1561] text-xs">
            {item.createdAt}
          </time>

          <div className="flex flex-col items-start gap-3 w-full">
            <h2 className="font-bold text-[#191A15] text-2xl leading-tight">
              {item.title}
            </h2>

            <p className="text-[#6b6969] text-sm leading-relaxed">
              {item.summary}
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-2 text-[#0f0c89] font-bold text-lg hover:underline group"
        >
          View All
          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </article>
  )
}

interface SideNewsCardProps {
  item: NewsItem
  index: number
  isSelected: boolean
  onClick: () => void
}

const SideNewsCard: React.FC<SideNewsCardProps> = ({ item, index, isSelected, onClick }) => {
  const { ref, isVisible } = useScrollReveal({ delay: index * 100 + 100 })

  return (
    <article
      ref={ref}
      className={`flex flex-row items-start gap-8 w-full cursor-pointer p-2 rounded-lg transition-all duration-300 group ${isSelected
        ? 'bg-blue-50 border border-blue-200 shadow-lg scale-[1.02]'
        : 'hover:bg-gray-50 hover:shadow-md hover:scale-[1.01]'
        } ${getAnimationClasses(isVisible, 'fadeInRight', 'duration-500')}`}
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-lg flex-shrink-0">
        <img
          className="w-[228px] h-[140px] object-cover group-hover:scale-110 transition-transform duration-500"
          alt={item.title}
          src={item.image}
        />
      </div>

      <div className="flex flex-col w-full items-start gap-2">
        <span className={`font-bold text-xs uppercase transition-colors duration-300 ${isSelected ? 'text-[#0066ff]' : 'text-[#0066ff]'
          }`}>
          {item.category}
        </span>

        <div className="flex flex-col items-start gap-2 w-full">
          <h3 className={`font-bold text-xl leading-tight transition-colors duration-300 ${isSelected ? 'text-[#0066ff]' : 'text-[#191A15] group-hover:text-[#0066ff]'
            }`}>
            {item.title}
          </h3>

          <p className="text-[#6b6969] text-sm leading-relaxed">
            {item.summary}
          </p>
        </div>
      </div>
    </article>
  )
}