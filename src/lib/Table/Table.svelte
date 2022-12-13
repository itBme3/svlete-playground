<script>
	import { createEventDispatcher } from 'svelte';
	import Head from './Head.svelte';
	import Row from './Row.svelte';
	export let rows = [];
	export let columns;
	export let showHeader = true;
	export let showNested = (row) => false;
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
			{#if $$slots.cell}
				<Row
					on:toggleNested
					showNested={showNested(row)}
					on:click={() => dispatch('rowClick', row)}
					{row}
					{columns}
					{id}
				>
					<svelte:fragment slot="cell" let:col>
						<slot name="cell" {row} {rowIndex} {id} {col} />
					</svelte:fragment>

					<svelte:fragment slot="nested">
						<slot name="nested" {row} {rowIndex} {id} {columns} />
					</svelte:fragment>
				</Row>
			{:else}
				<Row
					on:toggleNested
					showNested={showNested(row)}
					on:click={() => dispatch('rowClick', row)}
					{row}
					{columns}
					{id}
				/>
			{/if}
		{/each}
	</tbody>
</table>
