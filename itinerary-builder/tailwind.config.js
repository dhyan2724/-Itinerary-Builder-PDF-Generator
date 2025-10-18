/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vigovia-purple': '#6B46C1',
        'vigovia-blue': '#3B82F6',
        'vigovia-light-purple': '#A78BFA',
        'vigovia-gradient-start': '#3B82F6',
        'vigovia-gradient-end': '#6B46C1',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
