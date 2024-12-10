import type { IBase } from '$lib/utils';
import { writable } from 'svelte/store';
import type { IDistanceUnit } from '../distance-converter/distances';

export interface ITime extends IBase {
	inSeconds: number;
}

export const distances = writable<IDistanceUnit[]>([
	{
		id: 'mi',
		name: '',
		inMeters: 1609.34
	},
	{
		id: 'km',
		name: '',
		inMeters: 1000
	},
	{
		id: 'm',
		name: '',
		inMeters: 1
	},
	{
		id: 'ft',
		name: '',
		inMeters: 0.3048
	},
	{
		id: 'cm',
		name: '',
		inMeters: 0.01
	},
	{
		id: 'mm',
		name: '',
		inMeters: 0.001
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
