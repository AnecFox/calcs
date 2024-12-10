<script lang="ts">
	import { _, locale } from '$lib/locale/i18n';
	import { replaceNumbersDependsLocale, selectWordForNumber } from '$lib/locale/lang-utils';
	import ResetButton from '$lib/ui/ResetButton.svelte';
	import TimeInput from '$lib/ui/TimeInput.svelte';
	import { saveData } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { ISelectedData } from './timeCalc';
	import { LOCALSTORAGE_DATA_KEY } from './timeCalc';

	const DEFAULT_TIME = '00:00';

	let firstTime: string;
	let secondTime: string;

	let resultString: string;
	let result: string;

	onMount(() => {
		const selectedTimes: ISelectedData = JSON.parse(
			localStorage.getItem(LOCALSTORAGE_DATA_KEY) ?? '{}'
		);
		const timeCheck = /^\d\d:\d\d$/;

		if (timeCheck.exec(selectedTimes.firstTime) && timeCheck.exec(selectedTimes.secondTime)) {
			firstTime = selectedTimes.firstTime;
			secondTime = selectedTimes.secondTime;
		} else {
			resetSelectedTimes();
		}
	});

	function resetSelectedTimes() {
		firstTime = secondTime = DEFAULT_TIME;
	}

	$: if (!firstTime || !secondTime) {
		resultString = $_('timecalc.hour_mode.time_not_selected');
	} else {
		let firstTimeValue: Date = new Date('April 23, 2023 ' + firstTime);
		let secondTimeValue: Date = new Date('April 23, 2023 ' + secondTime);
		let difference: Date = new Date(secondTimeValue.getTime() - firstTimeValue.getTime());

		let hours: number = difference.getUTCHours();
		let minutes: number = difference.getUTCMinutes();

		const hourWords: string[] = [
			$_('timecalc.hour_mode.hour_word_1'),
			$_('timecalc.hour_mode.hour_word_2'),
			$_('timecalc.hour_mode.hour_word_3')
		];
		const minuteWords: string[] = [
			$_('timecalc.hour_mode.minute_word_1'),
			$_('timecalc.hour_mode.minute_word_2'),
			$_('timecalc.hour_mode.minute_word_3')
		];

		const hourWord: string = selectWordForNumber(hours, hourWords, $locale ?? 'en');
		const minuteWord: string = selectWordForNumber(minutes, minuteWords, $locale ?? 'en');

		if (hours !== 0 && minutes !== 0) {
			result = `${hours} ${hourWord}${$_(
				'timecalc.hour_mode.result_separator'
			)}${minutes} ${minuteWord}`;
		} else {
			result =
				(hours === 0 ? '' : `${hours} ${hourWord} `) +
				(minutes === 0 && hours !== 0 ? '' : `${minutes} ${minuteWord}`);
		}

		// removing all numbers two in Arabic
		result = $locale === 'ar' ? result.replaceAll(' 2 ', ' ') : result;

		resultString = `${$_('result')}: ${replaceNumbersDependsLocale(result)}`;

		saveData(LOCALSTORAGE_DATA_KEY, { firstTime, secondTime });
	}
</script>

<div class="mx-auto text-end">
	<TimeInput text={$_('timecalc.from_time')} bind:value={firstTime} isDateMode={false} />
	<TimeInput text={$_('timecalc.to_time')} bind:value={secondTime} isDateMode={false} />
</div>

<h2>{resultString}</h2>
<ResetButton resetFunction={resetSelectedTimes} />
