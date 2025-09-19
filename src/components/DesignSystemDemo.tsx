import React, { useState } from 'react';
import { ThemeSwitcher, ThemeSwitcherPresets } from './ThemeSwitcher';
import { Card } from './Card';
import { Button, ButtonVariants, ButtonColors, ButtonSizes } from './Button';
import './Button.css';
import { Input } from './Inputs';
import { Select } from './Inputs';
import { Chip, ChipGroup } from './Chips';
import { ProgressChart } from './Charts';
import { Modal } from './Modal';
import { Icon, IconNames } from './Icon';
import './DesignSystemDemo.css';

export function DesignSystemDemo() {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');

  const spacingExamples = [
    { name: 'xs', value: '4px', class: 'p-xs' },
    { name: 'sm', value: '8px', class: 'p-sm' },
    { name: 'md', value: '12px', class: 'p-md' },
    { name: 'lg', value: '16px', class: 'p-lg' },
    { name: 'xl', value: '20px', class: 'p-xl' },
    { name: '2xl', value: '24px', class: 'p-2xl' },
    { name: '3xl', value: '32px', class: 'p-3xl' }
  ];

  const colorExamples = [
    // Brand Colors
    { name: 'Primary Main', class: 'bg-primary', text: 'text-white' },
    { name: 'Primary Dark', class: 'bg-primary-dark', text: 'text-white' },
    { name: 'Primary Light', class: 'bg-primary-light', text: 'text-white' },
    { name: 'Primary Subtle', class: 'bg-primary-subtle', text: 'text-primary-subtle-contrast' },
    { name: 'Secondary Main', class: 'bg-secondary', text: 'text-white' },
    
    // Semantic Colors
    { name: 'Error Main', class: 'bg-error', text: 'text-white' },
    { name: 'Warning Main', class: 'bg-warning', text: 'text-white' },
    { name: 'Info Main', class: 'bg-info', text: 'text-white' },
    { name: 'Success Main', class: 'bg-success', text: 'text-white' },
    
    // Financial Context Colors
    { name: 'Debt', class: 'bg-debt', text: 'text-white' },
    { name: 'Savings', class: 'bg-savings', text: 'text-white' },
    { name: 'Investing', class: 'bg-investing', text: 'text-white' }
  ];

  const typographyExamples = [
    { name: 'xs', class: 'text-xs', size: '12px' },
    { name: 'sm', class: 'text-sm', size: '14px' },
    { name: 'base', class: 'text-base', size: '16px' },
    { name: 'lg', class: 'text-lg', size: '18px' },
    { name: 'xl', class: 'text-xl', size: '20px' },
    { name: '2xl', class: 'text-2xl', size: '24px' },
    { name: '3xl', class: 'text-3xl', size: '30px' },
    { name: '4xl', class: 'text-4xl', size: '32px' }
  ];

  const typographyScaleExamples = [
    { name: 'Display 1', class: 'typography-display1', size: '32px', weight: '600', description: 'Large display text' },
    { name: 'Display 2', class: 'typography-display2', size: '30px', weight: '600', description: 'Medium display text' },
    { name: 'H1', class: 'typography-h1', size: '24px', weight: '600', description: 'Main heading' },
    { name: 'H2', class: 'typography-h2', size: '20px', weight: '600', description: 'Section heading' },
    { name: 'H3', class: 'typography-h3', size: '18px', weight: '600', description: 'Subsection heading' },
    { name: 'H4', class: 'typography-h4', size: '16px', weight: '600', description: 'Card heading' },
    { name: 'H5', class: 'typography-h5', size: '16px', weight: '600', description: 'Small heading' },
    { name: 'H6', class: 'typography-h6', size: '14px', weight: '600', description: 'Tiny heading' },
    { name: 'Subtitle 1', class: 'typography-subtitle1', size: '14px', weight: '500', description: 'Medium weight subtitle' },
    { name: 'Subtitle 2', class: 'typography-subtitle2', size: '14px', weight: '500', description: 'Alternative subtitle' },
    { name: 'Body 1', class: 'typography-body1', size: '16px', weight: '400', description: 'Main body text' },
    { name: 'Body 2', class: 'typography-body2', size: '14px', weight: '400', description: 'Secondary body text' },
    { name: 'Overline', class: 'typography-overline', size: '12px', weight: '400', description: 'Uppercase labels' },
    { name: 'Caption', class: 'typography-caption', size: '12px', weight: '400', description: 'Small captions' }
  ];

  const radiusExamples = [
    { name: 'sm', class: 'rounded-sm', value: '4px' },
    { name: 'md', class: 'rounded-md', value: '6px' },
    { name: 'lg', class: 'rounded-lg', value: '8px' },
    { name: 'xl', class: 'rounded-xl', value: '12px' },
    { name: '2xl', class: 'rounded-2xl', value: '16px' },
    { name: 'full', class: 'rounded-full', value: '999px' }
  ];

  const shadowExamples = [
    { name: 'sm', class: 'shadow-sm', value: '0 1px 2px rgba(0, 0, 0, 0.1)' },
    { name: 'md', class: 'shadow-md', value: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    { name: 'lg', class: 'shadow-lg', value: '0 10px 15px rgba(0, 0, 0, 0.1)' },
    { name: 'xl', class: 'shadow-xl', value: '0 20px 25px rgba(0, 0, 0, 0.1)' }
  ];

  const iconSizeExamples = [
    { name: 'xs', size: 'xs', value: '12px' },
    { name: 'sm', size: 'sm', value: '16px' },
    { name: 'md', size: 'md', value: '20px' },
    { name: 'lg', size: 'lg', value: '24px' },
    { name: 'xl', size: 'xl', value: '28px' },
    { name: '2xl', size: '2xl', value: '32px' },
    { name: '3xl', size: '3xl', value: '40px' },
    { name: '4xl', size: '4xl', value: '48px' }
  ];

  const iconColorExamples = [
    { name: 'Primary', color: 'primary' },
    { name: 'Success', color: 'success' },
    { name: 'Warning', color: 'warning' },
    { name: 'Error', color: 'error' },
    { name: 'Debt', color: 'debt' },
    { name: 'Savings', color: 'savings' },
    { name: 'Investing', color: 'investing' },
    { name: 'Muted', color: 'muted' }
  ];

  const commonIcons = [
    { name: 'Home', icon: IconNames.home },
    { name: 'Settings', icon: IconNames.settings },
    { name: 'Account Balance', icon: IconNames.account_balance },
    { name: 'Credit Card', icon: IconNames.credit_card },
    { name: 'Savings', icon: IconNames.savings },
    { name: 'Trending Up', icon: IconNames.trending_up },
    { name: 'Payment', icon: IconNames.payment },
    { name: 'Check Circle', icon: IconNames.check_circle },
    { name: 'Warning', icon: IconNames.warning },
    { name: 'Error', icon: IconNames.error },
    { name: 'Search', icon: IconNames.search },
    { name: 'Add', icon: IconNames.add }
  ];

  return (
    <div className="design-system-demo">
      <div className="demo-header">
        <h1 className="demo-title">Design System Demo</h1>
        <p className="demo-subtitle">
          Explore the comprehensive design system with live examples
        </p>
        <div className="demo-theme-switcher">
          <ThemeSwitcherPresets.demoButton />
        </div>
      </div>

      {/* Theme Switcher Examples */}
      <Card className="demo-section">
        <h2>Theme Switcher</h2>
        <p>Multiple variants for different use cases:</p>
        <div className="demo-grid">
          <div className="demo-item">
            <h4>Button Variant</h4>
            <ThemeSwitcherPresets.headerButton />
          </div>
          <div className="demo-item">
            <h4>Toggle Variant</h4>
            <ThemeSwitcherPresets.settingsToggle />
          </div>
          <div className="demo-item">
            <h4>Select Variant</h4>
            <ThemeSwitcherPresets.formSelect />
          </div>
        </div>
      </Card>

      {/* Spacing System */}
      <Card className="demo-section">
        <h2>Spacing System</h2>
        <p>Consistent spacing using CSS custom properties:</p>
        <div className="spacing-examples">
          {spacingExamples.map((spacing) => (
            <div key={spacing.name} className="spacing-example">
              <div className={`spacing-box ${spacing.class}`}>
                <span className="spacing-label">{spacing.name}</span>
              </div>
              <div className="spacing-info">
                <code>{spacing.class}</code>
                <span>{spacing.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Color System */}
      <Card className="demo-section">
        <h2>Color System</h2>
        <p>Semantic colors for consistent theming:</p>
        <div className="color-examples">
          {colorExamples.map((color) => (
            <div key={color.name} className="color-example">
              <div className={`color-swatch ${color.class} ${color.text}`}>
                {color.name}
              </div>
              <code className="color-class">{color.class}</code>
            </div>
          ))}
        </div>
      </Card>

      {/* Typography System */}
      <Card className="demo-section">
        <h2>Typography System</h2>
        <p>Consistent font sizes and weights using Manrope font:</p>
        <div className="typography-examples">
          {typographyExamples.map((type) => (
            <div key={type.name} className="typography-example">
              <div className={`typography-sample ${type.class}`}>
                The quick brown fox jumps over the lazy dog
              </div>
              <div className="typography-info">
                <code>{type.class}</code>
                <span>{type.size}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Comprehensive Typography Scale */}
      <Card className="demo-section">
        <h2>Typography Scale Tokens</h2>
        <p>Complete typography scale matching design system specifications:</p>
        <div className="typography-scale-examples">
          {typographyScaleExamples.map((type) => (
            <div key={type.name} className="typography-scale-example">
              <div className={`typography-scale-sample ${type.class}`}>
                {type.name} - {type.description}
              </div>
              <div className="typography-scale-info">
                <div className="typography-scale-details">
                  <code>{type.class}</code>
                  <span>{type.size}</span>
                  <span>{type.weight}</span>
                </div>
                <div className="typography-scale-description">
                  {type.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Border Radius System */}
      <Card className="demo-section">
        <h2>Border Radius System</h2>
        <p>Consistent border radius values:</p>
        <div className="radius-examples">
          {radiusExamples.map((radius) => (
            <div key={radius.name} className="radius-example">
              <div className={`radius-box ${radius.class}`}>
                <span className="radius-label">{radius.name}</span>
              </div>
              <div className="radius-info">
                <code>{radius.class}</code>
                <span>{radius.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Shadow System */}
      <Card className="demo-section">
        <h2>Shadow System</h2>
        <p>Consistent shadow values for depth:</p>
        <div className="shadow-examples">
          {shadowExamples.map((shadow) => (
            <div key={shadow.name} className="shadow-example">
              <div className={`shadow-box ${shadow.class}`}>
                <span className="shadow-label">{shadow.name}</span>
              </div>
              <div className="shadow-info">
                <code>{shadow.class}</code>
                <span>{shadow.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Icon System */}
      <Card className="demo-section">
        <h2>Icon System</h2>
        <p>Google Material Symbols Outlined (weight 300) with consistent sizing and colors:</p>
        
        {/* Basic Icon Test */}
        <div className="icon-section">
          <h3>Basic Icon Test</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <span className="material-icons" style={{ fontSize: '24px' }}>home</span>
            <span>Direct Material Icons (home)</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <Icon name="home" size="lg" />
            <span>Icon Component (home)</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <Icon name="settings" size="lg" color="primary" />
            <span>Icon Component (settings)</span>
          </div>
        </div>
        
        {/* Icon Sizes */}
        <div className="icon-section">
          <h3>Icon Sizes</h3>
          <div className="icon-size-examples">
            {iconSizeExamples.map((iconSize) => (
              <div key={iconSize.name} className="icon-size-example">
                <Icon name={IconNames.home} size={iconSize.size as any} />
                <div className="icon-size-info">
                  <code>icon-{iconSize.name}</code>
                  <span>{iconSize.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Icon Colors */}
        <div className="icon-section">
          <h3>Icon Colors</h3>
          <div className="icon-color-examples">
            {iconColorExamples.map((iconColor) => (
              <div key={iconColor.name} className="icon-color-example">
                <Icon name={IconNames.account_balance} color={iconColor.color as any} />
                <div className="icon-color-info">
                  <code>icon-{iconColor.color}</code>
                  <span>{iconColor.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Icons */}
        <div className="icon-section">
          <h3>Common Financial Icons</h3>
          <div className="common-icons-examples">
            {commonIcons.map((icon) => (
              <div key={icon.name} className="common-icon-example">
                <Icon name={icon.icon} />
                <span className="common-icon-label">{icon.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Component Examples */}
      <Card className="demo-section">
        <h2>Component Examples</h2>
        <p>Interactive components using the design system:</p>
        
        <div className="component-examples">
          {/* Button System */}
          <div className="component-group">
            <h4>Button System</h4>
            <p>Comprehensive button system with 2 color sets and 3 variants:</p>
            
            {/* Secondary Color Set */}
            <div className="button-group">
              <h5>Secondary Color Set</h5>
              <div className="button-variants">
                <div className="button-variant">
                  <h6>Contained</h6>
                  <div className="button-examples">
                    <Button variant={ButtonVariants.contained} color={ButtonColors.secondary}>
                      Label
                    </Button>
                    <Button variant={ButtonVariants.contained} color={ButtonColors.secondary} disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
                
                <div className="button-variant">
                  <h6>Outline</h6>
                  <div className="button-examples">
                    <Button variant={ButtonVariants.outline} color={ButtonColors.secondary}>
                      Label
                    </Button>
                    <Button variant={ButtonVariants.outline} color={ButtonColors.secondary} disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
                
                <div className="button-variant">
                  <h6>Text</h6>
                  <div className="button-examples">
                    <Button variant={ButtonVariants.text} color={ButtonColors.secondary}>
                      Label
                    </Button>
                    <Button variant={ButtonVariants.text} color={ButtonColors.secondary} disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error Color Set */}
            <div className="button-group">
              <h5>Error Color Set</h5>
              <div className="button-variants">
                <div className="button-variant">
                  <h6>Contained (Secondary Only)</h6>
                  <div className="button-examples">
                    <Button variant={ButtonVariants.contained} color={ButtonColors.error}>
                      Label (Uses Secondary)
                    </Button>
                    <Button variant={ButtonVariants.contained} color={ButtonColors.error} disabled>
                      Disabled (Uses Secondary)
                    </Button>
                  </div>
                </div>
                
                <div className="button-variant">
                  <h6>Outline</h6>
                  <div className="button-examples">
                    <Button variant={ButtonVariants.outline} color={ButtonColors.error}>
                      Label
                    </Button>
                    <Button variant={ButtonVariants.outline} color={ButtonColors.error} disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
                
                <div className="button-variant">
                  <h6>Text</h6>
                  <div className="button-examples">
                    <Button variant={ButtonVariants.text} color={ButtonColors.error}>
                      Label
                    </Button>
                    <Button variant={ButtonVariants.text} color={ButtonColors.error} disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Button Sizes */}
            <div className="button-group">
              <h5>Button Sizes</h5>
              <div className="button-examples">
                <Button variant={ButtonVariants.contained} color={ButtonColors.secondary} size={ButtonSizes.small}>
                  Small
                </Button>
                <Button variant={ButtonVariants.contained} color={ButtonColors.secondary} size={ButtonSizes.medium}>
                  Medium
                </Button>
                <Button variant={ButtonVariants.contained} color={ButtonColors.secondary} size={ButtonSizes.large}>
                  Large
                </Button>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="component-group">
            <h4>Inputs</h4>
            <div className="input-examples">
              <div className="input-with-icon">
                <Icon name={IconNames.search} size="sm" className="icon-muted" />
                <Input
                  placeholder="Search accounts..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div className="input-with-icon">
                <Icon name={IconNames.account_balance} size="sm" className="icon-muted" />
                <Select
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                  options={[
                    { value: 'option1', label: 'Checking Account' },
                    { value: 'option2', label: 'Savings Account' },
                    { value: 'option3', label: 'Investment Account' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Chips */}
          <div className="component-group">
            <h4>Chips</h4>
            <ChipGroup>
              <Chip variant="default" label="Default" />
              <Chip variant="success" label="Success" />
              <Chip variant="warning" label="Warning" />
              <Chip variant="error" label="Error" />
            </ChipGroup>
          </div>

          {/* Progress Chart */}
          <div className="component-group">
            <h4>Progress Chart</h4>
            <div className="chart-example">
              <ProgressChart
                value={75}
                max={100}
                label="Progress"
                className="demo-chart"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Utility Classes */}
      <Card className="demo-section">
        <h2>Utility Classes</h2>
        <p>Common utility classes for rapid development:</p>
        
        <div className="utility-examples">
          <div className="utility-group">
            <h4>Display</h4>
            <div className="utility-demo">
              <div className="block p-sm bg-card rounded-md">Block</div>
              <div className="inline-block p-sm bg-card rounded-md">Inline Block</div>
              <div className="flex gap-sm">
                <div className="p-sm bg-card rounded-md">Flex 1</div>
                <div className="p-sm bg-card rounded-md">Flex 2</div>
              </div>
            </div>
          </div>

          <div className="utility-group">
            <h4>Spacing</h4>
            <div className="utility-demo">
              <div className="p-lg bg-card rounded-md mb-md">Padding Large</div>
              <div className="px-xl py-sm bg-card rounded-md mb-lg">Padding X Large, Y Small</div>
              <div className="m-md p-sm bg-card rounded-md">Margin Medium</div>
            </div>
          </div>

          <div className="utility-group">
            <h4>Text</h4>
            <div className="utility-demo">
              <div className="text-center text-lg font-semibold text-primary">Centered Large Text</div>
              <div className="text-right text-sm text-muted">Right Aligned Small Text</div>
              <div className="text-justify text-base">Justified text that demonstrates how the utility classes work with longer content.</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal Example */}
      <Card className="demo-section">
        <h2>Modal Component</h2>
        <p>Modal component with design system styling:</p>
        <Button 
          variant={ButtonVariants.contained}
          color={ButtonColors.secondary}
          onClick={() => setShowModal(true)}
        >
          Open Modal
        </Button>
      </Card>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-content">
          <h3>Design System Modal</h3>
          <p>This modal demonstrates the design system's modal component with consistent styling.</p>
          <div className="modal-actions">
            <Button 
              variant={ButtonVariants.outline}
              color={ButtonColors.secondary}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant={ButtonVariants.contained}
              color={ButtonColors.secondary}
              onClick={() => setShowModal(false)}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DesignSystemDemo;
