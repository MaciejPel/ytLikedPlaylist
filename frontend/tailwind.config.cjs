/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			keyframes: {
				pulsate: {
					'0%, 100%': { transform: 'scale(1);' },
					'50%': { transform: 'scale(1.4);' },
				},
			},
			animation: {
				pulsate: 'pulsate 1s ease-in-out infinite',
			},
		},
	},
	plugins: [],
};
