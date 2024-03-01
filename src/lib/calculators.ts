import { writable } from 'svelte/store';
import { base } from '$app/paths';

export interface ICalculator {
	icon: string;
	name: string;
	localeKey: string;
	url: string;
	backgroundColor: string;
	backgroundColorDark: string;
	textColor: string;
	textColorDark: string;
}

export const calculators = writable<ICalculator[]>([
	{
		icon: '/images/calc-icons/TimeIcon.svg',
		name: '',
		localeKey: 'timecalc',
		url: `/${base}/timecalc`,
		backgroundColor: '#b0e0f9',
		backgroundColorDark: '#2b5377',
		textColor: '#3378ab',
		textColorDark: '#d6f2ff'
	},
	{
		icon: '/images/calc-icons/CurrencyIcon.svg',
		name: '',
		localeKey: 'currency_converter',
		url: `/${base}/currency-converter`,
		backgroundColor: '#f9e4c5',
		backgroundColorDark: '#78562e',
		textColor: '#b8781f',
		textColorDark: '#fff6d6'
	},
	{
		icon: '/images/calc-icons/DistanceIcon.svg',
		name: '',
		localeKey: 'distance_converter',
		url: `/${base}/distance-converter`,
		backgroundColor: '#fad7d8',
		backgroundColorDark: '#7e3e3e',
		textColor: '#c95453',
		textColorDark: '#ffe8e8'
	},
	{
		icon: '/images/calc-icons/SpeedIcon.svg',
		name: '',
		localeKey: 'speed_converter',
		url: `/${base}/speed-converter`,
		backgroundColor: '#a6f0c3',
		backgroundColorDark: '#315e43',
		textColor: '#35a15f',
		textColorDark: '#d1f4df'
	}
]);
