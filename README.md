# Guidewell

A mobile-first web app built with React + TypeScript that helps people in their 20s–30s explore financial trade-offs across debt, savings, and investing.

## Features

- **Educational Focus**: Provides educational scenarios only (not financial advice)
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **Strategy Explorer**: Compare different financial strategies and their potential outcomes
- **Goal Tracking**: Set and track progress toward financial goals
- **Interactive Tools**: Build custom strategies with step-by-step guidance

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Context API** for state management
- **CSS Modules** for styling
- **Mobile-first responsive design**

## Project Structure

```
src/
├── app/                 # Main app component and routing
├── pages/               # Page components (Home, Strategies, Goals, Settings)
├── components/          # Reusable UI components
├── state/              # Context API and custom hooks
├── data/               # TypeScript types and presets
└── utils/              # Utility functions for calculations and formatting
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Key Components

### Navigation
- Bottom navigation bar with 4 main sections
- Mobile-optimized touch targets

### Strategies Page
- Baseline financial snapshot
- Recommended strategy card
- Build Your Own strategy flow with stepper
- Interactive allocation sliders
- Results visualization with charts

### Goals Page
- Goal tracking with progress indicators
- Add/edit financial goals
- Priority-based organization

### Settings Page
- User profile management
- Preferences configuration
- Account actions

## Disclaimer

This app provides educational scenarios only and is not financial, legal, or investment advice. Actual results may vary significantly based on market conditions, fees, and other factors.

## Development

The app uses conditional phrasing throughout ("could", "might", "this scenario shows") to emphasize the educational nature of the content.

All financial calculations are simplified for educational purposes and should not be used for actual financial planning without consulting qualified professionals.


"# guidewell" 











