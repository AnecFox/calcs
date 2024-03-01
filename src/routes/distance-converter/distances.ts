import { writable } from 'svelte/store';
import type { IBase } from '$lib/utils';

export interface IDistanceUnit extends IBase {
	inCM: number;
}

export const distanceUnits = writable<IDistanceUnit[]>([
	{
		id: 'mm',
		name: '',
		inCM: 0.1
	},
	{
		id: 'cm',
		name: '',
		inCM: 1
	},
	{
		id: 'inch',
		name: '',
		inCM: 2.54
	},
	{
		id: 'dm',
		name: '',
		inCM: 10
	},
	{
		id: 'ft',
		name: '',
		inCM: 30.48
	},
	{
		id: 'm',
		name: '',
		inCM: 100
	},
	{
		id: 'km',
		name: '',
		inCM: 100_000
	},
	{
		id: 'mi',
		name: '',
		inCM: 160_934
	}
]);
