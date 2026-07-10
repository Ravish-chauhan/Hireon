import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'

interface UseScrollRevealOptions {
    threshold?: number
    triggerOnce?: boolean
    delay?: number
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
    const { threshold = 0.1, triggerOnce = true, delay = 0 } = options
    const [isVisible, setIsVisible] = useState(false)

    const { ref, inView } = useInView({
        threshold,
        triggerOnce,
    })

    useEffect(() => {
        if (inView) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, delay)
            return () => clearTimeout(timer)
        }
    }, [inView, delay])

    return { ref, isVisible, inView }
}

// Predefined animation classes
export const animations = {
    fadeInUp: 'opacity-0 translate-y-8',
    fadeInDown: 'opacity-0 -translate-y-8',
    fadeInLeft: 'opacity-0 -translate-x-8',
    fadeInRight: 'opacity-0 translate-x-8',
    fadeIn: 'opacity-0',
    scaleIn: 'opacity-0 scale-95',
    visible: 'opacity-100 translate-x-0 translate-y-0 scale-100',
}

// Helper function to get animation classes
export function getAnimationClasses(
    isVisible: boolean,
    animation: keyof typeof animations = 'fadeInUp',
    duration: string = 'duration-700',
    easing: string = 'ease-out'
): string {
    const base = `transition-all ${duration} ${easing}`
    return isVisible
        ? `${base} ${animations.visible}`
        : `${base} ${animations[animation]}`
}
