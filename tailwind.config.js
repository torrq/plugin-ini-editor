/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base:           '#121415',
        surface:        '#171a1d',
        panel:          '#1c2026',
        border:         '#252b33',
        'border-bright':'#2f3a47',
        accent:         '#5caae3',   // RO blue inside logo
        'accent-dim':   '#3a7ab0',
        silver:         '#f6f8ef',   // OS light inside logo
        'silver-dim':   '#c8cfc8',
        header:         '#e2edfc',   // top header text light
        'header-dim':   '#b1ceef',   // top header text dark
        green:          '#4ade80',
        amber:          '#fbbf24',
        red:            '#f87171',
        text:           '#e2edfc',
        muted:          '#637080',
        subtle:         '#2a3340',
      },
      fontFamily: {
        display: ['Montserrat', 'Arial', 'Helvetica', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
