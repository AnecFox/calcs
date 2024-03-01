import { browser } from '$app/environment';
import { writable } from 'svelte/store';

let storedTheme = 'system';

if (browser) {
	storedTheme = localStorage.theme ?? 'system';
}

export const theme = writable(storedTheme);

if (browser) {
	theme.subscribe((value) => (localStorage.theme = value));
}
