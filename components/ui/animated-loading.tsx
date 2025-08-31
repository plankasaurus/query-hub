'use client'

import React, { useState, useEffect } from 'react'

interface AnimatedLoadingProps {
    className?: string
}

const loadingMessages = [
    "Analyzing Australia's data",
    "Searching the ABS",
    "Generating insights",
    "Checking facts",
    "Aggregating responses",
    "Citing Results"
]

export function AnimatedLoading({ className = "" }: AnimatedLoadingProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out current message
            setIsVisible(false)

            // Wait for fade out, then change message and fade in
            setTimeout(() => {
                setCurrentMessageIndex((prevIndex) =>
                    (prevIndex + 1) % loadingMessages.length
                )
                setIsVisible(true)
            }, 300) // Half of the total transition time
        }, 5000) // Change message every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`${className}`}>
            <div className="min-h-[24px] flex items-center justify-center">
                <p
                    className="text-base text-muted-foreground transition-all duration-600 ease-in-out"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
                        transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out'
                    }}
                >
                    {loadingMessages[currentMessageIndex]}...
                </p>
            </div>
        </div>
    )
}
