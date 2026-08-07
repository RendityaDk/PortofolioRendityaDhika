/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0D0D0D',
        'surface-light': '#111111',
        border: 'rgba(255,255,255,0.08)',
        primary: '#F5F5F5',
        secondary: '#A1A1AA',
        muted: '#71717A',
        accent: '#8B5CF6', // Soft purple as default accent
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
