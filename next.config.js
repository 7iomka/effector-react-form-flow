const { withPlugins } = require("next-composed-plugins");
const { patchWebpackConfig } = require("next-global-css");
const path = require("path");
// const transpileModules = require('next-transpile-modules');
// const { sassOptions, sassLoaderOptions } = require('@steklo24/config/app/styles/sass-options');
// const { svgConfig } = require('@steklo24/icons/config');

const sassOptions = {
  // that is where can it be located imported scss/css (own or vendor)
  includePaths: [
    path.resolve(__dirname, "./"), // packages root
    path.resolve(__dirname, "./node_modules") // apps modules
  ]
};

const sassLoaderOptions = {
  sassOptions
  // additionalData: `@import "@steklo24/config/app/styles/resources.scss";`,
  // additionalData: `@use "@steklo24/config/app/styles/resources.scss" as *;`,
};

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    externalDir: true
  },
  reactStrictMode: false,
  typescript: {
    // ignoreDevErrors: true,
    // ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  sassOptions: {
    ...sassOptions,
    additionalData: sassLoaderOptions.additionalData // https://github.com/vercel/next.js/discussions/24105
  },
  webpack: (config, options) => {
    // svgConfig(config);
    patchWebpackConfig(config, options);
    // workspacesConfig(config);

    return config;
  }
};

const plugins = [];

module.exports = withPlugins(nextConfig, plugins);
