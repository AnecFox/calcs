import { browser } from '$app/environment';

export function applyTheme(theme: string) {
	if (isDarkTheme(theme)) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}

export function isDarkTheme(theme: string): boolean {
	if (browser) {
		return (
			theme === 'dark' ||
			(theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
	} else {
		return false;
	}
}
