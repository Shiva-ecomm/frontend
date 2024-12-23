/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Make sure it scans your components
    './node_modules/@shadcn/ui/dist/**/*.{js,jsx,ts,tsx}', // Include ShadCN components
  ],
  theme: {
    extend: {
      transitionProperty: {
        'background-color': 'background-color',
        'text-color': 'color',
      },
    },
  },
  plugins: [],
}