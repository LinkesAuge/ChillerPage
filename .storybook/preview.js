// Storybook preview configuration
import React from 'react';
import { designTokens } from '../src/lib/designTokens';

// Remove global CSS import to avoid missing file errors

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// Decorator wrapping stories in a container using designTokens (no JSX)
export const decorators = [Story => React.createElement(
  'div',
  {
    style: {
      backgroundColor: designTokens.colors.background,
      minHeight: '100vh',
      padding: designTokens.spacing.md,
    }
  },
  React.createElement(Story, {})
)]; 