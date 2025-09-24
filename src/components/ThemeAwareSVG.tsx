import React, { useState, useEffect } from 'react';

interface ThemeAwareSVGProps {
  src: string;
  className?: string;
  alt?: string;
}

export const ThemeAwareSVG: React.FC<ThemeAwareSVGProps> = ({ src, className = '', alt = '' }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSVG = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`);
        }
        let content = await response.text();
        
        // Replace hardcoded colors with CSS variables
        content = content
          .replace(/fill="#E15252"/g, 'fill="var(--svg-error-color)"')
          .replace(/fill="#9AD4A6"/g, 'fill="var(--svg-success-color)"')
          .replace(/fill="#5163E2"/g, 'fill="var(--svg-primary-color)"')
          .replace(/fill="#339458"/g, 'fill="var(--svg-success-color)"')
          .replace(/fill="#00441A"/g, 'fill="var(--svg-primary-dark-color)"')
          .replace(/fill="#B6E7FA"/g, 'fill="var(--svg-info-subtle-hover)"')
          .replace(/fill="white"/g, 'fill="var(--svg-text-color)"')
          .replace(/stroke="#E15252"/g, 'stroke="var(--svg-error-color)"')
          .replace(/stroke="#9AD4A6"/g, 'stroke="var(--svg-success-color)"')
          .replace(/stroke="#5163E2"/g, 'stroke="var(--svg-primary-color)"')
          .replace(/stroke="#339458"/g, 'stroke="var(--svg-success-color)"')
          .replace(/stroke="#00441A"/g, 'stroke="var(--svg-primary-dark-color)"')
          .replace(/stroke="#B6E7FA"/g, 'stroke="var(--svg-info-subtle-hover)"')
          .replace(/stroke="white"/g, 'stroke="var(--svg-text-color)"');
        
        setSvgContent(content);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load SVG');
        console.error('Error loading SVG:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSVG();
  }, [src]);

  if (isLoading) {
    return (
      <div className={`theme-aware-svg loading ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`theme-aware-svg error ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-error-main)' }}>
        <div>Failed to load</div>
      </div>
    );
  }

  return (
    <div 
      className={`theme-aware-svg ${className}`}
      style={{
        '--svg-debt-color': 'var(--color-debt)',
        '--svg-savings-color': 'var(--color-savings)',
        '--svg-investing-color': 'var(--color-investing)',
        '--svg-primary-color': 'var(--color-primary-main)',
        '--svg-primary-dark-color': 'var(--color-primary-dark)',
        '--svg-text-color': 'var(--color-text-primary)',
        '--svg-success-color': 'var(--color-success-main)',
        '--svg-error-color': 'var(--color-error-main)',
        '--svg-info-subtle-hover': 'var(--color-info-subtle-hover)',
      } as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

// Specific SVG components for the strategy cards
export const DebtCrusherSVG: React.FC<{ className?: string }> = ({ className }) => (
  <ThemeAwareSVG 
    src="/images/persona_debtCrusher.svg" 
    className={className}
    alt="Debt Crusher illustration"
  />
);

export const BuildYourOwnSVG: React.FC<{ className?: string }> = ({ className }) => (
  <ThemeAwareSVG 
    src="/images/persona_buildYourOwn.svg" 
    className={className}
    alt="Build Your Own Strategy illustration"
  />
);