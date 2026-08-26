/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#F4F9F5',
          100: '#EAF4ED',
          200: '#D5E9DC',
          300: '#A9D3B6',
          400: '#73B48A',
          500: '#439363',
          600: '#1F6B45', // Primary Green (#1F6B45)
          700: '#185637',
          800: '#14452E',
          900: '#103926',
        },
        harvest: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        charcoal: '#17201A',
        mutedText: '#68736B',
        bgLight: '#F8FAF8',
        borderLight: '#DCE4DE',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'flow-particle': 'flow 3s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
