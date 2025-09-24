import React, { useState, useEffect } from 'react';
import { ThemeAwareSVG } from './ThemeAwareSVG';

export function SVGColorTest() {
  const [originalContent, setOriginalContent] = useState<string>('');
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    // Test with the futureInvestor SVG which has #B6E7FA
    fetch('/images/persona_futureInvestor.svg')
      .then(response => response.text())
      .then(content => {
        setOriginalContent(content);
        
        // Apply the same processing as ThemeAwareSVG
        let processed = content
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
        
        setProcessedContent(processed);
      })
      .catch(err => console.error('Error loading SVG:', err));
  }, []);

  const countOccurrences = (text: string, search: string) => {
    return (text.match(new RegExp(search, 'g')) || []).length;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h2>SVG Color Mapping Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Original SVG Content:</h3>
        <p>Occurrences of #B6E7FA: {countOccurrences(originalContent, '#B6E7FA')}</p>
        <p>Occurrences of #5163E2: {countOccurrences(originalContent, '#5163E2')}</p>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '11px',
          maxHeight: '150px',
          overflow: 'auto'
        }}>
          {originalContent.substring(0, 800)}...
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Processed SVG Content:</h3>
        <p>Occurrences of var(--svg-info-subtle-hover): {countOccurrences(processedContent, 'var(--svg-info-subtle-hover)')}</p>
        <p>Occurrences of var(--svg-primary-color): {countOccurrences(processedContent, 'var(--svg-primary-color)')}</p>
        <pre style={{ 
          background: '#f0f8ff', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '11px',
          maxHeight: '150px',
          overflow: 'auto'
        }}>
          {processedContent.substring(0, 800)}...
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>ThemeAwareSVG Component Test:</h3>
        <div style={{ 
          '--svg-debt-color': 'var(--color-debt)',
          '--svg-savings-color': 'var(--color-savings)',
          '--svg-investing-color': 'var(--color-investing)',
          '--svg-primary-color': 'var(--color-primary-main)',
          '--svg-primary-dark-color': 'var(--color-primary-dark)',
          '--svg-text-color': 'var(--color-text-primary)',
          '--svg-success-color': 'var(--color-success-main)',
          '--svg-error-color': 'var(--color-error-main)',
          '--svg-info-subtle-hover': 'var(--color-info-subtle-hover)',
          border: '2px solid #ccc',
          padding: '10px',
          borderRadius: '8px'
        } as React.CSSProperties}>
          <ThemeAwareSVG 
            src="/images/persona_futureInvestor.svg"
            className="test-svg"
            alt="Future Investor Test"
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Auto-Pilot Avatar Test (using Goal Keeper SVG as fallback):</h3>
        <div style={{ 
          '--svg-debt-color': 'var(--color-debt)',
          '--svg-savings-color': 'var(--color-savings)',
          '--svg-investing-color': 'var(--color-investing)',
          '--svg-primary-color': 'var(--color-primary-main)',
          '--svg-primary-dark-color': 'var(--color-primary-dark)',
          '--svg-text-color': 'var(--color-text-primary)',
          '--svg-success-color': 'var(--color-success-main)',
          '--svg-error-color': 'var(--color-error-main)',
          '--svg-info-subtle-hover': 'var(--color-info-subtle-hover)',
          border: '2px solid #ccc',
          padding: '10px',
          borderRadius: '8px'
        } as React.CSSProperties}>
          <ThemeAwareSVG 
            src="/images/persona_goalKeeper.svg"
            className="test-svg"
            alt="Auto-Pilot Test (Goal Keeper fallback)"
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>CSS Variable Values:</h3>
        <ul>
          <li>--color-investing: #247CB7</li>
          <li>--color-primary-main: #007A2F</li>
          <li>--svg-investing-color: var(--color-investing)</li>
          <li>--svg-primary-color: var(--color-primary-main)</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Color Mapping Status:</h3>
        <ul>
          <li>✅ #B6E7FA → var(--svg-info-subtle-hover)</li>
          <li>✅ #5163E2 → var(--svg-primary-color)</li>
          <li>✅ #00441A → var(--svg-primary-dark-color)</li>
        </ul>
      </div>
    </div>
  );
}
