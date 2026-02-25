/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          secondary: '#111118',
          tertiary: '#1a1a24',
          card: '#13131c',
        },
        accent: {
          DEFAULT: '#7c3aed',
          light: '#a855f7',
          glow: '#7c3aed33',
        },
        neon: {
          green: '#39ff14',
          blue: '#00d4ff',
          pink: '#ff0080',
        },
        border: {
          DEFAULT: '#1e1e2e',
          light: '#2a2a3e',
        },
        text: {
          DEFAULT: '#e2e2f0',
          muted: '#6b6b8a',
          faint: '#3a3a5c',
        }
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px #7c3aed33' },
          '50%': { boxShadow: '0 0 20px #7c3aed66, 0 0 40px #7c3aed22' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
        'hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
