/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        '#1': ' rgba(149, 157, 165, 0.2) 0px 8px 24px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        green: {
          100: '#e4f7ec',
          200: '#c9f0d9',
          300: '#ade8c7',
          400: '#92e1b4',
          500: '#77d9a1',
          600: '#5fae81',
          700: '#478261',
          800: '#305740',
          900: '#182b20',
        },
        blue: {
          100: '#cdebf2',
          200: '#9bd8e5',
          300: '#68c4d9',
          400: '#36b1cc',
          500: '#049dbf',
          600: '#037e99',
          700: '#025e73',
          800: '#023f4c',
          900: '#011f26',
        },
        white: {
          100: '#fdfdfd',
          200: '#fbfbfb',
          300: '#f9f9f9',
          400: '#f7f7f7',
          500: '#f5f5f5',
          600: '#ededed',
          700: '#939393',
          800: '#626262',
          900: '#313131',
        },
      },
    },
  },
  plugins: [],
};
