// const defaultTheme = require("tailwindcss/defaultTheme");
const bootstrapGridPlugin = require('tailwind-bootstrap-grid');
const { corePlugins } = require('tailwindcss/lib/corePlugins');

const spacingAliased = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

const spacingWithoutUnit = {
  ...Object.keys(spacingAliased).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: spacingAliased[curr],
    };
  }, {}),
  ...Array.from(Array(301).keys()).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: curr,
    };
  }, {}),
};

const spacingWithPxUnit = {
  ...Object.keys(spacingAliased).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: spacingAliased[curr] + 'px',
    };
  }, {}),
  ...Array.from(Array(301).keys()).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: spacingWithoutUnit[curr] + 'px',
    };
  }, {}),
};

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    spacing: spacingWithPxUnit,
  },
  plugins: [
    bootstrapGridPlugin(),
   
  ],
  corePlugins: {
    ...corePlugins,
    container: false, // use bootstrap grid implementation instead
    preflight: false, // disable preflight, and include modified version (prevent conflict with @emotion prepend)
  },
};
