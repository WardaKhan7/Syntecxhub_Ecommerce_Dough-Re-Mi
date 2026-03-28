import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage - default to light mode
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      // Default to light mode, don't check system preference
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 text-[#800000] dark:text-white hover:text-dark dark:hover:text-primary transition-colors rounded-full hover:bg-primary/5 dark:hover:bg-white/5 flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 text-[#800000]" />}
    </button>
  );
};

export default ThemeToggle;
