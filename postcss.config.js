module.exports = {
  plugins: {
    // 'flex-gap-polyfill': {}, // not working as expected
    tailwindcss: {},
    autoprefixer: {},
    // 'postcss-pxtorem': pxtoremOptions,
    '@thedutchcoder/postcss-rem-to-px': {
      baseValue: 16,
    },
  },
};