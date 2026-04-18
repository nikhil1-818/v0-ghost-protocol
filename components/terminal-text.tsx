"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TerminalTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  showCursor?: boolean
  onComplete?: () => void
}

export function TerminalText({
  text,
  className,
  speed = 50,
  delay = 0,
  showCursor = true,
  onComplete,
}: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!hasStarted) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, hasStarted, onComplete])

  return (
    <span className={cn("font-mono", className)}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="cursor-blink text-primary">_</span>
      )}
    </span>
  )
}

interface TerminalLogProps {
  logs: string[]
  className?: string
}

export function TerminalLog({ logs, className }: TerminalLogProps) {
  return (
    <div className={cn("font-mono text-xs space-y-1 bg-black/50 p-4 rounded-lg border border-border/50", className)}>
      {logs.map((log, index) => (
        <div key={index} className="flex items-start gap-2">
          <span className="text-primary shrink-0">{">>"}</span>
          <span className="text-muted-foreground">{log}</span>
        </div>
      ))}
    </div>
  )
}
