/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				light: '#f4f4f4',
				dark: '#3d3d3d',
				darker: '#242424',
				'light-element': '#e8e8e8',
				'dark-element': '#373737'
			}
		}
	},
	plugins: [],
	darkMode: 'class'
};
