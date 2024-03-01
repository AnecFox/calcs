<script>
	import CatImage from '$lib/ui/CatImage.svelte';
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('meow')}</title>
</svelte:head>

<main>
	<h1>{$_('meow')}</h1>
	<CatImage />
</main>
