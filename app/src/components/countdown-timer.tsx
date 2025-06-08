"use client"

import { useState, useEffect } from "react"
import styles from "./countdown-timer.module.css"

interface CountdownTimerProps {
  endTime: number
  onComplete?: () => void
}

export function CountdownTimer({ endTime, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = Math.max(0, endTime - now)

      if (difference <= 0 && onComplete) {
        onComplete()
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onComplete])

  return (
    <div className={styles.countdownContainer}>
      <div className={styles.countdownItem}>
        <div className={styles.countdownValue}>{timeLeft.days.toString().padStart(2, "0")}</div>
        <div className={styles.countdownLabel}>Days</div>
      </div>
      <div className={styles.countdownSeparator}>:</div>
      <div className={styles.countdownItem}>
        <div className={styles.countdownValue}>{timeLeft.hours.toString().padStart(2, "0")}</div>
        <div className={styles.countdownLabel}>Hours</div>
      </div>
      <div className={styles.countdownSeparator}>:</div>
      <div className={styles.countdownItem}>
        <div className={styles.countdownValue}>{timeLeft.minutes.toString().padStart(2, "0")}</div>
        <div className={styles.countdownLabel}>Minutes</div>
      </div>
      <div className={styles.countdownSeparator}>:</div>
      <div className={styles.countdownItem}>
        <div className={styles.countdownValue}>{timeLeft.seconds.toString().padStart(2, "0")}</div>
        <div className={styles.countdownLabel}>Seconds</div>
      </div>
    </div>
  )
}
