import type { IDistanceUnit } from '../distance-converter/distances';
import type { IBase } from '$lib/utils';
import { writable } from 'svelte/store';

export interface ITime extends IBase {
	inSeconds: number;
}

export const distances = writable<IDistanceUnit[]>([
	{
		id: 'mi',
		name: '',
		inCM: 160_934
	},
	{
		id: 'km',
		name: '',
		inCM: 100_000
	},
	{
		id: 'm',
		name: '',
		inCM: 100
	},
	{
		id: 'ft',
		name: '',
		inCM: 30.48
	},
	{
		id: 'cm',
		name: '',
		inCM: 1
	},
	{
		id: 'mm',
		name: '',
		inCM: 0.1
	}
]);

export const times = writable<ITime[]>([
	{
		id: 'h',
		name: '',
		inSeconds: 3600
	},
	{
		id: 'min',
		name: '',
		inSeconds: 60
	},
	{
		id: 's',
		name: '',
		inSeconds: 1
	}
]);
