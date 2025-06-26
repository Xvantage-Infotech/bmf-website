// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };


// postcss.config.js
module.exports = {
  plugins: {
    'postcss-nesting': {},     // ✅ CORRECT nesting plugin
    '@tailwindcss/postcss': {},        // ✅ Tailwind plugin
    autoprefixer: {},          // ✅ Keep this
  },
};


// module.exports = {
//   plugins: {
//     '@tailwindcss/postcss': {}, // Use the new Tailwind CSS PostCSS plugin
//     autoprefixer: {},
//   },
// };