<script lang="ts">
	import { locales } from '$lib/locale/i10n';
	import { language, locale } from '$lib/locale/i18n';
	import { applyTheme, theme } from '$lib/theme';
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faCircleHalfStroke, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import { _, getLocaleFromNavigator } from 'svelte-i18n';

	library.add(faSun, faMoon, faCircleHalfStroke, faGithub);

	onMount(updateAriaLabelForThemeButton);

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

	const onChangeLocale = () => {
		if ($locale !== language(getLocaleFromNavigator())) {
			localStorage.language = $locale;
		} else {
			localStorage.removeItem('language');
		}
	};
</script>

<select
	class="locale-selector ms-2 me-2 bg-light-element dark:bg-dark-element"
	bind:value={$locale}
	on:change={onChangeLocale}
>
	{#each Object.keys(locales) as locale}
		<option value={locale}>{locales[locale]}</option>
	{/each}
</select>

<a
	aria-label="GitHub"
	class="flex justify-center items-center p-4 w-5 h-5 me-2 text-xl"
	href="https://github.com/AnecFox/calcs"
	target="_blank"
>
	<FontAwesomeIcon icon={faGithub} size="xl" />
</a>

<button
	class="theme-button flex justify-center items-center p-4 w-5 h-5 me-2 text-xl"
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
		padding: 0.5rem;
		@apply rounded-md;
	}
</style>
