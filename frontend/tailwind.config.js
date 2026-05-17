/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Islamic-themed color palette
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bbe5cb',
          300: '#8dd1a9',
          400: '#58b581',
          500: '#359963', // Main primary - Islamic green
          600: '#267a4f',
          700: '#206241',
          800: '#1c4e36',
          900: '#18402e',
          950: '#0c241a',
        },
        secondary: {
          50: '#fdf8f1',
          100: '#f9eddc',
          200: '#f2d9b8',
          300: '#e9be8b',
          400: '#de9c5c',
          500: '#d6823e', // Gold accent
          600: '#c86a2d',
          700: '#a65227',
          800: '#854326',
          900: '#6c3922',
          950: '#3a1b0f',
        },
        accent: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dbe7',
          300: '#a7bdd3',
          400: '#789aba',
          500: '#577da1', // Calm blue
          600: '#446487',
          700: '#38526e',
          800: '#31465c',
          900: '#2c3c4e',
          950: '#1d2834',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'flame': 'flame 1.5s infinite',
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
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.1) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
};
