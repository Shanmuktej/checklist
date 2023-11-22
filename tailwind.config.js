/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fade: 'hidden fadeOut 0.8s ease-in-out',
      },

        keyframes: theme => ({
          fadeOut: {
            '0%': { opacity: 100, scale: 100 },
            '100%': { opacity: 0, scale: 0, visibility: 'hidden' },
          },
        }),
    },
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/container-queries'),
  ],
}