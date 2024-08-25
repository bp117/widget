const path = require('path');

module.exports = {
  webpack: function (config) {
    // Set up multiple entry points for TypeScript files
    config.entry = {
      main: path.resolve(__dirname, 'src/index.tsx'), // Main application entry point
      widget: path.resolve(__dirname, 'src/widget/index.tsx'), // Widget entry point
    };

    config.output = {
      path: path.resolve(__dirname, 'build'),
      filename: 'static/js/[name].bundle.js', // Generates separate bundles
    };

    return config;
  },
  // Optionally, customize the Jest config for TypeScript
  jest: function (config) {
    config.globals = { 'ts-jest': { tsconfig: 'tsconfig.json' } };
    config.moduleFileExtensions.push('ts', 'tsx');
    return config;
  },
};
