<script lang="ts">
	import type { IBase } from '$lib/utils';

	export let value: IBase;
	export let width = 'min-content';
	export let styles = '';
</script>

<select bind:value class="control" style="width: {width}; {styles}">
	<slot />
</select>

<style>
	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		margin: 0.5rem;
		height: 2.4rem;
		font-size: 1.05rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
