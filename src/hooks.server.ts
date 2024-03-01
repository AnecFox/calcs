import type { Handle } from '@sveltejs/kit';
import { setupI18n } from '$lib/locale/i18n';

export const handle: Handle = async ({ event, resolve }) => {
	await setupI18n({});
	return resolve(event);
};
