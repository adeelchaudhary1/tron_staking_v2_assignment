const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const config = {
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }

    // From https://github.com/rustwasm/wasm-pack/issues/835#issuecomment-772591665
    config.experiments = {
      syncWebAssembly: true,
      layers: true, // Enable module and chunk layers
    }

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/sync',
    })

    config.optimization.splitChunks = {}
    config.optimization.minimize = false
    return config
  },
  reactStrictMode: false,
  async rewrites() {
    return []
  },
  async redirects() {
    return [
    ]
  },
}

module.exports = withBundleAnalyzer(config)
