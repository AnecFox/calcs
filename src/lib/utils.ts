import { browser } from '$app/environment';

export interface IBase {
	id: string;
	name?: string;
}

export function getElementOfCollectionById(id: string, collection: IBase[]): IBase {
	return <IBase>collection.find((unit) => unit?.id === id) ?? {};
}

export function saveData<T>(key: string, data: T): void {
	if (!data || !browser) return;

	localStorage.setItem(key, JSON.stringify(data));
}
