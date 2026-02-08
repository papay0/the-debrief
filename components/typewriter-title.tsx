"use client"

import { useEffect, useState, useRef } from "react"

const TITLE = "The Debrief"
const BASE_DELAY = 95
const VARIANCE = 45
const PAUSE_AFTER_SPACE = 30
const CURSOR_BLINK_DURATION = 1500

export function TypewriterTitle() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [done, setDone] = useState(false)
  const [cursorDismissed, setCursorDismissed] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const typeNext = (index: number) => {
      if (index > TITLE.length) {
        setDone(true)
        setTimeout(() => setCursorDismissed(true), CURSOR_BLINK_DURATION)
        return
      }

      setVisibleCount(index)

      const char = TITLE[index - 1]
      const extraPause = char === " " ? PAUSE_AFTER_SPACE : 0
      const jitter = Math.random() * VARIANCE - VARIANCE / 2
      const delay = BASE_DELAY + extraPause + jitter

      timeoutRef.current = setTimeout(() => typeNext(index + 1), delay)
    }

    typeNext(1)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Cursor blink
  useEffect(() => {
    if (cursorDismissed) return
    const interval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [cursorDismissed])

  // Only render the characters typed so far
  const typed = TITLE.slice(0, visibleCount)

  return (
    <span className="typewriter-title text-base font-semibold font-serif text-foreground">
      {typed.split("").map((char, i) => {
        const justTyped = i === visibleCount - 1 && !done
        return (
          <span
            key={i}
            className={justTyped ? "typewriter-letter--strike" : ""}
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        )
      })}
      {!cursorDismissed && (
        <span
          className={`typewriter-cursor ${cursorVisible ? "typewriter-cursor--on" : "typewriter-cursor--off"} ${done ? "typewriter-cursor--done" : ""}`}
          aria-hidden="true"
        />
      )}
    </span>
  )
}
