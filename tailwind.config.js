// // tailwind.config.js
// const { fontFamily } = require('tailwindcss/defaultTheme');
// const animate = require("tailwindcss-animate");
// const typography = require("@tailwindcss/typography");

// module.exports = {
//   content: [
//     './src/app/**/*.{js,ts,jsx,tsx}',
//     './src/components/**/*.{js,ts,jsx,tsx}',
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       colors: {
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         muted: 'hsl(var(--muted))',
//         'muted-foreground': 'hsl(var(--muted-foreground))',
//         popover: 'hsl(var(--popover))',
//         'popover-foreground': 'hsl(var(--popover-foreground))',
//         card: 'hsl(var(--card))',
//         'card-foreground': 'hsl(var(--card-foreground))',
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         primary: 'hsl(var(--primary))',
//         'primary-foreground': 'hsl(var(--primary-foreground))',
//         secondary: 'hsl(var(--secondary))',
//         'secondary-foreground': 'hsl(var(--secondary-foreground))',
//         accent: 'hsl(var(--accent))',
//         'accent-foreground': 'hsl(var(--accent-foreground))',
//         destructive: 'hsl(var(--destructive))',
//         'destructive-foreground': 'hsl(var(--destructive-foreground))',
//         ring: 'hsl(var(--ring))',

//         // custom theme colors
//         'farm-green': 'hsl(var(--farm-green))',
//         'farm-green-dark': 'hsl(var(--farm-green-dark))',
//         'farm-accent': 'hsl(var(--farm-accent))',
//         'farm-neutral-50': 'hsl(var(--farm-neutral-50))',
//         'farm-neutral-100': 'hsl(var(--farm-neutral-100))',
//         'farm-neutral-600': 'hsl(var(--farm-neutral-600))',
//         'farm-neutral-900': 'hsl(var(--farm-neutral-900))',
//       },
//       fontFamily: {
//         sans: ['Inter', ...fontFamily.sans],
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//       },
//     },
//   },
//   plugins: [animate, typography],
// };






// const { fontFamily } = require('tailwindcss/defaultTheme');
// const animate = require("tailwindcss-animate");
// const typography = require("@tailwindcss/typography");

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/app/**/*.{js,ts,jsx,tsx}',
//     './src/components/**/*.{js,ts,jsx,tsx}',
//     './client/index.html',
//     './client/src/**/*.{js,jsx,ts,tsx}',
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       colors: {
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         muted: 'hsl(var(--muted))',
//         'muted-foreground': 'hsl(var(--muted-foreground))',
//         popover: 'hsl(var(--popover))',
//         'popover-foreground': 'hsl(var(--popover-foreground))',
//         card: 'hsl(var(--card))',
//         'card-foreground': 'hsl(var(--card-foreground))',
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         primary: 'hsl(var(--primary))',
//         'primary-foreground': 'hsl(var(--primary-foreground))',
//         secondary: 'hsl(var(--secondary))',
//         'secondary-foreground': 'hsl(var(--secondary-foreground))',
//         accent: 'hsl(var(--accent))',
//         'accent-foreground': 'hsl(var(--accent-foreground))',
//         destructive: 'hsl(var(--destructive))',
//         'destructive-foreground': 'hsl(var(--destructive-foreground))',
//         ring: 'hsl(var(--ring))',

//         // custom theme colors
//         'farm-green': 'hsl(var(--farm-green))',
//         'farm-green-dark': 'hsl(var(--farm-green-dark))',
//         'farm-accent': 'hsl(var(--farm-accent))',
//         'farm-neutral-50': 'hsl(var(--farm-neutral-50))',
//         'farm-neutral-100': 'hsl(var(--farm-neutral-100))',
//         'farm-neutral-600': 'hsl(var(--farm-neutral-600))',
//         'farm-neutral-900': 'hsl(var(--farm-neutral-900))',

//         // extended system-style tokens
//         card: {
//           DEFAULT: 'var(--card)',
//           foreground: 'var(--card-foreground)',
//         },
//         popover: {
//           DEFAULT: 'var(--popover)',
//           foreground: 'var(--popover-foreground)',
//         },
//         primary: {
//           DEFAULT: 'var(--primary)',
//           foreground: 'var(--primary-foreground)',
//         },
//         secondary: {
//           DEFAULT: 'var(--secondary)',
//           foreground: 'var(--secondary-foreground)',
//         },
//         muted: {
//           DEFAULT: 'var(--muted)',
//           foreground: 'var(--muted-foreground)',
//         },
//         accent: {
//           DEFAULT: 'var(--accent)',
//           foreground: 'var(--accent-foreground)',
//         },
//         destructive: {
//           DEFAULT: 'var(--destructive)',
//           foreground: 'var(--destructive-foreground)',
//         },
//         chart: {
//           1: 'var(--chart-1)',
//           2: 'var(--chart-2)',
//           3: 'var(--chart-3)',
//           4: 'var(--chart-4)',
//           5: 'var(--chart-5)',
//         },
//         sidebar: {
//           DEFAULT: 'var(--sidebar-background)',
//           foreground: 'var(--sidebar-foreground)',
//           primary: 'var(--sidebar-primary)',
//           'primary-foreground': 'var(--sidebar-primary-foreground)',
//           accent: 'var(--sidebar-accent)',
//           'accent-foreground': 'var(--sidebar-accent-foreground)',
//           border: 'var(--sidebar-border)',
//           ring: 'var(--sidebar-ring)',
//         },
//       },
//       fontFamily: {
//         sans: ['Inter', ...fontFamily.sans],
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },
//       keyframes: {
//         'accordion-down': {
//           from: { height: '0' },
//           to: { height: 'var(--radix-accordion-content-height)' },
//         },
//         'accordion-up': {
//           from: { height: 'var(--radix-accordion-content-height)' },
//           to: { height: '0' },
//         },
//       },
//       animation: {
//         'accordion-down': 'accordion-down 0.2s ease-out',
//         'accordion-up': 'accordion-up 0.2s ease-out',
//       },
//     },
//   },
//   plugins: [animate, typography],
// };






const { fontFamily } = require('tailwindcss/defaultTheme');
const animate = require('tailwindcss-animate');
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
    './app/**/*.{js,ts,jsx,tsx}',         // App directory
    './components/**/*.{js,ts,jsx,tsx}',   // Components directory
    './pages/**/*.{js,ts,jsx,tsx}',        // Pages if used
    './src/**/*.{js,ts,jsx,tsx}',          // If anything lives in src
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        ring: 'hsl(var(--ring))',

        // Custom Farm Theme
        'farm-green': 'hsl(var(--farm-green))',
        'farm-green-light': 'hsl(var(--farm-green-light))',
        'farm-green-dark': 'hsl(var(--farm-green-dark))',
        'farm-accent': 'hsl(var(--farm-accent))',
        'farm-neutral-50': 'hsl(var(--farm-neutral-50))',
        'farm-neutral-100': 'hsl(var(--farm-neutral-100))',
        'farm-neutral-600': 'hsl(var(--farm-neutral-600))',
        'farm-neutral-900': 'hsl(var(--farm-neutral-900))',

        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate, typography],
};
