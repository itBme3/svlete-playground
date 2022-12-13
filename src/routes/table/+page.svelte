<script lang="ts">
	import NestedRows from './../../lib/Table/NestedRows.svelte';
	import Table from '$lib/Table/Table.svelte';
	import Cell from '$lib/Table/Cell.svelte';
	import Input from '$lib/Input/index.svelte';

	let toggleNested = new Set();
	let edit = false;

	let rows = [
		{
			id: '1',
			place: 'First',
			prize: '🥇',
			nested: [
				{
					id: '1.1',
					name: 'Winner',
					prize: '🦄',
					place: '--',
					nested: [
						{
							id: '1.2',
							name: 'Chicken Dinner',
							place: '--',
							prize: '🍗'
						}
					]
				}
			]
		},
		{
			id: '2',
			place: 'second',
			prize: '🥈'
		},
		{
			id: '3',
			place: 'Third',
			prize: '🥉',
			nested: [
				{
					id: '3.1',
					name: 'Wah',
					prize: '💩',
					nested: [
						{
							id: '3.2',
							name: 'Wah',
							prize: '🤬'
						}
					]
				}
			]
		}
	];

	let columns = [
		{
			key: 'id',
			title: '#'
		},
		{
			key: 'place',
			title: 'Place',
			render: {
				component: Input,
				generateProperties: (row) => ({
					value: row.place,
					disabled: !edit
				})
			},
			value: (row) => 'val ' + row.place
		},
		{
			key: 'prize',
			title: 'Prize'
		}
	];

	const nestedColumns = [
		{ key: 'name', title: 'Some', width: '3rem' },
		{ key: 'prize', title: 'Thing', width: '3rem' }
	];

	const handleRowClick = (id) => {
		if (toggleNested.has(id)) {
			toggleNested.delete(id);
		} else {
			toggleNested.add(id);
		}
		toggleNested = toggleNested;
	};
</script>

<button on:click={() => (edit = !edit)}>
	{edit ? 'read' : 'edit'}
</button>

<Table
	{rows}
	{columns}
	on:toggleNested={({ detail: { id } }) => handleRowClick(id)}
	showNested={(row) => toggleNested.has(row.id)}
>
	<svelte:fragment slot="cell" let:col let:row>
		<Cell {row} {col} reactTo={edit}>
			{#if edit && col.key !== 'place'}
				<Input value={row[col.key]} />
			{/if}
		</Cell>
	</svelte:fragment>

	<svelte:fragment slot="nested" let:row>
		{#if row?.nested?.length}
			{#if row.id === '1'}
				<NestedRows
					rows={row.nested}
					{columns}
					showNested={(row) => toggleNested.has(row.id)}
					on:toggleNested={({ detail: { id } }) => handleRowClick(id)}
				>
					<svelte:fragment slot="cell" let:col let:row>
						<Cell {row} {col} reactTo={edit}>
							{#if edit}
								<Input value={row[col.key]} />
							{/if}
						</Cell>
					</svelte:fragment>
				</NestedRows>
			{:else}
				<NestedRows
					inheritColumns={false}
					showNested={(row) => toggleNested.has(row.id)}
					on:toggleNested={({ detail: { id } }) => handleRowClick(id)}
				>
					<Table
						rows={row.nested}
						columns={nestedColumns}
						showNested={(row) => toggleNested.has(row.id)}
						on:toggleNested={({ detail: { id } }) => handleRowClick(id)}
					>
						<svelte:fragment slot="cell" let:col let:row>
							<Cell {row} {col} reactTo={edit}>
								{#if edit}
									<Input value={row[col.key]} />
								{/if}
							</Cell>
						</svelte:fragment>
					</Table>
				</NestedRows>
			{/if}
		{/if}
	</svelte:fragment>
</Table>

<!-- <Table {rows} {columns}>
	<Row
		slot="row"
		let:row
		let:id
		{id}
		{columns}
		{row}
		showNested={toggleNested.has(id)}
		on:toggleNested={({ detail: { id } }) => handleRowClick(id)}
	>
		<svelte:fragment slot="cell" let:col let:key>
			<Cell {row} {col} {key} reactTo={edit}>
				{#if edit && key !== 'place'}
					<Input value={row[key]} />
				{/if}
			</Cell>
		</svelte:fragment>

		<svelte:fragment slot="nested">
			{#if row?.nested?.length}
				<Table rows={row.nested} columns={nestedColumns} showHeader={true}>
					<Row
						slot="row"
						let:row
						let:id
						{id}
						columns={nestedColumns}
						{row}
						showNested={toggleNested.has(id)}
						on:toggleNested={({ detail: { id } }) => handleRowClick(id)}
					>
						<svelte:fragment slot="cell" let:col let:key>
							<Cell {row} {col} {key} reactTo={edit}>
								{#if edit}
									<Input value={row[key]} />
								{/if}
							</Cell>
						</svelte:fragment>
					</Row>
				</Table>
			{/if}
		</svelte:fragment>
	</Row>
</Table> -->
<style global>
	body {
		padding: 2rem;
		font-family: sans-serif;
	}
	table {
		width: 100%;
		border-spacing: 0;
	}
	th {
		font-weight: 900;
	}
	td {
		font-weight: 200;
	}
	.nested-row {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 0.5rem;
	}
	.hidden {
		display: none;
	}
</style>
