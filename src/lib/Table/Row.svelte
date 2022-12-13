<script>
	import { onMount, tick } from 'svelte';
	import Cell from './Cell.svelte';
	export let row;
	export let columns;
	export let id;
	export let on = true;
	let defaultSlot;
	let slotIsEmpty = false;
	let mounted = false;

	const handleEmptySlot = () => {
		tick().then(() => {
			slotIsEmpty = !defaultSlot?.innerHTML?.trim()?.length;
		});
	};

	$: if (mounted) {
		slotIsEmpty = true;
		handleEmptySlot();
	}

	onMount(() => {
		mounted = true;
	});
</script>

{#if on}
	<tr on:click bind:this={defaultSlot}>
		{#each columns as col}
			<slot name="cell" {row} {id} {col} key={col.key}>
				<Cell {row} {col} key={col.key} />
			</slot>
		{/each}
	</tr>
{/if}
