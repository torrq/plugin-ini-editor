/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0b0d14',
        surface: '#11141e',
        panel: '#171b28',
        border: '#232739',
        'border-bright': '#343a52',
        accent: '#22d3ee',
        'accent-dim': '#0e7490',
        green: '#4ade80',
        amber: '#fbbf24',
        red: '#f87171',
        text: '#dde1f0',
        muted: '#606680',
        subtle: '#3a3f57',
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
