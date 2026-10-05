/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36a9f8',
          500: '#0c8de9',
          600: '#0270c7',
          700: '#0359a1',
          800: '#074c85',
          900: '#0c406e',
          950: '#082849',
        },
        accent: {
          50: '#fff1f2',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(12, 141, 233, 0.25)',
      }
    },
  },
  plugins: [],
}
