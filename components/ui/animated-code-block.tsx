"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedCodeBlockProps {
  lines: string[]
  className?: string
  theme?: "light" | "dark"
  delay?: number
  staggerDelay?: number
}

export function AnimatedCodeBlock({
  lines,
  className = "",
  theme = "dark",
  delay = 0.5,
  staggerDelay = 0.1,
}: AnimatedCodeBlockProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  const highlightSyntax = (line: string, index: number) => {
    // Split line into tokens for highlighting
    const tokens = []
    let currentIndex = 0
    
    // Patterns for different syntax elements
    const patterns = [
      { regex: /(https?:\/\/[^\s`'"]+)/g, className: "text-blue-400" }, // URLs
      { regex: /(GET|POST|PUT|DELETE|PATCH)/g, className: "text-green-400 font-semibold" }, // HTTP methods
      { regex: /(Authorization|Bearer|Content-Type|Accept)/g, className: "text-purple-400 font-medium" }, // Headers
      { regex: /(YOUR_API_KEY|API_KEY)/g, className: "text-yellow-400 font-medium" }, // API keys
      { regex: /(curl|fetch|const|await|headers)/g, className: "text-cyan-400 font-medium" }, // Keywords
      { regex: /(".*?")/g, className: "text-green-300" }, // Strings
      { regex: /(`.*?`)/g, className: "text-blue-300" }, // Backticks
      { regex: /(\{|\}|\[|\]|\(|\))/g, className: "text-gray-300" }, // Brackets
      { regex: /(\/\/.*$)/g, className: "text-gray-500 italic" }, // Comments
    ]

    let processedLine = line
    const highlights: Array<{ start: number; end: number; className: string }> = []

    // Find all matches for each pattern
    patterns.forEach(({ regex, className }) => {
      let match
      while ((match = regex.exec(line)) !== null) {
        highlights.push({
          start: match.index,
          end: match.index + match[0].length,
          className,
        })
      }
    })

    // Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start)

    // Remove overlapping highlights (keep the first one)
    const filteredHighlights = highlights.filter((highlight, index) => {
      if (index === 0) return true
      const prevHighlight = highlights[index - 1]
      return highlight.start >= prevHighlight.end
    })

    // Build the highlighted line
    if (filteredHighlights.length === 0) {
      return <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>{line}</span>
    }

    const parts = []
    let lastEnd = 0

    filteredHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start > lastEnd) {
        parts.push(
          <span
            key={`text-${index}`}
            className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
          >
            {line.slice(lastEnd, highlight.start)}
          </span>
        )
      }

      // Add highlighted text
      parts.push(
        <span key={`highlight-${index}`} className={highlight.className}>
          {line.slice(highlight.start, highlight.end)}
        </span>
      )

      lastEnd = highlight.end
    })

    // Add remaining text
    if (lastEnd < line.length) {
      parts.push(
        <span
          key="text-end"
          className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
        >
          {line.slice(lastEnd)}
        </span>
      )
    }

    return <>{parts}</>
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  }

  const lineVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const themeClasses = {
    dark: {
      container: "bg-gray-900 border-gray-700 shadow-2xl",
      header: "bg-gray-800 border-gray-700",
      dot: "bg-red-500",
      dot2: "bg-yellow-500",
      dot3: "bg-green-500",
      lineNumber: "text-gray-500",
    },
    light: {
      container: "bg-white border-gray-200 shadow-lg",
      header: "bg-gray-50 border-gray-200",
      dot: "bg-red-400",
      dot2: "bg-yellow-400",
      dot3: "bg-green-400",
      lineNumber: "text-gray-400",
    },
  }

  const currentTheme = themeClasses[theme]

  return (
    <div
      className={`
        relative rounded-xl border overflow-hidden font-mono text-sm
        ${currentTheme.container}
        ${className}
      `}
      role="region"
      aria-label="Code example"
    >
      {/* Terminal Header */}
      <div className={`flex items-center px-4 py-3 border-b ${currentTheme.header}`}>
        <div className="flex space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentTheme.dot}`} />
          <div className={`w-3 h-3 rounded-full ${currentTheme.dot2}`} />
          <div className={`w-3 h-3 rounded-full ${currentTheme.dot3}`} />
        </div>
        <div className="flex-1 text-center">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Terminal
          </span>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-1"
        >
          {lines.map((line, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: {
                  opacity: 0,
                  x: -20,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.6,
                    ease: "easeOut"
                  },
                },
              }}
              className="flex items-start space-x-3 min-h-[1.5rem]"
            >
              {/* Line Number */}
              <span className={`select-none w-6 text-right ${currentTheme.lineNumber}`}>
                {line.trim() ? index + 1 : ""}
              </span>
              
              {/* Code Line */}
              <div className="flex-1 whitespace-pre-wrap break-all">
                {line.trim() === "" ? (
                  <span className="block h-6" />
                ) : (
                  highlightSyntax(line, index)
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Copy Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: (lines.length * staggerDelay) + 0.5 }}
        onClick={() => {
          navigator.clipboard.writeText(lines.join('\n'))
        }}
        className={`
          absolute top-3 right-3 p-2 rounded-md transition-all duration-200
          ${theme === "dark" 
            ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white" 
            : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
          }
          opacity-0 hover:opacity-100 focus:opacity-100
        `}
        aria-label="Copy code to clipboard"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </motion.button>
    </div>
  )
}