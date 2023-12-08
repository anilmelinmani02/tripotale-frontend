/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      'xxsm': '174px',
      'xsm': '375px',
      'sm': '576px',
      'md': '1020px',
      'lg': '1230px',
    },
    extend: {},
  },
  plugins: [],
}

