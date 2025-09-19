// Design System - Core Design Tokens and Utilities
// This file provides TypeScript interfaces and utilities for the design system

export interface DesignTokens {
  spacing: SpacingTokens;
  typography: TypographyTokens;
  icons: IconTokens;
  colors: ColorTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  transitions: TransitionTokens;
  zIndex: ZIndexTokens;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface TypographyTokens {
  fontSize: FontSizeTokens;
  fontWeight: FontWeightTokens;
  lineHeight: LineHeightTokens;
  letterSpacing: LetterSpacingTokens;
  fontFamily: FontFamilyTokens;
}

export interface FontSizeTokens {
  xs: string;        // 12px (0.75rem)
  sm: string;        // 14px (0.875rem)
  base: string;      // 16px (1rem)
  lg: string;        // 18px (1.125rem)
  xl: string;        // 20px (1.25rem)
  '2xl': string;     // 24px (1.5rem)
  '3xl': string;     // 30px (1.875rem)
  '4xl': string;     // 32px (2rem)
}

export interface FontWeightTokens {
  light: string;     // 200
  normal: string;    // 400
  medium: string;    // 500
  semibold: string;  // 600
  bold: string;      // 700
  extrabold: string; // 800
}

export interface LineHeightTokens {
  tight: string;     // 1.25
  normal: string;    // 1.5
  relaxed: string;   // 1.75
  loose: string;     // 2
}

export interface LetterSpacingTokens {
  tighter: string;   // -0.05em
  tight: string;     // -0.025em
  normal: string;    // 0em
  wide: string;      // 0.025em
  wider: string;     // 0.05em
  widest: string;    // 0.1em
}

export interface FontFamilyTokens {
  sans: string;      // Manrope font family
  mono: string;      // Monospace fallback
  icons: string;     // Material Icons font family
}

export interface IconTokens {
  size: IconSizeTokens;
  color: IconColorTokens;
  alignment: IconAlignmentTokens;
}

export interface IconSizeTokens {
  xs: string;        // 12px
  sm: string;        // 16px
  md: string;        // 20px
  lg: string;        // 24px
  xl: string;        // 28px
  '2xl': string;     // 32px
  '3xl': string;     // 40px
  '4xl': string;     // 48px
}

export interface IconColorTokens {
  primary: string;
  success: string;
  warning: string;
  error: string;
  debt: string;
  savings: string;
  investing: string;
  muted: string;
  white: string;
}

export interface IconAlignmentTokens {
  top: string;
  middle: string;
  bottom: string;
  baseline: string;
}

export interface ColorTokens {
  bg: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
  debt: string;
  savings: string;
  investing: string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface TransitionTokens {
  fast: string;
  normal: string;
  slow: string;
}

export interface ZIndexTokens {
  dropdown: string;
  modal: string;
  tooltip: string;
}

// Design token values
export const designTokens: DesignTokens = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px'
  },
  typography: {
    fontSize: {
      xs: '12px',      // 0.75rem
      sm: '14px',      // 0.875rem
      base: '16px',    // 1rem
      lg: '18px',      // 1.125rem
      xl: '20px',      // 1.25rem
      '2xl': '24px',   // 1.5rem
      '3xl': '30px',   // 1.875rem
      '4xl': '32px'    // 2rem
    },
    fontWeight: {
      light: '200',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2'
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    },
    fontFamily: {
      sans: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Courier New", monospace',
      icons: '"Material Symbols Outlined"'
    }
  },
  icons: {
    size: {
      xs: '12px',
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '28px',
      '2xl': '32px',
      '3xl': '40px',
      '4xl': '48px'
    },
    color: {
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      debt: 'var(--color-debt)',
      savings: 'var(--color-savings)',
      investing: 'var(--color-investing)',
      muted: 'var(--color-text-muted)',
      white: 'white'
    },
    alignment: {
      top: 'top',
      middle: 'middle',
      bottom: 'bottom',
      baseline: 'baseline'
    }
  },
  colors: {
    bg: 'var(--color-bg)',
    card: 'var(--color-card)',
    border: 'var(--color-border)',
    text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)',
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    debt: 'var(--color-debt)',
    savings: 'var(--color-savings)',
    investing: 'var(--color-investing)'
  },
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease'
  },
  zIndex: {
    dropdown: '1000',
    modal: '1050',
    tooltip: '1100'
  }
};

// Utility functions for generating styles
export class DesignSystemUtils {
  /**
   * Generate spacing utility classes
   */
  static getSpacing(spacing: keyof SpacingTokens): string {
    return designTokens.spacing[spacing];
  }

  /**
   * Generate typography utility classes
   */
  static getTypography(size: keyof FontSizeTokens, weight?: keyof FontWeightTokens): string {
    const fontSize = designTokens.typography.fontSize[size];
    const fontWeight = weight ? designTokens.typography.fontWeight[weight] : '';
    return `${fontSize} ${fontWeight}`.trim();
  }

  /**
   * Generate color utility classes
   */
  static getColor(color: keyof ColorTokens): string {
    return designTokens.colors[color];
  }

  /**
   * Generate border radius utility classes
   */
  static getRadius(radius: keyof RadiusTokens): string {
    return designTokens.radius[radius];
  }

  /**
   * Generate shadow utility classes
   */
  static getShadow(shadow: keyof ShadowTokens): string {
    return designTokens.shadows[shadow];
  }

  /**
   * Generate transition utility classes
   */
  static getTransition(transition: keyof TransitionTokens): string {
    return designTokens.transitions[transition];
  }

  /**
   * Generate responsive breakpoint styles
   */
  static getResponsiveStyles(styles: Record<string, string>): string {
    return Object.entries(styles)
      .map(([breakpoint, style]) => {
        if (breakpoint === 'mobile') {
          return `@media (max-width: 768px) { ${style} }`;
        }
        if (breakpoint === 'tablet') {
          return `@media (min-width: 769px) and (max-width: 1024px) { ${style} }`;
        }
        if (breakpoint === 'desktop') {
          return `@media (min-width: 1025px) { ${style} }`;
        }
        return style;
      })
      .join('\n');
  }

  /**
   * Generate component variant styles
   */
  static getComponentVariants(
    baseClass: string,
    variants: Record<string, Record<string, string>>
  ): string {
    return Object.entries(variants)
      .map(([variant, styles]) => {
        const styleString = Object.entries(styles)
          .map(([property, value]) => `${property}: ${value}`)
          .join('; ');
        return `.${baseClass}--${variant} { ${styleString} }`;
      })
      .join('\n');
  }

  /**
   * Generate utility classes for common patterns
   */
  static generateUtilityClasses(): string {
    const utilities = [
      // Display utilities
      '.block { display: block; }',
      '.inline-block { display: inline-block; }',
      '.flex { display: flex; }',
      '.inline-flex { display: inline-flex; }',
      '.grid { display: grid; }',
      '.hidden { display: none; }',

      // Position utilities
      '.relative { position: relative; }',
      '.absolute { position: absolute; }',
      '.fixed { position: fixed; }',
      '.sticky { position: sticky; }',

      // Overflow utilities
      '.overflow-hidden { overflow: hidden; }',
      '.overflow-auto { overflow: auto; }',
      '.overflow-scroll { overflow: scroll; }',

      // Text utilities
      '.text-center { text-align: center; }',
      '.text-left { text-align: left; }',
      '.text-right { text-align: right; }',
      '.text-justify { text-align: justify; }',

      // Cursor utilities
      '.cursor-pointer { cursor: pointer; }',
      '.cursor-not-allowed { cursor: not-allowed; }',
      '.cursor-default { cursor: default; }',

      // Opacity utilities
      '.opacity-0 { opacity: 0; }',
      '.opacity-25 { opacity: 0.25; }',
      '.opacity-50 { opacity: 0.5; }',
      '.opacity-75 { opacity: 0.75; }',
      '.opacity-100 { opacity: 1; }'
    ];

    return utilities.join('\n');
  }
}

// Component style generators
export class ComponentStyles {
  /**
   * Generate button styles with variants
   */
  static generateButtonStyles(): string {
    const baseStyles = `
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: ${designTokens.spacing.sm} ${designTokens.spacing.md};
        border-radius: ${designTokens.radius.md};
        font-size: ${designTokens.typography.fontSize.base};
        font-weight: ${designTokens.typography.fontWeight.medium};
        cursor: pointer;
        border: none;
        transition: all ${designTokens.transitions.normal};
        text-decoration: none;
        min-height: 36px;
      }
      
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;

    const variants = DesignSystemUtils.getComponentVariants('btn', {
      primary: {
        background: designTokens.colors.primary,
        color: designTokens.colors.text
      },
      secondary: {
        background: 'transparent',
        color: designTokens.colors.textMuted,
        border: `1px solid ${designTokens.colors.border}`
      },
      success: {
        background: designTokens.colors.success,
        color: designTokens.colors.text
      },
      error: {
        background: designTokens.colors.error,
        color: designTokens.colors.text
      },
      debt: {
        background: designTokens.colors.debt,
        color: designTokens.colors.text
      },
      savings: {
        background: designTokens.colors.savings,
        color: designTokens.colors.text
      },
      investing: {
        background: designTokens.colors.investing,
        color: designTokens.colors.text
      }
    });

    return baseStyles + '\n' + variants;
  }

  /**
   * Generate card styles with variants
   */
  static generateCardStyles(): string {
    const baseStyles = `
      .card {
        background: ${designTokens.colors.card};
        border: 1px solid ${designTokens.colors.border};
        border-radius: ${designTokens.radius.lg};
        padding: ${designTokens.spacing.lg};
        transition: all ${designTokens.transitions.normal};
      }
      
      .card:hover {
        box-shadow: ${designTokens.shadows.md};
      }
    `;

    const variants = DesignSystemUtils.getComponentVariants('card', {
      compact: {
        padding: designTokens.spacing.md
      },
      spacious: {
        padding: designTokens.spacing.xl
      },
      elevated: {
        boxShadow: designTokens.shadows.lg
      },
      bordered: {
        borderWidth: '2px'
      }
    });

    return baseStyles + '\n' + variants;
  }

  /**
   * Generate input styles with variants
   */
  static generateInputStyles(): string {
    const baseStyles = `
      .input {
        width: 100%;
        padding: ${designTokens.spacing.sm} ${designTokens.spacing.md};
        border: 1px solid ${designTokens.colors.border};
        border-radius: ${designTokens.radius.md};
        background: ${designTokens.colors.card};
        color: ${designTokens.colors.text};
        font-size: ${designTokens.typography.fontSize.base};
        transition: all ${designTokens.transitions.normal};
      }
      
      .input:focus {
        outline: none;
        border-color: ${designTokens.colors.primary};
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      .input:disabled {
        background: ${designTokens.colors.bg};
        color: ${designTokens.colors.textMuted};
        cursor: not-allowed;
      }
      
      .input::placeholder {
        color: ${designTokens.colors.textMuted};
      }
    `;

    const variants = DesignSystemUtils.getComponentVariants('input', {
      error: {
        borderColor: designTokens.colors.error
      },
      success: {
        borderColor: designTokens.colors.success
      },
      large: {
        padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
        fontSize: designTokens.typography.fontSize.lg
      },
      small: {
        padding: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
        fontSize: designTokens.typography.fontSize.sm
      }
    });

    return baseStyles + '\n' + variants;
  }
}

// Export everything for easy importing
export default {
  designTokens,
  DesignSystemUtils,
  ComponentStyles
};
