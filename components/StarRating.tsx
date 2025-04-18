"use client"

import React from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}

export function StarRating({ value, onChange, readOnly = false, size = "md" }: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0)

  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10", // Larger for tablet touch
  }

  const starSize = sizes[size]

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = (hoverRating || value) >= star

        return (
          <button
            key={star}
            type="button"
            className={`p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md ${
              readOnly ? "cursor-default" : "cursor-pointer"
            }`}
            onClick={() => !readOnly && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            aria-checked={value === star}
            role="radio"
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            disabled={readOnly}
          >
            <Star
              className={`${starSize} ${isActive ? "fill-accent text-accent" : "text-gray-300"} transition-colors`}
            />
          </button>
        )
      })}
    </div>
  )
}
