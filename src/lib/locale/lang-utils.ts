import { locale } from '$lib/locale/i18n';
import { get } from 'svelte/store';

export function selectWordForNumber(
	number: number,
	words: string[],
	selectedLanguage: string
): string {
	if (selectedLanguage === 'ru') {
		const numberSymbols: string = number.toString();
		const lastNumberSymbol: number = parseInt(numberSymbols[numberSymbols.length - 1]);

		if (number.toString().endsWith('1') && !number.toString().endsWith('11')) {
			return words[0];
		} else if (
			lastNumberSymbol <= 4 &&
			lastNumberSymbol >= 2 &&
			!(number > 11 && number < 15)
		) {
			return words[1];
		} else {
			return words[2];
		}
	} else if (selectedLanguage === 'ar') {
		if (number === 2) {
			return words[1];
		} else if (number >= 3 && number <= 10) {
			return words[2];
		} else {
			return words[0];
		}
	} else {
		return number === 1 ? words[0] : words[1];
	}
}

export function replaceNumbersDependsLocale(numberOrStringWithNumbers: number | string): string {
	if (get(locale) === 'ar') {
		return convertRegularToArabicNumbers(String(numberOrStringWithNumbers));
	} else {
		return convertArabicToRegularNumbers(String(numberOrStringWithNumbers));
	}
}

function convertRegularToArabicNumbers(value: string): string {
	const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
	return value.replace(/[0123456789]/g, (number) => arabicNumbers[+number]).replaceAll(',', '،');
}

export function convertArabicToRegularNumbers(value: string): string {
	return value
		.replace(/٠/g, '0')
		.replace(/١/g, '1')
		.replace(/٢/g, '2')
		.replace(/٣/g, '3')
		.replace(/٤/g, '4')
		.replace(/٥/g, '5')
		.replace(/٦/g, '6')
		.replace(/٧/g, '7')
		.replace(/٨/g, '8')
		.replace(/٩/g, '9')
		.replace(/،/g, ',');
}
