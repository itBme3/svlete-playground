<script>
	import { createEventDispatcher } from 'svelte';
	import Head from './Head.svelte';
	import NestedRows from './NestedRows.svelte';
	import Row from './Row.svelte';
	export let rows = [];
	export let columns;
	export let nestedConfig = {};
	export let getId = (row) => row?.id;
	const dispatch = createEventDispatcher();

	$: nested = {
		rows: (row) => [],
		show: (row) => false,
		columns: columns,
		getId: (row) => getId(row),
		header: false,
		...nestedConfig
	};
</script>

<table style="position: relative;">
	<Head {columns} />
	<tbody>
		{#each rows as row, rowIndex}
			{@const id = getId(row)}
			{@const nestedRows = nested.rows(row)}
			{#if nestedRows?.length}<span style="position: absolute; left: -10px;">></span>{/if}
			{#if $$slots.row}
				<slot name="row" {row} {rowIndex} {id} />
			{:else}
				<Row on:click={() => dispatch('rowClick', row)} {row} {columns} {id} />
			{/if}
			{#if nestedRows?.length}
				<NestedRows show={nested.show(row)} columns={nestedConfig.columns} header={nested.header}>
					{#each nestedRows as nestedRow, nestedIndex}
						{@const nestedId = getId(nestedRow)}
						<slot
							name="nested"
							{row}
							{id}
							{rowIndex}
							{nestedRow}
							{nestedId}
							{nestedIndex}
							nestedColumns={nested.columns}
						>
							<Row columns={nested.columns} id={nestedId} row={nestedRow} />
						</slot>
					{/each}
				</NestedRows>
			{/if}
		{/each}
	</tbody>
</table>

<style>
	.nested {
		background-color: whitesmoke;
	}
</style>
