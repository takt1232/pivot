const path = require('path')

const nativeAliases = {
  'react-native': 'react-native-web',
  'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
    'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
  'react-native/Libraries/vendor/emitter/EventEmitter$':
    'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
  'react-native/Libraries/EventEmitter/NativeEventEmitter$':
    'react-native-web/dist/vendor/react-native/NativeEventEmitter',
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reanimated does not support React strict mode on the web.
  reactStrictMode: false,
  transpilePackages: [
    '@pivot/app',
    'solito',
    'nativewind',
    'react-native-css-interop',
    'react-native',
    'react-native-web',
    'react-native-reanimated',
    'react-native-worklets',
    'react-native-safe-area-context',
  ],
  compiler: {
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
  },
  turbopack: {
    root: path.resolve(__dirname, '../..'),
    resolveAlias: nativeAliases,
    resolveExtensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.mjs',
      '.tsx',
      '.ts',
      '.jsx',
      '.json',
      '.wasm',
    ],
  },
  webpack(config) {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...nativeAliases,
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ]
    return config
  },
}

module.exports = nextConfig
