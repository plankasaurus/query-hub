import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'processing'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function StatusIndicator({ 
  status, 
  size = 'md', 
  showLabel = false, 
  className 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }

  const statusConfig = {
    online: {
      color: "bg-green-500",
      pulse: true,
      label: "Online"
    },
    offline: {
      color: "bg-gray-500",
      pulse: false,
      label: "Offline"
    },
    warning: {
      color: "bg-yellow-500",
      pulse: true,
      label: "Warning"
    },
    error: {
      color: "bg-red-500",
      pulse: true,
      label: "Error"
    },
    processing: {
      color: "bg-blue-500",
      pulse: true,
      label: "Processing"
    }
  }

  const config = statusConfig[status]

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "rounded-full",
        sizeClasses[size],
        config.color,
        config.pulse && "animate-pulse"
      )} />
      {showLabel && (
        <span className="text-sm text-muted-foreground font-medium">
          {config.label}
        </span>
      )}
    </div>
  )
}

export interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  return (
    <div className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
      <StatusIndicator status="online" size="sm" />
      <span>Connected to Data Hub</span>
    </div>
  )
}
