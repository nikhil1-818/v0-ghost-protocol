"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface EntropyMeterProps {
  value: number // 0-100
  label?: string
  showPercentage?: boolean
  className?: string
  animate?: boolean
}

export function EntropyMeter({
  value,
  label = "DATA ENTROPY",
  showPercentage = true,
  className,
  animate = true,
}: EntropyMeterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value)
      return
    }

    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0

    const interval = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [value, animate])

  const getColor = (val: number) => {
    if (val < 33) return "bg-primary"
    if (val < 66) return "bg-ghost-warning"
    return "bg-ghost-danger"
  }

  const getGlow = (val: number) => {
    if (val < 33) return "shadow-primary/50"
    if (val < 66) return "shadow-ghost-warning/50"
    return "shadow-ghost-danger/50"
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground tracking-wider">
          {label}
        </span>
        {showPercentage && (
          <span className="font-mono text-sm text-foreground tabular-nums">
            {displayValue.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
            getColor(displayValue),
            "shadow-lg",
            getGlow(displayValue)
          )}
          style={{ width: `${displayValue}%` }}
        />
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>INTACT</span>
        <span>DEGRADED</span>
        <span>DESTROYED</span>
      </div>
    </div>
  )
}

interface DataFlowVisualizerProps {
  active?: boolean
  className?: string
}

export function DataFlowVisualizer({ active = false, className }: DataFlowVisualizerProps) {
  return (
    <div className={cn("relative h-32 overflow-hidden rounded-lg bg-black/30 border border-border/50", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-sm transition-all duration-300",
                active
                  ? i % 3 === 0
                    ? "bg-primary animate-pulse"
                    : i % 5 === 0
                    ? "bg-ghost-warning/50"
                    : "bg-secondary"
                  : "bg-secondary"
              )}
              style={{
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      </div>
      {active && (
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 animate-pulse" />
      )}
    </div>
  )
}
