/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        line: {
          '0%': { left: '0%', width: '10%' },
          '20%': { left: '20%', width: '60%' },
          '50%': { left: '40%', width: '60%' },
          '100%': { left: '100%', width: '100%' }
        }
      },
      animation: {
        'lineAnim': 'line 2s infinite'
      }
    }
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('flowbite/plugin')
  ]
}
