import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseCounterOptions {
    start?: number
    end: number
    duration?: number
    suffix?: string
    prefix?: string
}

export function useCounterAnimation(options: UseCounterOptions) {
    const { start = 0, end, duration = 2000, suffix = '', prefix = '' } = options
    const [count, setCount] = useState(start)
    const [hasAnimated, setHasAnimated] = useState(false)

    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    })

    useEffect(() => {
        if (inView && !hasAnimated) {
            setHasAnimated(true)
            const startTime = Date.now()
            const difference = end - start

            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)

                // Easing function (easeOutQuart)
                const easeProgress = 1 - Math.pow(1 - progress, 4)

                const currentCount = Math.round(start + difference * easeProgress)
                setCount(currentCount)

                if (progress < 1) {
                    requestAnimationFrame(animate)
                }
            }

            requestAnimationFrame(animate)
        }
    }, [inView, hasAnimated, start, end, duration])

    return {
        ref,
        count,
        displayValue: `${prefix}${count.toLocaleString()}${suffix}`,
    }
}
