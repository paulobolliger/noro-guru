"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  // Start with 'dark' on both server and initial client render to avoid hydration mismatch.
  const [theme, setTheme] = useState<'dark'|'light'>('dark');

  useEffect(() => {
    // On mount, resolve theme preference then apply it.
    const resolved = (() => {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('noro.theme') : null;
      if (saved === 'light' || saved === 'dark') return saved as 'light'|'dark';
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      return 'dark';
    })();
    setTheme(resolved);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.add('theme-transition');
    
    // Set data-theme attribute for CSS variables
    root.setAttribute('data-theme', theme);
    
    // Set class for Tailwind dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    if (typeof window !== 'undefined') localStorage.setItem('noro.theme', theme);
    const t = setTimeout(() => root.classList.remove('theme-transition'), 250);
    return () => clearTimeout(t);
  }, [theme]);

  return (
    <button
      aria-label="Alternar tema"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="theme-toggle p-2 rounded-lg transition-colors"
      title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
