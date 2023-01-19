<script lang="ts">
	import Editable from '$lib/Editable/index.svelte';
	import { getPage } from '$lib/utils/data';
	import { Pager, Select, Table, TableCell, Input } from '@madhive/wingsuit';
	import type { ColumnConfig } from '@madhive/wingsuit/types';
	import { objectLookup } from '$lib/utils';
	import JSONTree from 'svelte-json-tree';
	import type { EditableValidator } from '$lib/Editable/utils';

	let data: any;

	const columns: ColumnConfig[] = [
		{ key: 'id', title: 'ID' },
		{ key: 'x', title: 'X' },
		{ key: 'y', title: 'Y' },
		{ key: 'status', title: 'Status' }
	];

	const validators: Record<string, EditableValidator> = {
		x: (editedItem, value, previousValue) => {
			console.log({ editedItem, value, previousValue });
			if (editedItem?.y <= value) {
				return 'X must be less than Y';
			}
		},
		y: (editedItem, value, previousValue) => {
			console.log({ editedItem, value, previousValue });
			if (value < 10) {
				return 'Y must be greater than 10.';
			}
			if (value < previousValue) {
				return 'New must be greater than previous value.';
			}
		}
	};

	const statuses = ['live', 'draft', 'archived'];

	const save = (saveRecord) => {
		data = data.map((item) => (item.id in saveRecord ? saveRecord[item.id] : item));
	};

	let page = 1;

	const fetchPage = () => {
		getPage(page).then((res) => (data = res));
	};

	$: if (page) {
		fetchPage();
	}
</script>

{#if data}
	<Editable
		{data}
		{validators}
		let:changes
		let:proxyData
		let:editedData
		let:errors
		on:save={({ detail }) => save(detail)}
	>
		<Table {columns} rows={editedData} fill>
			<TableCell slot="cell" let:row let:col let:rowIndex>
				{#if col.key !== 'id'}
					{#if col.key === 'status'}
						<Select
							fill
							selected={proxyData[rowIndex][col.key]}
							options={statuses}
							error={errors?.[row.id]?.[col.key]?.message}
							on:change={({ detail }) => (proxyData[rowIndex][col.key] = detail.selected)}
						/>
					{:else}
						<Input.Number
							id={`input-${col.key}`}
							value={editedData[rowIndex][col.key]}
							error={errors?.[row.id]?.[col.key]?.message}
							on:input={(e) => (proxyData[rowIndex][col.key] = parseInt(e.target.value))}
						/>
					{/if}
				{:else}
					{objectLookup(row, col.key)}
				{/if}
			</TableCell>
		</Table>
		<Pager
			bind:page
			total={600}
			on:next={() => (page = page + 1)}
			on:previous={() => (page = page - 1)}
		/>
		<h1>Changes:</h1>

		<JSONTree value={changes} defaultExpandedLevel={2} />

		<h1>Errors:</h1>

		<JSONTree value={errors} defaultExpandedLevel={2} />

		<h1>Data:</h1>
		<JSONTree value={data} defaultExpandedLevel={3} />
	</Editable>
{/if}

<style>
	.input-group {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		border-radius: 0.5rem;
		border: 1px solid rgb(189, 189, 189);
		margin: 1.5rem 0;
	}
	.input-group .input-group {
		border: 1px solid rgb(228, 228, 228);
	}
	label {
		width: 20px;
	}
</style>
