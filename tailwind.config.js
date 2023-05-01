/** @type {import('tailwindcss').Config} */
/* eslint-env node */

export default {
    mode: 'jit',
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require('flowbite/plugin')],
};
