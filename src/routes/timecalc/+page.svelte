<script lang="ts">
	import { browser } from '$app/environment';
	import { _ } from '$lib/locale/i18n';
	import { onMount } from 'svelte';
	import DateMode from './DateMode.svelte';
	import HourMode from './HourMode.svelte';

	const IS_DATE_MODE_LOCALSTORAGE_KEY = 'isDateModeInTimeCalc';

	let isDateMode = false;
	let isDateModeLoaded = false;

	onMount(() => {
		isDateMode = localStorage.getItem(IS_DATE_MODE_LOCALSTORAGE_KEY) === 'true' ? true : false;
		isDateModeLoaded = true;
	});

	$: if (browser && isDateModeLoaded) {
		localStorage.setItem(IS_DATE_MODE_LOCALSTORAGE_KEY, String(isDateMode));
	}
</script>

<main class="wrapper flex flex-col items-center">
	<h1 class="text-[#3d8ac2] dark:text-[#7ebde0]">Time<wbr />Calculator</h1>

	{#if isDateMode}
		<DateMode />
	{:else}
		<HourMode />
	{/if}

	<label
		>{$_('timecalc.date_mode.mode_name')}
		<input type="checkbox" bind:checked={isDateMode} />
	</label>
</main>
