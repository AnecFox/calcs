<script lang="ts">
	import { browser } from '$app/environment';
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import HeaderButtons from './HeaderButtons.svelte';
	import { calculators } from '$lib/calculators';
	import { base } from '$app/paths';

	library.add(faBars, faXmark);

	let isMenuActive = false;

	onMount(() => {
		if (browser) {
			document.addEventListener('click', handleClick);
		}
	});

	function handleClick(event: MouseEvent) {
		const menu = document.querySelector('.menu-button');
		const isClickToMenuButton = menu?.contains(event.target as Node) as boolean;

		if (!isClickToMenuButton) isMenuActive = false;
	}

	const toggleNav = () => (isMenuActive = !isMenuActive);

	$: {
		for (const calculator of $calculators) {
			calculator.name = $_(`${calculator.localeKey}.name`);
		}
		$calculators = $calculators;
	}
</script>

<header class="relative px-4 pt-0 pb-0 mt-4 mb-16">
	<nav
		class="justify-between items-center overflow-sr-only start-0 rounded-lg"
		class:active={isMenuActive}
	>
		<span class="close-menu w-full hidden justify-end">
			<button
				aria-label={$_('header.navbar.close_menu')}
				class="close-menu"
				on:click={() => (isMenuActive = false)}
			>
				<FontAwesomeIcon icon={faXmark} size="xl" />
			</button>
		</span>

		<ul class="nav-list list-none flex justify-start items-center">
			<li><a class="item" href="{base}/">{$_('header.navbar.homepage')}</a></li>
			{#each $calculators as calculator}
				<li class="item">
					<a href="{base}/{calculator.url}" class="item__content flex items-center">
						<img class="w-8 h-8 me-2" src="{base}/{calculator.icon}" alt="" />
						{calculator.name}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<div class="flex items-center justify-end ms-auto">
		<HeaderButtons />

		<div class="menu hidden">
			<button
				aria-label={$_('header.navbar.menu')}
				class="menu-button w-5 h-5 ms-1 text-lg"
				on:click={toggleNav}
			>
				<FontAwesomeIcon icon={faBars} size="xl" />
			</button>
		</div>
	</div>
</header>

<style lang="postcss">
	header {
		margin-left: 2vw;
		margin-right: 2vw;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.item {
		transition: background-color 0.16s ease-out;
	}

	.menu-button {
		border-style: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	a {
		text-decoration: none;
	}

	@media only screen and (pointer: fine) {
		.item {
			@apply hover:bg-light-element dark:hover:bg-dark-element rounded-xl;
		}
	}

	@media (min-width: 925px) {
		nav {
			white-space: nowrap;
			width: 84%;
		}

		.nav-list {
			overflow: auto;
			align-items: center;
		}

		.item {
			margin-inline-end: 1rem;
			padding: 0.5rem;
			flex-shrink: 0;
		}
	}

	@media (max-width: 924px) {
		nav {
			max-height: 45dvh;
			margin-top: 20rem;
			opacity: 0;
			overflow: auto;
			visibility: hidden;
			position: absolute;
			transition: all 0.14s ease-out;
			width: 100%;
			@apply flex-col items-start rounded-lg text-base p-6 bg-white dark:bg-dark-element;
		}

		nav.active {
			-webkit-box-shadow: 0 8px 13px 6px rgba(34, 60, 80, 0.2);
			-moz-box-shadow: 0 8px 13px 6px rgba(34, 60, 80, 0.2);
			box-shadow: 0 8px 13px 6px rgba(34, 60, 80, 0.2);
			opacity: 1;
			visibility: visible;
		}

		.nav-list {
			flex-direction: column;
			overflow: hidden;
		}

		.item {
			width: 50vw;
			font-size: 1rem;
			margin-top: 1.2vh;
		}

		.item__content {
			@apply mb-1;
		}

		.menu {
			display: flex;
		}

		.close-menu {
			display: flex;
		}
	}
</style>
