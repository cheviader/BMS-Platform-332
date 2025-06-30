/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#6B05F0',
        secondary: '#1FD6FF',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6B05F0 0%, #1FD6FF 100%)',
        'gradient-primary-light': 'linear-gradient(135deg, #6B05F0 0%, #1FD6FF 50%, #E0F7FF 100%)',
      }
    },
  },
  plugins: [],
}