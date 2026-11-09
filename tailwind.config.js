const path = require('path')

const fromRoot = (glob) => path.join(__dirname, glob)

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    fromRoot('apps/next/app/**/*.{js,jsx,ts,tsx}'),
    fromRoot('apps/expo/app/**/*.{js,jsx,ts,tsx}'),
    fromRoot('packages/app/**/*.{js,jsx,ts,tsx}'),
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
