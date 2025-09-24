import React from 'react';
import './AdaptiveSVG.css';

interface AdaptiveSVGProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function AdaptiveSVG({ src, alt, className, width = "100%", height = "100%" }: AdaptiveSVGProps) {
  const [svgContent, setSvgContent] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const loadSVG = async () => {
      try {
        setIsLoading(true);
        setError(false);

        // Ensure we're fetching from the public directory
        const response = await fetch(src, {
          headers: {
            'Accept': 'image/svg+xml, image/*, */*'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.status} ${response.statusText}`);
        }

        const svgText = await response.text();

        // Check if we actually got an SVG (not HTML)
        if (!svgText.trim().startsWith('<svg') && !svgText.includes('<svg')) {
          console.error('Response is not an SVG:', svgText.substring(0, 200));
          throw new Error('Response is not a valid SVG');
        }

        // Replace hardcoded colors with CSS variables
        const adaptiveSVG = svgText
          // Replace white with CSS variable
          .replace(/fill="white"/g, 'fill="var(--color-text-inverse)"')
          .replace(/fill="#ffffff"/g, 'fill="var(--color-text-inverse)"')
          .replace(/fill="#FFFFFF"/g, 'fill="var(--color-text-inverse)"')

          // Replace common brand colors with theme-aware equivalents
          .replace(/fill="#5163E2"/g, 'fill="var(--color-secondary-main)"')
          .replace(/fill="#339458"/g, 'fill="var(--color-primary-main)"')
          .replace(/fill="#E15252"/g, 'fill="var(--color-error-main)"')

          // Replace stroke colors too
          .replace(/stroke="white"/g, 'stroke="var(--color-text-inverse)"')
          .replace(/stroke="#ffffff"/g, 'stroke="var(--color-text-inverse)"')
          .replace(/stroke="#5163E2"/g, 'stroke="var(--color-secondary-main)"')
          .replace(/stroke="#339458"/g, 'stroke="var(--color-primary-main)"')
          .replace(/stroke="#E15252"/g, 'stroke="var(--color-error-main)"')
          .replace(/stroke="#9AD4A6"/g, 'stroke="var(--color-primary-light)"');

        setSvgContent(adaptiveSVG);
      } catch (err) {
        console.error('Error loading SVG:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSVG();
  }, [src]);

  if (isLoading) {
    return (
      <div className={`adaptive-svg-loading ${className}`} style={{ width, height }}>
        <div className="loading-placeholder" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`adaptive-svg-error ${className}`} style={{ width, height }}>
        <div className="error-placeholder">⚠️</div>
      </div>
    );
  }

  return (
    <div
      className={`adaptive-svg ${className}`}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
