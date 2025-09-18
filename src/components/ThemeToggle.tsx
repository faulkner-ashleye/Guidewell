import React from 'react';
import { getCurrentTheme, setTheme } from '../ui/colors';

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('dark');

  React.useEffect(() => {
    // Initialize theme on mount
    const theme = getCurrentTheme();
    setCurrentTheme(theme);
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary btn-sm"
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {currentTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}


