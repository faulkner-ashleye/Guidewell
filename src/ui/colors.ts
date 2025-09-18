// Legacy color values for backward compatibility
// These will be gradually replaced with CSS custom properties
export const COLORS = {
  bg: '#171717',
  card: '#1C1C1C',
  border: '#3C3C3C',
  text: '#FFFFFF',
  textMuted: '#B6B6B6',
  debt: '#E15252',
  savings: '#89B81F',
  investing: '#8AD2D5',
  primary: '#3B82F6'
};

// CSS custom property names for dynamic theming
export const CSS_VARS = {
  bg: 'var(--color-bg)',
  card: 'var(--color-card)',
  border: 'var(--color-border)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  debt: 'var(--color-debt)',
  savings: 'var(--color-savings)',
  investing: 'var(--color-investing)',
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)'
} as const;

// Theme configuration for easy switching
export const THEMES = {
  dark: {
    bg: '#171717',
    card: '#1C1C1C',
    border: '#3C3C3C',
    text: '#FFFFFF',
    textMuted: '#B6B6B6',
    debt: '#E15252',
    savings: '#89B81F',
    investing: '#8AD2D5',
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  light: {
    bg: '#FFFFFF',
    card: '#F8F9FA',
    border: '#E5E7EB',
    text: '#1A1A1A',
    textMuted: '#6B7280',
    debt: '#DC2626',
    savings: '#059669',
    investing: '#0891B2',
    primary: '#2563EB',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626'
  }
} as const;

// Utility function to get CSS variable value
export function getCSSVar(varName: string): string {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return '';
}

// Utility function to set CSS variable value
export function setCSSVar(varName: string, value: string): void {
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty(varName, value);
  }
}

// Theme switching utility
export function setTheme(theme: 'light' | 'dark'): void {
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}

// Get current theme
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as 'light' | 'dark';
    const computed = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    return stored || computed || 'dark';
  }
  return 'dark';
}

// Initialize theme on app start
export function initializeTheme(): void {
  if (typeof window !== 'undefined') {
    const theme = getCurrentTheme();
    setTheme(theme);
  }
}
