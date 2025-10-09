import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    // Finds the existing rule for handling image imports
    const fileLoaderRule = config.module.rules.find(
      (rule: { test: { test: (arg0: string) => any } }) => rule.test && rule.test.test('.svg'),
    );

    if (fileLoaderRule) {
      // Excludes SVG files from the default image loader
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Adds a new rule to load SVG files as React components
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
      issuer: /\.[jt]sx?$/,
    });

    if (!isServer)
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
      };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
