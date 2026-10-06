// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Tailwind CSS styling configuration, theme color palette, and dark mode setup
// Key Interface/Contract: Provides design tokens and responsive breakpoints for all React UI components

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        veracity: {
          factual: '#10b981',
          misinformation: '#ef4444',
          warning: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
};
