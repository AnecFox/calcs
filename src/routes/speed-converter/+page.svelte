<script lang="ts">
	import NumberInput from '$lib/ui/NumberInput.svelte';
	import ResetButton from '$lib/ui/ResetButton.svelte';
	import Select from '$lib/ui/Select.svelte';
	import {
		convertArabicToRegularNumbers,
		getElementOfCollectionById,
		getNumber,
		saveData
	} from '$lib/utils';
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faRotate } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import type { IDistanceUnit } from '../distance-converter/distances';
	import type { ITime } from './speeds';
	import { distances, times } from './speeds';
	import { _, locale } from '$lib/locale/i18n';

	library.add(faRotate);

	interface ISelectedData {
		value: number;
		from: {
			unit: string;
			time: string;
		};
		to: {
			unit: string;
			time: string;
		};
	}

	const LOCALSTORAGE_DATA_KEY = 'speedConverterData';

	let value: string;

	let result: number;
	let resultString: string;

	let fromUnit: IDistanceUnit;
	let fromTime: ITime;

	let toUnit: IDistanceUnit;
	let toTime: ITime;

	let isSavedDataLoaded = false;

	locale.subscribe(() => {
		for (const unit of $distances) {
			unit.name = $_(`speed_converter.distance_units.${unit.id}`);
		}
		$distances = $distances;

		for (const unit of $times) {
			unit.name = $_(`speed_converter.${unit.id}`);
		}
		$times = $times;

		value = getNumber(value);
	});

	onMount(() => {
		const savedData: ISelectedData = JSON.parse(
			localStorage.getItem(LOCALSTORAGE_DATA_KEY) ?? '{}'
		);

		if (
			savedData.value &&
			savedData.from.unit &&
			savedData.from.time &&
			savedData.to.unit &&
			savedData.to.time
		) {
			value = getNumber(savedData.value);

			fromUnit = <IDistanceUnit>getElementOfCollectionById(savedData.from.unit, $distances);
			fromTime = <ITime>getElementOfCollectionById(savedData.from.time, $times);

			toUnit = <IDistanceUnit>getElementOfCollectionById(savedData.to.unit, $distances);
			toTime = <ITime>getElementOfCollectionById(savedData.to.time, $times);
		} else {
			reset();
		}
		isSavedDataLoaded = true;
	});

	$: if (isSavedDataLoaded) {
		const adaptedValue = +convertArabicToRegularNumbers(value).replace(',', '.');

		let resultValue =
			((adaptedValue * (fromUnit?.inCM / 100)) / fromTime?.inSeconds / (toUnit?.inCM / 100)) *
			toTime?.inSeconds;

		if (!isNaN(resultValue)) {
			result = +resultValue.toFixed(10);
			resultString = `${$_('result')}: ${getNumber(result)}`;

			saveData(LOCALSTORAGE_DATA_KEY, {
				value: +convertArabicToRegularNumbers(value).replace(',', '.'),
				from: {
					unit: fromUnit.id,
					time: fromTime.id
				},
				to: {
					unit: toUnit.id,
					time: toTime.id
				}
			});
		} else {
			resultString = $_('message_about_entering_numbers');
		}
	}

	function reverseSelected() {
		[fromUnit, toUnit] = [toUnit, fromUnit];
		[fromTime, toTime] = [toTime, fromTime];
	}

	function reset() {
		value = getNumber(1);

		fromUnit = <IDistanceUnit>getElementOfCollectionById('m', $distances);
		fromTime = <ITime>getElementOfCollectionById('s', $times);

		toUnit = <IDistanceUnit>getElementOfCollectionById('km', $distances);
		toTime = <ITime>getElementOfCollectionById('h', $times);
	}
</script>

<main class="wrapper flex flex-col justify-center items-center">
	<h1 class="text-[#35a15f] dark:text-[#67d391]">Speed<wbr />Converter</h1>
	<NumberInput bind:value width="12rem" />

	<div class="flex items-center">
		<Select bind:value={fromUnit}>
			{#each $distances as unit}
				<option value={unit}>{unit.name}</option>
			{/each}
		</Select>
		<p>/</p>
		<Select bind:value={fromTime}>
			{#each $times as unit}
				<option value={unit}>{unit.name}</option>
			{/each}
		</Select>
	</div>

	<div class="ms-10 flex items-center">
		<Select bind:value={toUnit}>
			{#each $distances as unit}
				<option value={unit}>{unit.name}</option>
			{/each}
		</Select>
		<p>/</p>
		<Select bind:value={toTime}>
			{#each $times as unit}
				<option value={unit}>{unit.name}</option>
			{/each}
		</Select>

		<button
			class="bg-light-element dark:bg-dark-element rounded-lg p-2"
			aria-label={$_('speed_converter.reverse_selected_values')}
			on:click={reverseSelected}
		>
			<FontAwesomeIcon icon={faRotate} size="xl" />
		</button>
	</div>

	<h2>{resultString}</h2>
	<ResetButton resetFunction={reset} />
</main>
