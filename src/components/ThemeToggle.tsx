import React from 'react';
import { getCurrentTheme, setTheme } from '../ui/colors';
import { Button, ButtonVariants, ButtonColors, ButtonSizes } from './Button';
import './Button.css';

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
    <Button
      variant={ButtonVariants.outline}
      color={ButtonColors.secondary}
      size={ButtonSizes.small}
      onClick={toggleTheme}
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {currentTheme === 'dark' ? '☀️' : '🌙'}
    </Button>
  );
}






