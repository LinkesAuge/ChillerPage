// Storybook main configuration
const path = require('path');
const reactPlugin = require('@vitejs/plugin-react');
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions'
  ],
  framework: '@storybook/react-vite',
  core: {
    builder: '@storybook/builder-vite'
  },
  // Vite final config to set up path aliases
  async viteFinal(config, { configType }) {
    // Ensure '@' maps to 'src/'
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '../src')
    };
    // Add React plugin for TSX/JSX support
    config.plugins = [
      ...(config.plugins || []),
      reactPlugin()
    ];
    return config;
  }
}; 