import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'spinner'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )
      
      case 'pulse':
        return (
          <div className={cn(
            "rounded-full bg-primary animate-pulse",
            sizeClasses[size]
          )} />
        )
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            <div className="w-1 bg-primary animate-pulse" style={{ animationDelay: '0ms', height: '100%' }} />
            <div className="w-1 bg-primary animate-pulse" style={{ animationDelay: '150ms', height: '100%' }} />
            <div className="w-1 bg-primary animate-pulse" style={{ animationDelay: '300ms', height: '100%' }} />
          </div>
        )
      
      case 'spinner':
        return (
          <div className={cn(
            "border-2 border-muted border-t-primary rounded-full animate-spin",
            sizeClasses[size]
          )} />
        )
      
      default:
        return (
          <div className={cn(
            "border-2 border-muted border-t-primary rounded-full animate-spin",
            sizeClasses[size]
          )} />
        )
    }
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {renderSpinner()}
    </div>
  )
}

export interface LoadingOverlayProps {
  children?: React.ReactNode
  className?: string
}

export function LoadingOverlay({ children, className }: LoadingOverlayProps) {
  return (
    <div className={cn(
      "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
      className
    )}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" variant="spinner" />
        {children && (
          <p className="text-muted-foreground font-medium">{children}</p>
        )}
      </div>
    </div>
  )
}
