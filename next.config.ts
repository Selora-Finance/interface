import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Finds the existing rule for handling image imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test && rule.test.test(".svg")
    );

    if (fileLoaderRule) {
      // Excludes SVG files from the default image loader
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Adds a new rule to load SVG files as React components
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
      issuer: /\.[jt]sx?$/,
    });

    return config;
  },
};

export default nextConfig;