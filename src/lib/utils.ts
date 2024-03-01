import { browser } from '$app/environment';
import { locale } from '$lib/locale/i18n';
import { get } from 'svelte/store';

export interface IBase {
	id: string;
	name?: string;
}

export function getElementOfCollectionById(id: string, collection: IBase[]): IBase {
	return <IBase>collection.find((unit) => unit?.id === id) ?? {};
}

export function selectWordForNumber(number: number, words: string[], isRussian: boolean): string {
	if (!isRussian) return number === 1 ? words[0] : words[1];

	const numberSymbols: string = number.toString();
	const lastNumberSymbol: number = parseInt(numberSymbols[numberSymbols.length - 1]);

	if (number.toString().endsWith('1') && !number.toString().endsWith('11')) {
		return words[0];
	} else if (lastNumberSymbol <= 4 && lastNumberSymbol >= 2 && !(number > 11 && number < 15)) {
		return words[1];
	} else {
		return words[2];
	}
}

export function getNumber(num: number | string): string {
	if (get(locale) === 'ar') {
		return convertRegularToArabicNumbers(String(num));
	} else {
		return convertArabicToRegularNumbers(String(num));
	}
}

export function convertRegularToArabicNumbers(value: string): string {
	const arabicNumbers = '٠١٢٣٤٥٦٧٨٩،';
	return String(value).replace(/[0123456789,]/g, (d) => arabicNumbers[+d]);
}

export function convertArabicToRegularNumbers(value: string): string {
	return String(value)
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

export function saveData<T>(key: string, data: T): void {
	if (!data || !browser) return;

	localStorage.setItem(key, JSON.stringify(data));
}
