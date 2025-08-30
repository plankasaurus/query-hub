import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass' | 'elevated'
  hoverEffect?: boolean
  glowColor?: 'blue' | 'purple' | 'cyan' | 'green' | 'none'
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', hoverEffect = true, glowColor = 'none', children, ...props }, ref) => {
    const baseClasses = cn(
      "relative overflow-hidden rounded-2xl border transition-transform duration-200",
      "group",
      className
    )

    const variantClasses = {
      default: "bg-card border-border/50",
      gradient: "bg-gradient-to-br from-card to-card/50 border-border/50",
      glass: "glass-effect",
      elevated: "bg-card/80 border-border/30 shadow-lg"
    }

    const glowClasses = {
      blue: "hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50",
      purple: "hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50",
      cyan: "hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50",
      green: "hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/50",
      none: ""
    }

    const hoverClasses = hoverEffect ? "hover:-translate-y-1 hover:scale-[1.02]" : ""

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          glowClasses[glowColor],
          hoverClasses
        )}
        {...props}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Subtle border glow on hover */}
        {glowColor !== 'none' && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className={cn(
              "absolute inset-0 rounded-2xl",
              glowColor === 'blue' && "bg-gradient-to-r from-blue-500/20 to-transparent",
              glowColor === 'purple' && "bg-gradient-to-r from-purple-500/20 to-transparent",
              glowColor === 'cyan' && "bg-gradient-to-r from-cyan-500/20 to-transparent",
              glowColor === 'green' && "bg-gradient-to-r from-green-500/20 to-transparent"
            )} />
          </div>
        )}
      </div>
    )
  }
)
ModernCard.displayName = "ModernCard"

export { ModernCard }
