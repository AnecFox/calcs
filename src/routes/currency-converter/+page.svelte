<script lang="ts">
	import { _, locale } from '$lib/locale/i18n';
	import CatImage from '$lib/ui/CatImage.svelte';
	import NumberInput from '$lib/ui/NumberInput.svelte';
	import ResetButton from '$lib/ui/ResetButton.svelte';
	import { convertArabicToRegularNumbers, getNumber, saveData } from '$lib/utils';
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faRotate, faSpinner } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import ky from 'ky';
	import { onMount } from 'svelte';
	import type { ICurrency } from './currencies';
	import { currencies } from './currencies';
	import Select from '$lib/ui/Select.svelte';

	library.add(faRotate, faSpinner);

	interface IResponseContent {
		result: string;
		provider: string;
		documentation: string;
		terms_of_use: string;
		time_last_update_unix: number;
		time_last_update_utc: string;
		time_next_update_unix: number;
		time_next_update_utc: string;
		time_eol_unix: number;
		base_code: string;
		rates: { [key: string]: number };
	}

	interface ISelectedData {
		value: number;
		fromCurrency: string;
		toCurrency: string;
	}

	const LOCALSTORAGE_DATA_KEY = 'currencyConverterData';

	let value: string;

	let fromCurrency: ICurrency;
	let toCurrency: ICurrency;

	let resultString: string;
	let result: number;

	let isLoadingEnded = false;
	let isGettingCurrenciesHappened = true;
	let isSavedDataLoaded = false;

	locale.subscribe(() => {
		for (const currency of $currencies) {
			currency.name = $_(`currency_converter.currencies.${currency.id.toLowerCase()}`);
		}

		$currencies.sort((a, b) => (a.name as string).localeCompare(b.name as string));

		$currencies = $currencies;
		fromCurrency = fromCurrency;
		toCurrency = toCurrency;

		value = getNumber(value);
	});

	onMount(async () => {
		try {
			const response = await ky
				.get('https://open.er-api.com/v6/latest/USD')
				.json<IResponseContent>();

			for (const currency of $currencies) {
				currency.value = response.rates[currency.id];
			}
		} catch (error) {
			console.error(error);
			isGettingCurrenciesHappened = false;
		}
		isLoadingEnded = true;

		const savedData: ISelectedData = JSON.parse(
			localStorage.getItem(LOCALSTORAGE_DATA_KEY) ?? '{}'
		);

		if (savedData.value && savedData.fromCurrency && savedData.toCurrency) {
			value = getNumber(savedData.value);
			fromCurrency = getCurrencyByCharCode(savedData.fromCurrency);
			toCurrency = getCurrencyByCharCode(savedData.toCurrency);
		} else {
			resetSelectedValues();
		}
		isSavedDataLoaded = true;
	});

	function resetSelectedValues() {
		value = getNumber(1);
		fromCurrency = getCurrencyByCharCode('EUR');
		toCurrency = getCurrencyByCharCode('USD');
	}

	function getCurrencyByCharCode(charCode: string): ICurrency {
		return <ICurrency>$currencies.find((currency) => currency.id === charCode) ?? {};
	}

	$: if (isSavedDataLoaded) {
		let resultValue: number = +convertArabicToRegularNumbers(value).replace(',', '.');

		if (!isNaN(+resultValue)) {
			resultValue /= fromCurrency?.value ?? 0;
			resultValue *= toCurrency?.value ?? 0;

			result = +resultValue?.toFixed(5);
			resultString = `${$_('result')}: ${getNumber(result)}`;

			saveData(LOCALSTORAGE_DATA_KEY, {
				value: +convertArabicToRegularNumbers(value).replace(',', '.'),
				fromCurrency: fromCurrency.id,
				toCurrency: toCurrency.id
			});
		} else {
			resultString = $_('message_about_entering_numbers');
		}
	}

	const reverseSelectedCurrencies = () =>
		([fromCurrency, toCurrency] = [toCurrency, fromCurrency]);
</script>

<main class="wrapper flex flex-col justify-center items-center">
	<h1 class="text-[#c19031] dark:text-[#eaca72]">Currency<wbr />Converter</h1>

	{#if isLoadingEnded}
		{#if isGettingCurrenciesHappened}
			<NumberInput bind:value />

			<div>
				<Select bind:value={fromCurrency} width="min(50vw, 15rem)">
					{#each $currencies as currency}
						<option value={currency}>{currency.name} ({currency.id})</option>
					{/each}
				</Select>
			</div>

			<div>
				<Select
					bind:value={toCurrency}
					width="min(50vw, 15rem)"
					styles="margin-inline-start: 3rem"
				>
					{#each $currencies as currency}
						<option value={currency}>{currency.name} ({currency.id})</option>
					{/each}
				</Select>

				<button
					class="reverse-currencies bg-light-element dark:bg-dark-element rounded-lg p-2"
					aria-label={$_('currency_converter.reverse_selected_currencies')}
					on:click={reverseSelectedCurrencies}
				>
					<FontAwesomeIcon icon={faRotate} size="xl" />
				</button>
			</div>
			<h2>{resultString}</h2>

			<ResetButton resetFunction={resetSelectedValues} />
		{:else}
			<h2>{$_('currency_converter.currencies_loading_failed_heading')}</h2>
			<p class="text-lg mb-2">{$_('currency_converter.currencies_loading_failed_message')}</p>
			<CatImage />
		{/if}
	{:else}
		<h2>{$_('loading')}</h2>
		<FontAwesomeIcon icon={faSpinner} spinPulse class="w-10 h-10" />
	{/if}
</main>
