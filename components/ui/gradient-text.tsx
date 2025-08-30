import * as React from "react"
import { cn } from "@/lib/utils"

export interface GradientTextProps {
    children: React.ReactNode
    variant?: 'blue' | 'purple' | 'cyan' | 'green' | 'rainbow' | 'custom'
    customGradient?: string
    className?: string
}

export function GradientText({
    children,
    variant = 'blue',
    customGradient,
    className
}: GradientTextProps) {
    const gradients = {
        blue: "bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500",
        purple: "bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500",
        cyan: "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500",
        green: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500",
        rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
    }

    const gradient = customGradient || gradients[variant]

    return (
        <span className={cn(
            "bg-clip-text text-transparent",
            gradient,
            className
        )}>
            {children}
        </span>
    )
}

export interface AnimatedGradientTextProps extends GradientTextProps {
    animate?: boolean
}

export function AnimatedGradientText({
    children,
    variant = 'blue',
    customGradient,
    className,
    animate = true
}: AnimatedGradientTextProps) {
    const gradients = {
        blue: "bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500",
        purple: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
        cyan: "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500",
        green: "bg-gradient-to-r from-green-500 via-blue-500 to-purple-500",
        rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
    }

    const gradient = customGradient || gradients[variant]

    return (
        <span className={cn(
            "bg-clip-text text-transparent bg-[length:200%_200%]",
            gradient,
            animate && "animate-shimmer",
            className
        )}>
            {children}
        </span>
    )
}
