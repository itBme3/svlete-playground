<script>
	import { Icons } from '@madhive/wingsuit';
	import { onMount, tick, createEventDispatcher } from 'svelte';
	import Cell from './Cell.svelte';
	export let row;
	export let columns;
	export let id;
	export let showNested = false;
	export let nestedInheritColumns = true;
	export let reactTo = undefined;
	export let nested = false;

	/** binding to html element */
	let nestedSlot;
	/** used for checking if default slot is empty */
	let nestedSlotIsEmpty = true;
	/** needed for reactively checking if nestedSlot is empty */
	let mounted = false;

	const handleEmptyCell = () => {
		tick().then(() => {
			nestedSlotIsEmpty = !nestedSlot?.innerHTML?.trim()?.length;
		});
	};

	$: if (mounted) {
		reactTo;
		nestedSlotIsEmpty = false;
		handleEmptyCell();
	}

	const dispatch = createEventDispatcher();

	onMount(() => {
		mounted = true;
	});
</script>

<tr class:nested-row={nested} on:click={() => dispatch('rowClick', row)}>
	<td class="nested-toggle" width="10">
		{#if !nestedSlotIsEmpty}
			<button on:click={() => dispatch('toggleNested', row)}>
				<Icons.Chevron direction={showNested ? 'up' : 'down'} />
			</button>
		{/if}
	</td>
	{#each columns as col}
		<slot name="cell" {row} {id} {col}>
			<Cell {row} {col} />
		</slot>
	{/each}
</tr>

{#if $$slots.nested}
	{#if nestedInheritColumns && showNested}
		<span class="nested" class:hidden={!showNested} aria-hidden={!showNested}>
			<slot name="nested" />
		</span>
	{:else}
		<tr class:hidden={!showNested} aria-hidden={!showNested}>
			<td class="nested" colspan={9999999} bind:this={nestedSlot}>
				<slot name="nested" />
			</td>
		</tr>
	{/if}
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
	.nested {
		display: contents;
	}
</style>
