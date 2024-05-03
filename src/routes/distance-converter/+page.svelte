<script lang="ts">
	import { _, locale } from '$lib/locale/i18n';
	import NumberInput from '$lib/ui/NumberInput.svelte';
	import ResetButton from '$lib/ui/ResetButton.svelte';
	import { convertArabicToRegularNumbers, getNumber } from '$lib/locale/lang-utils';
	import { getElementOfCollectionById, saveData } from '$lib/utils';
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faRotate } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import type { IDistanceUnit } from './distances';
	import { distanceUnits } from './distances';
	import Select from '$lib/ui/Select.svelte';

	library.add(faRotate);

	interface ISelectedData {
		value: number;
		fromUnit: string;
		toUnit: string;
	}

	const LOCALSTORAGE_DATA_KEY = 'distanceConverterData';

	let value: string;

	let fromUnit: IDistanceUnit;
	let toUnit: IDistanceUnit;

	let result: number;
	let resultString: string;

	let isSavedDataLoaded = false;

	locale.subscribe(() => {
		for (const unit of $distanceUnits) {
			unit.name = $_(`distance_converter.${unit.id}`);
		}
		$distanceUnits = $distanceUnits;

		value = getNumber(value);
	});

	onMount(() => {
		const savedData: ISelectedData = JSON.parse(
			localStorage.getItem(LOCALSTORAGE_DATA_KEY) ?? '{}'
		);

		if (savedData.value && savedData.fromUnit && savedData.toUnit) {
			value = getNumber(savedData.value);
			fromUnit = <IDistanceUnit>(
				getElementOfCollectionById(savedData.fromUnit, $distanceUnits)
			);
			toUnit = <IDistanceUnit>getElementOfCollectionById(savedData.toUnit, $distanceUnits);
		} else {
			resetSelectedValues();
		}
		isSavedDataLoaded = true;
	});

	$: if (isSavedDataLoaded) {
		let resultValue: number = +convertArabicToRegularNumbers(value).replace(',', '.');

		if (!isNaN(+resultValue)) {
			resultValue *= fromUnit?.inCM;
			resultValue /= toUnit?.inCM;

			result = +resultValue?.toFixed(5);
			resultString = `${$_('result')}: ${getNumber(result)}`;

			saveData(LOCALSTORAGE_DATA_KEY, {
				value: +convertArabicToRegularNumbers(value).replace(',', '.'),
				fromCurrency: fromUnit.id,
				toCurrency: toUnit.id
			});
		} else {
			resultString = $_('message_about_entering_numbers');
		}
	}

	function resetSelectedValues() {
		value = getNumber(1);
		fromUnit = <IDistanceUnit>getElementOfCollectionById('m', $distanceUnits);
		toUnit = <IDistanceUnit>getElementOfCollectionById('cm', $distanceUnits);
	}

	const reverseSelectedUnits = () => ([fromUnit, toUnit] = [toUnit, fromUnit]);
</script>

<main class="wrapper flex flex-col justify-center items-center">
	<h1 class="text-[#bb6262] dark:text-[#f0a2a4]">Distance<wbr />Converter</h1>

	<NumberInput bind:value />

	<div>
		<Select bind:value={fromUnit} width="min(50vw, 15rem)">
			{#each $distanceUnits as unit}
				<option value={unit}>{unit.name}</option>
			{/each}
		</Select>
	</div>

	<div class="select-container flex justify-center items-center">
		<Select bind:value={toUnit} width="min(50vw, 15rem)" styles="margin-inline-start: 3rem">
			{#each $distanceUnits as unit}
				<option value={unit}>{unit.name}</option>
			{/each}
		</Select>

		<button
			class="reverse-units bg-light-element dark:bg-dark-element rounded-lg p-2"
			aria-label={$_('distance_converter.reverse_selected_units')}
			on:click={reverseSelectedUnits}
		>
			<FontAwesomeIcon icon={faRotate} size="xl" />
		</button>
	</div>

	<h2>{resultString}</h2>
	<ResetButton resetFunction={resetSelectedValues} />
</main>
