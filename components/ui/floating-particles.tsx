"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingParticlesProps {
    count?: number
    className?: string
}

export function FloatingParticles({ count = 20, className }: FloatingParticlesProps) {
    const particles = React.useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 20
        }))
    }, [count])

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`
                    }}
                />
            ))}
        </div>
    )
}

export interface GridPatternProps {
    className?: string
    size?: number
    strokeWidth?: number
    strokeDasharray?: string
}

export function GridPattern({
    className,
    size = 20,
    strokeWidth = 1,
    strokeDasharray = "1,3"
}: GridPatternProps) {
    return (
        <svg
            className={cn("absolute inset-0 w-full h-full", className)}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id="grid"
                    width={size}
                    height={size}
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d={`M ${size} 0 L 0 0 0 ${size}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        className="text-border/20"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    )
}
