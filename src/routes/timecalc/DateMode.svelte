<script lang="ts">
	import { _, locale } from '$lib/locale/i18n';
	import { replaceNumbersDependsLocale, selectWordForNumber } from '$lib/locale/lang-utils';
	import ResetButton from '$lib/ui/ResetButton.svelte';
	import Select from '$lib/ui/Select.svelte';
	import TimeInput from '$lib/ui/TimeInput.svelte';
	import { saveData } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { IDate, IEra, ISelectedDateModeData } from './timeCalc';
	import { eras } from './timeCalc';

	// today
	const DEFAULT_DATE = new Date().toJSON().slice(0, 10);

	const LOCALSTORAGE_DATA_KEY = 'timeCalcDateModeData';

	let firstDate: string;
	let firstDateEra: IEra;

	let secondDate: string;
	let secondDateEra: IEra;

	let result: string;
	let resultString: string;

	locale.subscribe(() => {
		for (const era of $eras) {
			era.name = $_(`timecalc.date_mode.${era.id}`);
		}
		$eras = $eras;
	});

	onMount(() => {
		const selectedDates: ISelectedDateModeData = JSON.parse(
			localStorage.getItem(LOCALSTORAGE_DATA_KEY) ?? '{}'
		);

		const checkDates = /^\d\d\d\d-\d\d-\d\d$/;

		if (
			checkDates.exec(selectedDates.first?.date) &&
			checkDates.exec(selectedDates.second?.date)
		) {
			firstDate = selectedDates.first.date;
			firstDateEra = selectedDates.first.isBce ? $eras[0] : $eras[1];

			secondDate = selectedDates.second.date;
			secondDateEra = selectedDates.second.isBce ? $eras[0] : $eras[1];
		} else {
			resetSelectedDates();
		}
	});

	$: if (!firstDate || !secondDate) {
		resultString = $_('timecalc.date_mode.date_not_selected');
	} else {
		const firstSelectedDate: IDate = parseDate(firstDate, firstDateEra);
		const secondSelectedDate: IDate = parseDate(secondDate, secondDateEra);

		const firstYear = firstSelectedDate.era.isBce
			? -firstSelectedDate.year
			: firstSelectedDate.year;
		const secondYear = secondSelectedDate.era.isBce
			? -secondSelectedDate.year
			: secondSelectedDate.year;

		let differenceInYears = secondYear - firstYear;
		let differenceInMonths = secondSelectedDate.month - firstSelectedDate.month;
		let differenceInDays = secondSelectedDate.day - firstSelectedDate.day;

		if (firstSelectedDate.era.isBce && !secondSelectedDate.era.isBce) {
			differenceInYears--;
		}

		if (firstSelectedDate.day > secondSelectedDate.day) {
			differenceInMonths--;
		}

		if (firstSelectedDate.month > secondSelectedDate.month) {
			differenceInYears--;
		}

		if (
			firstSelectedDate.month === secondSelectedDate.month &&
			firstSelectedDate.day > secondSelectedDate.day
		) {
			differenceInYears--;
		}

		differenceInMonths = differenceInMonths < 0 ? 12 + differenceInMonths : differenceInMonths;

		const dateWithSecondDatePreviousMonthLastDay = new Date(
			secondSelectedDate.year,
			secondSelectedDate.month - 1,
			0
		);

		const lastDayOfPreviousSecondDateMonth = dateWithSecondDatePreviousMonthLastDay.getDate();

		differenceInDays =
			differenceInDays < 0
				? lastDayOfPreviousSecondDateMonth + differenceInDays
				: differenceInDays;

		const yearWords: string[] = [
			$_('timecalc.date_mode.year_word_1'),
			$_('timecalc.date_mode.year_word_2'),
			$_('timecalc.date_mode.year_word_3')
		];
		const monthWords: string[] = [
			$_('timecalc.date_mode.month_word_1'),
			$_('timecalc.date_mode.month_word_2'),
			$_('timecalc.date_mode.month_word_3')
		];
		const dayWords: string[] = [
			$_('timecalc.date_mode.day_word_1'),
			$_('timecalc.date_mode.day_word_2'),
			$_('timecalc.date_mode.day_word_3')
		];

		const yearWord: string = selectWordForNumber(differenceInYears, yearWords, $locale ?? 'en');
		const monthWord: string = selectWordForNumber(
			differenceInMonths,
			monthWords,
			$locale ?? 'en'
		);
		const dayWord: string = selectWordForNumber(differenceInDays, dayWords, $locale ?? 'en');

		result = `${differenceInYears === 0 ? '' : `${differenceInYears} ${yearWord}, `}${
			differenceInMonths === 0 ? '' : `${differenceInMonths} ${monthWord}, `
		}${differenceInDays === 0 ? '' : `${differenceInDays} ${dayWord}`}`;

		result = result.endsWith(', ') ? result.slice(0, -2) : result;
		result = $locale === 'ar' ? result.replaceAll(' 2 ', ' ') : result;
		result = result === '' ? '0' : result;

		resultString = `${$_('result')}: ${replaceNumbersDependsLocale(result)}`;

		saveData<ISelectedDateModeData>(LOCALSTORAGE_DATA_KEY, {
			first: { date: firstDate, isBce: firstDateEra.isBce },
			second: { date: secondDate, isBce: secondDateEra.isBce }
		});
	}

	function parseDate(date: string, era: IEra) {
		const parts = date.split('-').map(Number);
		return <IDate>{ year: parts[0], month: parts[1], day: parts[2], era };
	}

	function resetSelectedDates() {
		firstDate = secondDate = DEFAULT_DATE;
		firstDateEra = secondDateEra = $eras[1];
	}
</script>

<div class="mx-auto text-end">
	<TimeInput text={$_('timecalc.from_time')} bind:value={firstDate} isDateMode={true}>
		<Select bind:value={firstDateEra}>
			{#each $eras as era}
				<option value={era}>{era.name}</option>
			{/each}
		</Select>
	</TimeInput>

	<TimeInput text={$_('timecalc.to_time')} bind:value={secondDate} isDateMode={true}>
		<Select bind:value={secondDateEra}>
			{#each $eras as era}
				<option value={era}>{era.name}</option>
			{/each}
		</Select>
	</TimeInput>
</div>

<h2>{resultString}</h2>
<ResetButton resetFunction={resetSelectedDates} />
