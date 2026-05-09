/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#0F172A',
        secondary:  '#60A5FA',
        tertiary:   '#06B6D4',
        neutral:    '#E0F2FE',
        surface:    '#FFFFFF',
        'on-primary': '#FFFFFF',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display': ['4.5rem', { fontWeight: '800', letterSpacing: '-0.04em' }],
        'h1':      ['2.5rem', { fontWeight: '700' }],
        'body':    ['0.95rem', { lineHeight: '1.55' }],
        'label':   ['0.72rem', { letterSpacing: '0.04em' }],
      },
      borderRadius: {
        'sm':  '10px',
        'md':  '18px',
        'lg':  '28px',
      },
      spacing: {
        'sm': '8px',
        'md': '16px',
        'lg': '32px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)',
        'float': '0 8px 30px rgba(15, 23, 42, 0.08)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
