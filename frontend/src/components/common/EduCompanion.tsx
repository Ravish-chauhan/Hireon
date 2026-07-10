import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { LeadForm } from '../ui/LeadForm'
import { FaTimes } from 'react-icons/fa'
import './EduCompanion.css'

// Contextual messages based on current route
const getContextualMessage = (pathname: string): { emoji: string; text: string } => {
    if (pathname === '/') {
        return { emoji: '👋', text: "Hey! Need help finding your dream college?" }
    }
    if (pathname.includes('/exam')) {
        return { emoji: '📚', text: "Confused about exam prep? I'm here to help!" }
    }
    if (pathname.includes('/college')) {
        return { emoji: '🎓', text: "Looking for the perfect college? Let's chat!" }
    }
    if (pathname.includes('/resume')) {
        return { emoji: '📝', text: "Need help with your resume? I've got tips!" }
    }
    return { emoji: '✨', text: "Got questions? I've got answers!" }
}

// Generate confetti pieces
const generateConfetti = () => {
    const colors = ['#f8a859', '#FF6B6B', '#0F0C89', '#4CAF50', '#9C27B0', '#00BCD4']
    return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        size: Math.random() * 8 + 4,
    }))
}

export const EduCompanion: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [showSpeech, setShowSpeech] = useState(false)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)
    const location = useLocation()

    // Show companion after a gentle delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    // Show speech bubble after companion appears
    useEffect(() => {
        if (isVisible && !hasInteracted) {
            const timer = setTimeout(() => {
                setShowSpeech(true)
                // Auto-hide speech after 8 seconds if no interaction
                const hideTimer = setTimeout(() => {
                    setShowSpeech(false)
                }, 8000)
                return () => clearTimeout(hideTimer)
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [isVisible, hasInteracted])

    // Handle orb click
    const handleOrbClick = useCallback(() => {
        setHasInteracted(true)
        setShowSpeech(false)
        setIsPanelOpen(true)
    }, [])

    // Handle panel close
    const handleClosePanel = useCallback(() => {
        setIsPanelOpen(false)
    }, [])

    // Trigger celebration (called from LeadForm success)
    const triggerCelebration = useCallback(() => {
        setShowCelebration(true)
        setTimeout(() => {
            setShowCelebration(false)
        }, 3000)
    }, [])

    // Listen for form success event
    useEffect(() => {
        const handleFormSuccess = () => {
            triggerCelebration()
            setIsPanelOpen(false)
        }
        window.addEventListener('edu-form-success', handleFormSuccess)
        return () => window.removeEventListener('edu-form-success', handleFormSuccess)
    }, [triggerCelebration])

    const contextualMessage = getContextualMessage(location.pathname)
    const confetti = generateConfetti()

    if (!isVisible) return null

    return (
        <>
            {/* The Companion Container */}
            <div className="edu-companion">
                {/* Speech Bubble */}
                {showSpeech && !isPanelOpen && (
                    <div className="edu-speech">
                        <p className="edu-speech-text">
                            <span className="edu-speech-wave">{contextualMessage.emoji}</span>{' '}
                            {contextualMessage.text}
                        </p>
                    </div>
                )}

                {/* The Floating Orb */}
                <div
                    className="edu-orb"
                    onClick={handleOrbClick}
                    onMouseEnter={() => !hasInteracted && setShowSpeech(true)}
                    role="button"
                    aria-label="Open contact form"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleOrbClick()}
                >
                    {/* Pulse Rings */}
                    <div className="edu-orb-ring" />
                    <div className="edu-orb-ring" />
                    <div className="edu-orb-ring" />

                    {/* The Glowing Orb */}
                    <div className="edu-orb-inner" />

                    {/* Floating Particles */}
                    <div className="edu-particles">
                        <div className="edu-particle" />
                        <div className="edu-particle" />
                        <div className="edu-particle" />
                        <div className="edu-particle" />
                        <div className="edu-particle" />
                    </div>
                </div>
            </div>

            {/* Slide-out Panel */}
            {isPanelOpen && (
                <div className="edu-panel">
                    {/* Header */}
                    <div className="edu-panel-header">
                        <div className="edu-panel-header-content">
                            <h2 className="edu-panel-title">
                                <span>✨</span> Let's Connect!
                            </h2>
                            <p className="edu-panel-subtitle">
                                Get personalized guidance from our education experts
                            </p>
                        </div>
                        <button
                            className="edu-panel-close"
                            onClick={handleClosePanel}
                            aria-label="Close panel"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="edu-panel-body">
                        <LeadForm />
                    </div>
                </div>
            )}

            {/* Celebration Confetti */}
            {showCelebration && (
                <div className="edu-celebration">
                    {confetti.map((piece) => (
                        <div
                            key={piece.id}
                            className="confetti"
                            style={{
                                left: `${piece.left}%`,
                                backgroundColor: piece.color,
                                width: `${piece.size}px`,
                                height: `${piece.size}px`,
                                animationDelay: `${piece.delay}s`,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
