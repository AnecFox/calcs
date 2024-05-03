<script lang="ts">
	import { browser } from '$app/environment';
	import { isDarkTheme, theme } from '$lib/theme';
	import { onMount } from 'svelte';
	import CalculatorItemContent from './CalculatorItemContent.svelte';
	import { base } from '$app/paths';

	let isDark: boolean = isDarkTheme($theme);

	export let icon: string;
	export let name: string;
	export let url: string;

	export let backgroundColor: string;
	export let backgroundColorDark: string;
	export let textColor: string;
	export let textColorDark: string;

	onMount(() => {
		if (browser) {
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.addEventListener('change', updateThemeIsDark);

			const themeButton = document.querySelector('.theme-button');
			themeButton?.addEventListener('click', updateThemeIsDark);
		}
	});

	const updateThemeIsDark = () => (isDark = isDarkTheme($theme));
</script>

<a href="{base}/{url}">
	{#if isDark}
		<div class="item" style="color: {textColorDark}; background-color: {backgroundColorDark};">
			<CalculatorItemContent icon="{base}/{icon}" {name} />
		</div>
	{:else}
		<div class="item" style="color: {textColor}; background-color: {backgroundColor};">
			<CalculatorItemContent icon="{base}/{icon}" {name} />
		</div>
	{/if}
</a>

<style lang="postcss">
	.item {
		display: flex;
		align-items: center;
		padding: 1.2rem;
		font-size: 1.1rem;
		border-radius: 30px;
		min-width: 16rem;
		max-width: 20rem;
		cursor: pointer;
		transition: transform 0.2s ease-out;
	}

	@media only screen and (pointer: fine) {
		.item {
			@apply hover:scale-110;
		}
	}
</style>
