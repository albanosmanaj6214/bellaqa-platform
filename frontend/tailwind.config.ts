import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#4f6ef7',
          600: '#3b5af5',
          700: '#2a45e8',
          900: '#1a2d9e',
        },
        surface: {
          900: '#0a0e1a',
          800: '#0f1524',
          700: '#161d30',
          600: '#1e2740',
          500: '#252f50',
        },
        glass: 'rgba(255,255,255,0.04)',
      },
      boxShadow: {
        'glass': '0 0 0 1px rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)',
        'card': '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)',
        'glow': '0 0 30px rgba(79,110,247,0.3)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
export default config
