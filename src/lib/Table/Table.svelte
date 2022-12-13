<script>
	import { createEventDispatcher } from 'svelte';
	import Head from './Head.svelte';
	import Row from './Row.svelte';
	export let rows = [];
	export let columns;
	export let showHeader = true;
	export let getId = (row) => row?.id;
	const dispatch = createEventDispatcher();
</script>

<table style="position: relative;">
	{#if showHeader}
		<Head {columns} />
	{/if}
	<tbody>
		{#each rows as row, rowIndex}
			{@const id = getId(row)}
			{#if $$slots.row}
				<slot name="row" {row} {rowIndex} {id} />
			{:else}
				<Row on:toggleNested on:click={() => dispatch('rowClick', row)} {row} {columns} {id} />
			{/if}
		{/each}
	</tbody>
</table>
