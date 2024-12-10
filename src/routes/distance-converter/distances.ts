import type { IBase } from '$lib/utils';
import { writable } from 'svelte/store';

export interface IDistanceUnit extends IBase {
	inMeters: number;
}

export const distanceUnits = writable<IDistanceUnit[]>([
	{
		id: 'mm',
		name: '',
		inMeters: 0.001
	},
	{
		id: 'cm',
		name: '',
		inMeters: 0.01
	},
	{
		id: 'inch',
		name: '',
		inMeters: 0.0254
	},
	{
		id: 'dm',
		name: '',
		inMeters: 0.1
	},
	{
		id: 'ft',
		name: '',
		inMeters: 0.3048
	},
	{
		id: 'm',
		name: '',
		inMeters: 1
	},
	{
		id: 'km',
		name: '',
		inMeters: 1000
	},
	{
		id: 'mi',
		name: '',
		inMeters: 1609.34
	}
]);
