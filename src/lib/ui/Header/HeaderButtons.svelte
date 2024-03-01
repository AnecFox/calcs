<script lang="ts">
	import { locales } from '$lib/locale/i10n';
	import { language, locale } from '$lib/locale/i18n';
	import { applyTheme } from '$lib/theme';
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import {
		faCircleHalfStroke,
		faLanguage,
		faMoon,
		faSun
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import { _, getLocaleFromNavigator } from 'svelte-i18n';
	import { theme } from '../../../store';

	library.add(faSun, faMoon, faCircleHalfStroke, faGithub, faLanguage);

	let isLocaleMenuOpen = false;

	onMount(() => {
		updateAriaLabelForThemeButton();

		document.addEventListener('click', (event: MouseEvent) => {
			const languageButton = document.querySelector('.change-language-button');
			const localeList = document.querySelector('.locale-selector');

			if (
				languageButton?.contains(event.target as Node) ||
				localeList?.contains(event.target as Node)
			)
				return;

			isLocaleMenuOpen = false;
		});
	});

	function updateAriaLabelForThemeButton() {
		const themeButton = document.querySelector('.theme-button');
		themeButton?.setAttribute('aria-label', getAriaLabelForThemeButton($theme));
	}

	function getAriaLabelForThemeButton(theme: string): string {
		let themeWord;

		if (theme === 'system') {
			themeWord = $_('header.theme.system');
		} else if (theme === 'light') {
			themeWord = $_('header.theme.light');
		} else if (theme === 'dark') {
			themeWord = $_('header.theme.dark');
		} else {
			throw new Error(`Unknown theme: theme ${theme} is not exists!`);
		}
		return $_('header.theme.button_aria_label', { values: { theme: themeWord } });
	}

	function toggleTheme() {
		if ($theme === 'system') {
			$theme = 'light';
		} else if ($theme === 'light') {
			$theme = 'dark';
		} else if ($theme === 'dark') {
			$theme = 'system';
		}
		applyTheme($theme);
		updateAriaLabelForThemeButton();
	}

	const toggleLocaleMenu = () => (isLocaleMenuOpen = !isLocaleMenuOpen);

	const onChangeLocale = () => {
		isLocaleMenuOpen = false;
		if ($locale !== language(getLocaleFromNavigator())) {
			localStorage.language = $locale;
		} else {
			localStorage.removeItem('language');
		}
	};
</script>

<button
	class="change-language-button flex justify-center items-center p-4 w-5 h-5 me-3 text-xl"
	aria-label={$_('header.language_button_aria_label')}
	on:click={toggleLocaleMenu}
>
	<FontAwesomeIcon icon={faLanguage} size="xl" />
</button>
<div class="locale-selector-container" class:open={isLocaleMenuOpen}>
	<select
		name="locale-selector"
		class="locale-selector"
		bind:value={$locale}
		on:change={onChangeLocale}
	>
		{#each Object.keys(locales) as locale}
			<option value={locale}>{locales[locale]}</option>
		{/each}
	</select>
</div>

<a
	aria-label="GitHub"
	class="flex justify-center items-center p-4 w-5 h-5 me-3 text-xl"
	href="https://github.com/AnecFox/calcs"
	target="_blank"
>
	<FontAwesomeIcon icon={faGithub} size="xl" />
</a>

<button
	class="theme-button flex justify-center items-center p-4 w-5 h-5 me-3 text-xl"
	on:click={toggleTheme}
>
	{#if $theme === 'system'}
		<FontAwesomeIcon icon={faCircleHalfStroke} size="xl" />
	{:else if $theme === 'light'}
		<FontAwesomeIcon icon={faSun} size="xl" />
	{:else if $theme === 'dark'}
		<FontAwesomeIcon icon={faMoon} size="xl" />
	{/if}
</button>

<style lang="postcss">
	.locale-selector {
		appearance: none;
		margin: 0.2rem;
		padding: 0.5rem;
		@apply bg-light-element dark:bg-dark-element rounded-md;
	}

	.locale-selector-container {
		transition: all 0.14s ease;
		@apply absolute top-6 end-24 opacity-0 invisible;
	}

	.locale-selector-container.open {
		top: calc(100% + 1px);
		@apply opacity-100 visible;
	}
</style>
