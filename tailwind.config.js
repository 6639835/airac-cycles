/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#edfcf7',
          100: '#d3f8ec',
          200: '#a8f0dc',
          300: '#74e3c8',
          400: '#4A9C82', // Muted teal
          500: '#3e8971',
          600: '#2e6b5a',
          700: '#285646',
          800: '#224539',
          900: '#1d3a30',
          950: '#0f211b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        dark: {
          50: '#f8fafc',
          100: '#1e293b',  // Dark cards with subtle blue tint
          200: '#0f172a',  // Main dark background - deep navy
          300: '#0c1420',  // Darker sections
          400: '#06090f',  // Darkest elements
          500: '#334155',  // Dark borders
          600: '#475569',  // Dark text on light
          700: '#64748b',  // Muted text
          800: '#94a3b8',  // Light text on dark
          900: '#cbd5e1',  // Lightest text
          accent: '#1e40af', // Accent blue for dark mode
          highlight: 'rgba(59, 130, 246, 0.1)', // Blue highlights
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(10, 37, 64, 0.35)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 25px rgba(10, 37, 64, 0.5)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'hard': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'dark-soft': '0 2px 10px rgba(0, 0, 0, 0.3)',
        'dark-medium': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'dark-hard': '0 8px 30px rgba(0, 0, 0, 0.5)',
        'inner-dark': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'inner-darker': 'inset 0 2px 4px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.15)',
        'glow-strong': '0 0 25px rgba(99, 102, 241, 0.3)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '128': '32rem',
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        'dark-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'dark-glow': 'linear-gradient(to bottom right, rgba(10, 37, 64, 0.1), rgba(10, 37, 64, 0))',
      },
    },
  },
  plugins: [],
} 