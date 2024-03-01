<script>
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	import CatImage from '$lib/ui/CatImage.svelte';
</script>

<main>
	<h1>Error {$page.status}: {$page.error?.message}</h1>
	{#if $page.status === 404}
		<h2>{$_('not_found_error_message')}</h2>
	{:else if $page.status === 500}
		<h2>{$_('server_error_message')}</h2>
	{/if}
	<CatImage />
</main>
