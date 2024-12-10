import type { IBase } from '$lib/utils';
import { writable } from 'svelte/store';

export const LOCALSTORAGE_DATA_KEY = 'timeCalculatorData';

export interface ISelectedData {
	firstTime: string;
	secondTime: string;
}

export interface ISelectedDateModeData {
	first: {
		date: string;
		isBce: boolean;
	};
	second: {
		date: string;
		isBce: boolean;
	};
}

export interface IDate {
	year: number;
	month: number;
	day: number;
	era: IEra;
}

export interface IEra extends IBase {
	name: string;
	isBce: boolean;
}

export const eras = writable<IEra[]>([
	{
		id: 'bce',
		name: '',
		isBce: true
	},
	{
		id: 'ce',
		name: '',
		isBce: false
	}
]);
