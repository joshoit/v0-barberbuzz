"use client"

import React, { createContext, useContext, type ReactNode } from "react"
import type { Store } from "@/lib/airtable"

interface ThemeContextType {
  store: Store | null
  primaryColor: string
  accentColor: string
}

const defaultTheme: ThemeContextType = {
  store: null,
  primaryColor: "#0057D9", // Default primary color
  accentColor: "#FFD339", // Default accent color
}

const ThemeContext = createContext<ThemeContextType>(defaultTheme)

export const useTheme = () => useContext(ThemeContext)

interface ThemeProviderProps {
  children: ReactNode
  store?: Store | null
}

export function ThemeProvider({ children, store }: ThemeProviderProps) {
  const primaryColor = store?.primaryColor || defaultTheme.primaryColor
  const accentColor = store?.accentColor || defaultTheme.accentColor

  // Apply theme colors as CSS variables
  React.useEffect(() => {
    document.documentElement.style.setProperty("--color-primary", primaryColor)
    document.documentElement.style.setProperty("--color-accent", accentColor)
  }, [primaryColor, accentColor])

  const value = {
    store,
    primaryColor,
    accentColor,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
