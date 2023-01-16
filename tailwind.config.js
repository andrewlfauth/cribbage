/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

const variants = ['t-current', 't-domino']

const customVariants = plugin(({ addVariant, e }) => {
  variants.map((variant) =>
    addVariant(variant, ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        const element = e(`${variant}${separator}${className}`)
        return `.${variant} .${element}`
      })
    })
  )
})

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: "'Inter', sans-serif",
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg) translateY(-2px)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(-3deg) translateY(-2px)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [customVariants],
}
