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
    extend: {
      colors: {
        paper: '#F4F1E8',
        sheet: '#FCFAF3',
        ink: '#141414',
        pencil: '#6B6862',
        'pencil-soft': '#6F6A60',
        rule: '#D6D0BF',
        'rule-strong': '#2A2A28',
        annotation: '#9E2B25',
        resolved: '#3D6B4A',
        sel: '#F1ECDD',
        night: '#171614',
        'night-sheet': '#1F1E1B',
        'night-ink': '#F1ECDD',
        'night-pencil': '#A29B8B',
        'night-soft': '#8C8679',
        'night-rule': '#3A3833',
        'night-strong': '#E8E2D3',
        'night-annotation': '#E0685C',
        'night-resolved': '#8FB894',
        'night-sel': '#262420',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Courier Prime"', 'ui-monospace', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
