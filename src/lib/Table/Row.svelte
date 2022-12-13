<script>
	import { IconButton, Icons } from '@madhive/wingsuit';
	import { onMount, tick, createEventDispatcher } from 'svelte';
	import Cell from './Cell.svelte';
	export let row;
	export let columns;
	export let id;
	export let showNested = false;
	export let reactTo = undefined;

	/** binding to html element */
	let nestedSlot;
	/** used for checking if default slot is empty */
	let slotIsEmpty = true;
	/** needed for reactively checking if nestedSlot is empty */
	let mounted = false;

	const handleEmptyCell = () => {
		tick().then(() => {
			slotIsEmpty = !nestedSlot?.innerHTML?.trim()?.length;
		});
	};

	$: if (mounted) {
		reactTo;
		slotIsEmpty = false;
		handleEmptyCell();
	}

	const dispatch = createEventDispatcher();

	onMount(() => {
		mounted = true;
	});
</script>

<tr>
	<td class="nested-toggle" width="10">
		{#if !slotIsEmpty}
			<button on:click={() => dispatch('toggleNested', row)}
				><Icons.Chevron direction={showNested ? 'up' : 'down'} /></button
			>
		{/if}
	</td>
	{#each columns as col}
		<slot name="cell" {row} {id} {col} key={col.key}>
			<Cell {row} {col} key={col.key} />
		</slot>
	{/each}
</tr>

{#if $$slots.nested}
	<tr class:hidden={!showNested} aria-hidden={!showNested}>
		<td class="nested" colspan={9999999} bind:this={nestedSlot}>
			<slot name="nested" />
		</td>
	</tr>
{/if}

<style>
	button {
		all: unset;
		cursor: pointer;
		width: 1.25rem;
		margin: auto;
		height: 1.25rem;
		padding: 0.5rem 0;
	}
</style>
