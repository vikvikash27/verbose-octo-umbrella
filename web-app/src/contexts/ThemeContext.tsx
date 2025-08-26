import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const THEME_STORAGE_KEY = 'easyorganic_theme_admin';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }
      // Default to system preference if no theme is stored
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (error) {
      // Default to light if localStorage is unavailable
      return 'light';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the other theme class before adding the new one
    const oldTheme = theme === 'dark' ? 'light' : 'dark';
    root.classList.remove(oldTheme);
    
    // Add the current theme class
    root.classList.add(theme);

    // Persist the theme choice to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};