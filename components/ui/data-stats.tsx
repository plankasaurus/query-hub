"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export interface DataStatProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
  className?: string
  variant?: 'default' | 'highlight' | 'muted'
}

export function DataStat({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  className,
  variant = 'default'
}: DataStatProps) {
  const [displayValue, setDisplayValue] = React.useState(0)
  
  React.useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value.toString())
    if (isNaN(numericValue)) return
    
    const duration = 1000
    const steps = 60
    const increment = numericValue / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setDisplayValue(numericValue)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value])

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-500'
      case 'decrease':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const variantClasses = {
    default: "bg-card/50 border-border/50",
    highlight: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
    muted: "bg-muted/30 border-border/30"
  }

  return (
    <div className={cn(
      "p-6 rounded-2xl border backdrop-blur-sm transition-transform duration-200 hover:scale-105",
      variantClasses[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-primary">
          {typeof value === 'number' ? displayValue.toLocaleString() : value}
        </div>
        
        {change !== undefined && (
          <div className="flex items-center space-x-2">
            {getChangeIcon()}
            <span className={cn("text-sm font-medium", getChangeColor())}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export interface DataStatsGridProps {
  children: React.ReactNode
  className?: string
  columns?: 2 | 3 | 4 | 5 | 6
}

export function DataStatsGrid({ children, className, columns = 4 }: DataStatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
  }

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  )
}
