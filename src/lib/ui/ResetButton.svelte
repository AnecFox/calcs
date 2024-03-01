<script lang="ts">
	import { _ } from 'svelte-i18n';

	let isScale = false;

	export let resetFunction: () => void;

	function handleClick() {
		resetFunction();

		isScale = true;
		setTimeout(() => {
			isScale = false;
		}, 300);
	}
</script>

<button
	class="control reset-button absolute my-2 mx-auto"
	on:click={handleClick}
	class:scale={isScale}
>
	{$_('reset_button')}
</button>

<style>
	.reset-button {
		bottom: 4vh;
		left: 50%;
		width: fit-content;
		transform: translate(-50%, 50%);
		transition: transform 0.2s ease;
	}

	.reset-button.scale {
		transform: translate(-50%, 50%) scale(150%) translateY(-0.4rem);
	}

	@media (max-height: 475px) {
		.reset-button {
			margin: 0.1rem;
			position: unset;
			bottom: unset;
			transform: unset;
		}

		.reset-button.scale {
			transform: scale(150%) translateY(-0.4rem);
		}
	}
</style>
