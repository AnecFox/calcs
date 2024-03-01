import { browser } from '$app/environment';
import { fallbackLocale, locales } from '$lib/locale/i10n';
import { _, addMessages, dictionary, getLocaleFromNavigator, init, locale } from 'svelte-i18n';
import { derived, get, writable } from 'svelte/store';
import { base } from '$app/paths';

let _activeLocale: string;
const isDownloading = writable(false);

const MESSAGE_FILE_URL_TEMPLATE = `${base}/lang/{locale}.json`;

function setupI18n(options: { withLocale?: string }) {
	let savedLocale = null;

	if (browser) {
		savedLocale = localStorage.language;
	}

	const locale_ = supported(
		options.withLocale ?? language(savedLocale ?? getLocaleFromNavigator())
	);
	init({ fallbackLocale: 'en', initialLocale: locale_ });

	if (!hasLoadedLocale(locale_)) {
		isDownloading.set(true);
		const messageFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', locale_);

		return loadJson(messageFileUrl).then((messages) => {
			_activeLocale = locale_;
			addMessages(locale_, messages);
			locale.set(locale_);
			isDownloading.set(false);
		});
	}
}

function supported(locale: string): string {
	return locale in locales ? locale : fallbackLocale;
}

export function language(locale: string | null | undefined): string {
	return locale?.replace('_', '-').split('-')[0] as string;
}

function hasLoadedLocale(locale: string) {
	return get(dictionary)[locale];
}

async function loadJson(url: string) {
	try {
		const response = await fetch(url);
		return await response.json();
	} catch {
		return '{}';
	}
}

const isLocaleLoaded = derived(
	[isDownloading, dictionary],
	([$isDownloading, $dictionary]) =>
		!$isDownloading &&
		$dictionary[_activeLocale] &&
		Object.keys($dictionary[_activeLocale]).length > 0
);

const direction = derived(locale, ($locale) => ($locale === 'ar' ? 'rtl' : 'ltr'));

locale.subscribe((newLocale) => setupI18n({ withLocale: newLocale as string }));

export { _, direction, isLocaleLoaded, locale, setupI18n };
