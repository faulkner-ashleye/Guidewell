import React, { useState, useEffect } from 'react';
import { setTheme, getCurrentTheme } from '../ui/colors';
import './ThemeSwitcher.css';

interface ThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'toggle' | 'select';
  showLabel?: boolean;
}

export function ThemeSwitcher({ 
  className = '', 
  size = 'md', 
  variant = 'toggle',
  showLabel = true 
}: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize theme on component mount
    const theme = getCurrentTheme();
    setCurrentTheme(theme);
    setIsLoading(false);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    handleThemeChange(newTheme);
  };

  if (isLoading) {
    return (
      <div className={`theme-switcher theme-switcher--${size} ${className}`}>
        <div className="theme-switcher__skeleton">
          <div className="theme-switcher__skeleton-circle"></div>
          {showLabel && <div className="theme-switcher__skeleton-text"></div>}
        </div>
      </div>
    );
  }

  const renderButton = () => (
    <button
      className={`theme-switcher theme-switcher--${size} theme-switcher--button ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="theme-switcher__icon">
        {currentTheme === 'light' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        )}
      </div>
      {showLabel && (
        <span className="theme-switcher__label">
          {currentTheme === 'light' ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );

  const renderToggle = () => (
    <div className={`theme-switcher theme-switcher--${size} theme-switcher--toggle ${className}`}>
      {showLabel && (
        <span className="theme-switcher__label">
          {currentTheme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
      <button
        className={`theme-switcher__toggle ${currentTheme === 'dark' ? 'theme-switcher__toggle--active' : ''}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
        title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      >
        <div className="theme-switcher__toggle-track">
          <div className="theme-switcher__toggle-thumb">
            <div className="theme-switcher__icon">
              {currentTheme === 'light' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  );

  const renderSelect = () => (
    <div className={`theme-switcher theme-switcher--${size} theme-switcher--select ${className}`}>
      {showLabel && (
        <label className="theme-switcher__label" htmlFor="theme-select">
          Theme
        </label>
      )}
      <select
        id="theme-select"
        className="theme-switcher__select"
        value={currentTheme}
        onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
        aria-label="Select theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );

  switch (variant) {
    case 'button':
      return renderButton();
    case 'toggle':
      return renderToggle();
    case 'select':
      return renderSelect();
    default:
      return renderToggle();
  }
}

// Preset configurations for common use cases
export const ThemeSwitcherPresets = {
  // Compact button for headers
  headerButton: () => (
    <ThemeSwitcher 
      variant="button" 
      size="sm" 
      showLabel={false}
      className="theme-switcher--header"
    />
  ),
  
  // Toggle for settings pages
  settingsToggle: () => (
    <ThemeSwitcher 
      variant="toggle" 
      size="md" 
      showLabel={true}
      className="theme-switcher--settings"
    />
  ),
  
  // Select dropdown for forms
  formSelect: () => (
    <ThemeSwitcher 
      variant="select" 
      size="md" 
      showLabel={true}
      className="theme-switcher--form"
    />
  ),
  
  // Large button for demo pages
  demoButton: () => (
    <ThemeSwitcher 
      variant="button" 
      size="lg" 
      showLabel={true}
      className="theme-switcher--demo"
    />
  )
};

export default ThemeSwitcher;
