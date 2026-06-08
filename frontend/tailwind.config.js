/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#09090B',
          card: '#18181B',
          primary: '#F97316',
          secondary: '#FB923C',
          text: '#FAFAFA',
          lightBg: '#F4F4F5',
          lightCard: '#FFFFFF',
          lightText: '#09090B',
        }
      },
      animation: {
        'glow-pulse': 'glow 3s infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(249, 115, 22, 0.2), 0 0 15px rgba(249, 115, 22, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.6), 0 0 35px rgba(249, 115, 22, 0.3)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
