/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'ibabepi-blue': {
          lightest: '#E0F2FE', // sky-100
          lighter: '#BAE6FD',  // sky-200
          light: '#7DD3FC',   // sky-300
          DEFAULT: '#38BDF8', // sky-400
          medium: '#0EA5E9',  // sky-500
          dark: '#0284C7',    // sky-600
          darker: '#0369A1',  // sky-700
          darkest: '#075985', // sky-800
        },
        'ibabepi-gray': {
          lightest: '#F9FAFB', // gray-50
          lighter: '#F3F4F6',  // gray-100
          light: '#E5E7EB',   // gray-200
          DEFAULT: '#D1D5DB', // gray-300
          medium: '#9CA3AF',  // gray-400
          dark: '#6B7280',    // gray-500
          darker: '#4B5563',  // gray-600
          darkest: '#374151', // gray-700
        },
        'ibabepi-white': '#FFFFFF',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        logo: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        'top-soft': '0 -4px 12px -1px rgba(0, 0, 0, 0.05), 0 -2px 4px -2px rgba(0, 0, 0, 0.03)',
        'subtle': '0 2px 4px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};