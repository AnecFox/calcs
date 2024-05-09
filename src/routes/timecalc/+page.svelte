<script lang="ts">
	import { onMount } from 'svelte';
	import { saveData } from '$lib/utils';
	import { getNumber, selectWordForNumber } from '$lib/locale/lang-utils';
	import { _, locale } from '$lib/locale/i18n';
	import ResetButton from '$lib/ui/ResetButton.svelte';

	interface ISelectedData {
		firstTime: string;
		secondTime: string;
	}

	const LOCALSTORAGE_DATA_KEY = 'timeCalculatorData';

	const defaultTime = '00:00';

	let firstTime: string;
	let secondTime: string;

	let resultString: string;
	let result: string;

	onMount(() => {
		const selectedTime: ISelectedData = JSON.parse(
			localStorage.getItem(LOCALSTORAGE_DATA_KEY) ?? '{}'
		);
		const timeCheck = /^\d\d:\d\d$/;

		if (timeCheck.exec(selectedTime.firstTime) && timeCheck.exec(selectedTime.secondTime)) {
			firstTime = selectedTime.firstTime;
			secondTime = selectedTime.secondTime;
		} else {
			resetSelectedTime();
		}
	});

	$: if (!firstTime || !secondTime) {
		resultString = $_('timecalc.time_not_selected');
	} else {
		let firstTimeValue: Date = new Date('April 23, 2023 ' + firstTime);
		let secondTimeValue: Date = new Date('April 23, 2023 ' + secondTime);
		let difference: Date = new Date(secondTimeValue.getTime() - firstTimeValue.getTime());

		let hours: number = difference.getUTCHours();
		let minutes: number = difference.getUTCMinutes();

		const hourWords: string[] = [
			$_('timecalc.hour_word_1'),
			$_('timecalc.hour_word_2'),
			$_('timecalc.hour_word_3')
		];
		const minuteWords: string[] = [
			$_('timecalc.minute_word_1'),
			$_('timecalc.minute_word_2'),
			$_('timecalc.minute_word_3')
		];

		const hourWord: string = selectWordForNumber(hours, hourWords, $locale ?? 'en');
		const minuteWord: string = selectWordForNumber(minutes, minuteWords, $locale ?? 'en');

		if (hours !== 0 && minutes !== 0) {
			// isArabicAndTwo for not displaying the number in Arabic if the number is 2
			result = `${isArabicAndTwo(hours) ? '' : hours + ' '}${hourWord}${$_(
				'timecalc.result_separator'
			)}${isArabicAndTwo(minutes) ? '' : minutes + ' '}${minuteWord}`;
		} else {
			result =
				(hours === 0 ? '' : `${isArabicAndTwo(hours) ? '' : hours + ' '}${hourWord} `) +
				(minutes === 0 && hours !== 0
					? ''
					: `${isArabicAndTwo(minutes) ? '' : minutes + ' '} ${minuteWord}`);
		}

		resultString = `${$_('result')}: ${getNumber(result)}`;

		saveData(LOCALSTORAGE_DATA_KEY, { firstTime, secondTime });
	}

	const isArabicAndTwo = (number: number) => $locale === 'ar' && number === 2;

	function resetSelectedTime() {
		firstTime = defaultTime;
		secondTime = defaultTime;
	}
</script>

<main class="wrapper flex flex-col items-center">
	<h1 class="text-[#3d8ac2] dark:text-[#7ebde0]">Time<wbr />Calculator</h1>

	<div class="mx-auto text-end">
		<div class="mb-5">
			<label
				>{$_('timecalc.from_time')}
				<input bind:value={firstTime} class="control" type="time" />
			</label>
		</div>

		<div class="mb-5">
			<label
				>{$_('timecalc.to_time')}
				<input bind:value={secondTime} class="control" type="time" />
			</label>
		</div>
	</div>

	<h2>{resultString}</h2>

	<ResetButton resetFunction={resetSelectedTime} />
</main>

<style lang="postcss">
	label {
		margin: 0.5rem;
		font-size: 1.2rem;
	}

	input {
		font-size: 1.3rem;
		width: min-content;
		margin-inline-start: 2.4vw;
	}

	input[type='time']::-webkit-calendar-picker-indicator {
		display: none;
	}
</style>
