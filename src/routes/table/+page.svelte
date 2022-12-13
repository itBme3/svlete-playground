<script lang="ts">
	import Table from '$lib/Table/Table.svelte';
	import Row from '$lib/Table/Row.svelte';
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
					id: '1.2',
					name: 'Winner',
					prize: '🦄'
				},
				{
					id: '1.232323232323232323',
					name: 'Something Else',
					prize: '🦄'
				}
			]
		},
		{
			id: '2',
			place: 'second',
			prize: '🥈',
			nested: [
				{
					id: '2.2',
					name: 'So Close',
					prize: '🙄'
				}
			]
		},
		{
			id: '3',
			place: 'Third',
			prize: '🥉',
			nested: [
				{
					id: '3.2',
					name: 'Wah Wah',
					prize: '💩'
				}
			]
		}
	];

	let columns = [
		{
			key: 'id',
			title: 'ID'
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
		{ key: 'name', title: 'Name' },
		{ key: 'prize', title: 'Prize' }
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
	nestedConfig={{
		rows: (row) => row.nested,
		show: (row) => toggleNested.has(row.id),
		header: false
	}}
	on:rowClick={({ detail }) => handleRowClick(detail.id)}
>
	<Row slot="row" let:row let:id {id} {columns} {row} on:click={() => handleRowClick(id)}>
		<svelte:fragment slot="cell" let:col let:key>
			{@const cellValues = { row, col, key }}

			<Cell on={!['place', 'prize'].includes(key)} {...cellValues} />

			<Cell on={key === 'prize'} reactTo={edit} {...cellValues}>
				{#if edit}
					<Input value={row[key]} />
				{/if}
			</Cell>

			<Cell on={key === 'place'} reactTo={edit} {...cellValues} />
		</svelte:fragment>
	</Row>

	<Row
		slot="nested"
		let:nestedRow
		let:id
		let:nestedId
		let:nestedColumns
		on={toggleNested.has(id)}
		columns={nestedColumns}
		id={nestedId}
		row={nestedRow}
	>
		<svelte:fragment slot="cell" let:col let:key>
			{@const nestedValues = { row: nestedRow, col, key }}

			{#if key === 'name'}
				<Cell {...nestedValues} />
			{:else if key === 'prize'}
				<Cell reactTo={edit} {...nestedValues}>
					{#if edit}
						<Input value={nestedRow[key]} />
					{/if}
				</Cell>
			{:else}
				<Cell {...nestedValues} />
			{/if}
		</svelte:fragment>
	</Row>
</Table>

<style>
	:global(body) {
		padding: 2rem;
		font-family: sans-serif;
	}
	:global(table) {
		width: 100%;
	}
	:global(th) {
		font-weight: 900;
	}
	:global(td) {
		font-weight: 200;
	}
</style>
