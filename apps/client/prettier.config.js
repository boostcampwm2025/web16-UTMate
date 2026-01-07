/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
module.exports = {
  ...require('@org/prettier-config'),
  plugins: ['prettier-plugin-tailwindcss'],
};

