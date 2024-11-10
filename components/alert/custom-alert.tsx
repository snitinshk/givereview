'use client'

import { CheckCircle, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CustomAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export default function CustomAlert(
  { type = 'success', title = 'Success!', message = 'Operation completed successfully.' }: CustomAlertProps
) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const duration = 3000 // 10 seconds
    const interval = 100 // Update every 100ms for smooth animation

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(timer)
          setIsVisible(false)
          return 0
        }
        return prevProgress - (100 * interval / duration)
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const isSuccess = type === 'success'

  return (
    <div className={cn(
      "fixed top-4 right-4 w-80 transition-all duration-300 overflow-hidden rounded-lg shadow-lg",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px] pointer-events-none"
    )}>
      <div className={cn(
        "h-2 transition-all duration-300 ease-out",
        isSuccess ? "bg-green-500" : "bg-red-500"
      )} style={{ width: `${progress}%` }} />
      <div className="bg-white text-black p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <h4 className="font-semibold text-lg">{title}</h4>
        </div>
        <p className="text-gray-600">
          {message}
        </p>
      </div>
    </div>
  )
}