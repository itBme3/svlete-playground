<script lang="ts">
	import Row from './Row.svelte';
	export let rows = undefined;
	export let columns = undefined;
	export let getId = (row) => row?.id;
	export let showNested = (row) => false;
	export let inheritColumns = true;
</script>

{#if inheritColumns}
	{#each rows as row, rowIndex}
		{@const id = getId(row)}
		{#if $$slots.cell}
			<Row
				on:toggleNested
				on:rowClick
				showNested={showNested(row)}
				nestedInheritColumns={inheritColumns}
				{row}
				{columns}
				{id}
				nested={true}
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
				on:rowClick
				showNested={showNested(row)}
				nestedInheritColumns={inheritColumns}
				{row}
				{columns}
				{id}
				nested={true}
			/>
		{/if}
	{/each}
{:else}
	<tr class="nested-row">
		<td colspan="9999999999999">
			<slot />
		</td>
	</tr>
{/if}
