"use client"

import { useTheme } from "next-themes"

export function useThemeMode() {
  const { theme, setTheme, systemTheme } = useTheme()

  const current = theme === "system" ? systemTheme : theme

  return {
    theme: current,
    setLight: () => setTheme("light"),
    setDark: () => setTheme("dark"),
    setSystem: () => setTheme("system"),
    isDark: current === "dark",
  }
}
