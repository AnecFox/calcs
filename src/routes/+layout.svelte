<script>
	import { browser } from '$app/environment';
	import Header from '$lib/ui/Header/Header.svelte';
	import { applyTheme, theme } from '$lib/theme';
	import { onMount } from 'svelte';
	import '../app.css';
	import { direction, isLocaleLoaded } from '$lib/locale/i18n';
	import { base } from '$app/paths';

	$: if (browser && document.dir !== $direction) {
		document.dir = $direction;
	}

	onMount(() => {
		if (browser) {
			applyTheme($theme);

			window
				.matchMedia('(prefers-color-scheme: dark)')
				.addEventListener('change', () => applyTheme($theme));
		}
	});
</script>

<svelte:head>
	<link href="{base}/favicon.png" rel="icon" />
	<link href="{base}/favicon.png" rel="apple-touch-icon" />
	<link href="{base}/manifest.json" rel="manifest" />
</svelte:head>

{#if $isLocaleLoaded}
	<Header />
	<div class="text-center mx-auto">
		<slot />
	</div>
{:else}
	<div class="text-center mx-auto">
		<h2>Loading...</h2>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Sans+Arabic:wght@400;600&family=Noto+Sans+JP:wght@400;700&display=swap');

	:global(*) {
		font-family: 'Noto Sans', 'Noto Sans Arabic', 'Noto Sans JP', sans-serif;
	}
</style>
