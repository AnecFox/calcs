<script lang="ts">
	import { _ } from 'svelte-i18n';

	export let value = '0';
	export let width = '15';

	const handleInput = ({ target }: Event) => (value = (target as HTMLInputElement).value);
</script>

<label>
	<input
		type="text"
		inputmode="decimal"
		{value}
		placeholder={$_('number_word')}
		style="width: min(85vw, {width}rem)"
		on:input={handleInput}
	/>
</label> 

<style lang="postcss">
	input {
		border-radius: 0.5rem;
		text-align: center;
		font-size: 1.2rem;
		direction: ltr;
		@apply border-solid border-2 border-gray-500 dark:border-dark-element dark:bg-[#1d1d1d];
	}
</style>
