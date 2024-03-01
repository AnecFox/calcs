<script lang="ts">
	import { calculators } from '$lib/calculators';
	import CalculatorItem from './CalculatorItem.svelte';
</script>

<div class="flex justify-center">
	<div class="list grid grid-cols-2 gap-5">
		{#each $calculators as calculator}
			<CalculatorItem {...calculator} />
		{/each}
	</div>
</div>

<style>
	@media (max-width: 650px) {
		.list {
			grid-template-columns: 1fr;
		}
	}
</style>
