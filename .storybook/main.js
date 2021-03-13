const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  stories: ['../src/component/**/*.stories.@(js|jsx)'],
  addons: [
    '@storybook/addon-essentials',
  ],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.styl$/,
      use: ['style-loader', 'css-loader', 'scoped-css-loader', 'stylus-loader'],
      include: path.resolve(__dirname, '../src'),
    });

    config.plugins.push(new ESLintPlugin());
  
    return config;
  }
};