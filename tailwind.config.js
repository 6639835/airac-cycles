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
          50: '#f0f6ff',
          100: '#e2edff',
          200: '#c7d9ff',
          300: '#a5bcff',
          400: '#8295ff',
          500: '#0A2540', // Deep navy
          600: '#091e33',
          700: '#071a2c',
          800: '#051524',
          900: '#03101c',
          950: '#020a13',
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
          50: '#F8F8F8', // Neutral background
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#CCCCCC',
          400: '#ADADAD',
          500: '#8A8A8A',
          600: '#636363',
          700: '#505050',
          800: '#333333', // Dark gray body text
          900: '#1A1A1A',
          950: '#0D0D0D',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-out',
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
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'hard': '0 8px 30px rgba(0, 0, 0, 0.12)',
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
    },
  },
  plugins: [],
} 