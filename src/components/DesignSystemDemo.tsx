import React, { useState } from 'react';
import { ThemeSwitcher, ThemeSwitcherPresets } from './ThemeSwitcher';
import { Card } from './Card';
// Button component will be created inline for demo purposes
import { Input } from './Inputs';
import { Select } from './Inputs';
import { Chip, ChipGroup } from './Chips';
import { ProgressChart } from './Charts';
import { Modal } from './Modal';
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
    { name: 'Primary', class: 'bg-primary', text: 'text-white' },
    { name: 'Success', class: 'bg-success', text: 'text-white' },
    { name: 'Warning', class: 'bg-warning', text: 'text-white' },
    { name: 'Error', class: 'bg-error', text: 'text-white' },
    { name: 'Debt', class: 'bg-debt', text: 'text-white' },
    { name: 'Savings', class: 'bg-savings', text: 'text-white' },
    { name: 'Investing', class: 'bg-investing', text: 'text-white' }
  ];

  const typographyExamples = [
    { name: 'xs', class: 'text-xs', size: '11px' },
    { name: 'sm', class: 'text-sm', size: '12px' },
    { name: 'base', class: 'text-base', size: '14px' },
    { name: 'lg', class: 'text-lg', size: '16px' },
    { name: 'xl', class: 'text-xl', size: '18px' },
    { name: '2xl', class: 'text-2xl', size: '20px' },
    { name: '3xl', class: 'text-3xl', size: '24px' }
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
        <p>Consistent font sizes and weights:</p>
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

      {/* Component Examples */}
      <Card className="demo-section">
        <h2>Component Examples</h2>
        <p>Interactive components using the design system:</p>
        
        <div className="component-examples">
          {/* Buttons */}
          <div className="component-group">
            <h4>Buttons</h4>
            <div className="button-examples">
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-success">Success</button>
              <button className="btn btn-error">Error</button>
              <button className="btn btn-debt">Debt</button>
              <button className="btn btn-savings">Savings</button>
              <button className="btn btn-investing">Investing</button>
            </div>
          </div>

          {/* Inputs */}
          <div className="component-group">
            <h4>Inputs</h4>
            <div className="input-examples">
              <Input
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' }
                ]}
              />
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
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Open Modal
        </button>
      </Card>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-content">
          <h3>Design System Modal</h3>
          <p>This modal demonstrates the design system's modal component with consistent styling.</p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => setShowModal(false)}>
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DesignSystemDemo;
