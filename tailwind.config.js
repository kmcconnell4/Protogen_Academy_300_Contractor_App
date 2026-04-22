// tailwind.config.js
// Tailwind v4 primarily uses CSS configuration via @theme in src/assets/main.css.
// This file is kept for IDE tooling/editor support and documents the token map.
// Color tokens are authoritative in main.css @theme — this JS config mirrors them.

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand:            '#164da6',
        interactive:      '#2E6FD8',
        highlight:        '#5B9BF0',
        bg:               '#151C28',
        surface:          '#1E2A3E',
        'surface-alt':    '#243044',
        nav:              '#0F1520',
        amber:            '#F5A623',
        emerald:          '#4ACA6E',
        error:            '#FF4C4C',
        'text-secondary': '#A8B8D0',
        border:           '#2E3A52',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['16px', { lineHeight: '1.5' }],
      },
      minHeight: {
        'tap': '52px',
      },
    },
  },
  plugins: [],
}
