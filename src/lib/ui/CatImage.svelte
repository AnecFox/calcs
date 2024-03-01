<script>
	import { _ } from 'svelte-i18n';
	import { base } from '$app/paths';
</script>

<img alt={$_('cat_alt_text')} class="meow" src="{base}/images/cat.jpg" />

<style>
	.meow {
		width: 80vw;
		margin: 0 auto;
		border-radius: 30px;
	}
</style>
