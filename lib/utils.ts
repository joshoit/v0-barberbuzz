import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Generate an absolute URL from a relative path
 * @param path - The relative path
 * @returns The absolute URL
 */
export function absoluteUrl(path: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Format a date to a readable string
 * @param date - The date to format
 * @returns The formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Format a time to a readable string
 * @param date - The date to format
 * @returns The formatted time string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Format a date and time to a readable string
 * @param date - The date to format
 * @returns The formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
