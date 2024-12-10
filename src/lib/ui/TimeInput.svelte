<script lang="ts">
	export let text = '';
	export let value = '';
	export let isDateMode = false;

	const handleInput = ({ target }: Event) => (value = (target as HTMLInputElement).value);
</script>

<div class="time-input mb-5">
	<label
		>{text}
		{#if isDateMode}
			<input {value} class="control" type="date" on:input={handleInput} />
		{:else}
			<input {value} class="control" type="time" on:input={handleInput} />
		{/if}
	</label>
	<slot />
</div>

<style lang="postcss">
	label {
		margin: 0.5rem;
		font-size: 1.2rem;
	}

	input {
		font-size: 1.3rem;
		width: min-content;
		margin-inline-start: 2.4vw;
	}

	input[type='time']::-webkit-calendar-picker-indicator {
		display: none;
	}

	@media (max-width: 344px) {
		.time-input {
			@apply flex flex-col justify-center items-center;
		}
	}
</style>
