<script lang="ts">
	import Editable from '$lib/Editable/index.svelte';
	import type { EditableValidator } from '$lib/Editable/utils';

	let data: any = {
		id: '1',
		x: 3,
		y: 6,
		others: [
			{ x: 2, y: 7 },
			{ x: 1, y: 9 }
		]
	};

	let editable;

	const validators: Record<string, EditableValidator> = {
		x: (editedItem, value) => {
			console.log({ editedItem });
			console.log(editedItem.y, value);
			if (editedItem.y <= value) {
				return 'X must be less than Y';
			}
		},
		y: (editedItem, value, previousValue) => {
			if (value < 10) {
				return 'Y must be greater than 10.';
			}
			if (value < previousValue) {
				return 'New must be greater than previous value.';
			}
		},
		'others.y': (editedItem, value, previousValue) => {
			console.log({ editedItem });
			console.log(editedItem.y, value);
			if (value < 10) {
				return 'Y must be greater than 10.';
			}
			if (value < previousValue) {
				return 'New must be greater than previous value.';
			}
		}
	};

	const save = (saveRecord) => {
		data = data.id in saveRecord ? saveRecord[data.id] : data;
		editable.reset();
	};
</script>

{#if data}
	<Editable
		{data}
		{validators}
		bind:this={editable}
		let:changes
		let:proxyData
		let:editedData
		let:errors
		on:save={({ detail }) => save(detail)}
	>
		<div class="input-group">
			<code>id: <strong>{proxyData.id}</strong></code>
			{#each ['x', 'y'] as key}
				<div class="input-field">
					<label for={`input-${key}`}>{key}</label>
					<input
						type="number"
						id={`input-${key}`}
						value={editedData[key]}
						on:input={(e) => (proxyData[key] = parseInt(e.target.value))}
					/>
					{#if errors?.[proxyData.id]?.[key]?.message}<small class="error"
							>{errors?.[proxyData.id]?.[key].message}</small
						>{/if}
				</div>
			{/each}
			{#if proxyData?.others?.length}
				<div class="input-group">
					<code>others:</code>
					{#each proxyData.others as other, otherI}
						<div class="input-fields" style="display: flex; flex-direction: row; gap: 1.5rem">
							{#each ['x', 'y'] as key}
								<div class="input-field">
									<label for={`input-other-${key}`}>{key}:</label>
									<input
										type="number"
										id={`input-other-${key}`}
										value={editedData.others[otherI][key]}
										on:input={(e) => (proxyData.others[otherI][key] = parseInt(e.target.value))}
									/>
									{#if errors?.[proxyData.id]?.[`others.${otherI}.${key}`]?.message}<small
											class="error">{errors[proxyData.id][`others.${otherI}.${key}`].message}</small
										>{/if}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<h1>Changes:</h1>

		{JSON.stringify(changes)}

		<h1>Errors:</h1>

		{JSON.stringify(errors)}

		<h1>Data:</h1>

		{JSON.stringify(data, null, 3)}
	</Editable>
{/if}

<style>
	.input-group {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid rgb(189, 189, 189);
	}
	.input-group .input-group {
		border: 1px solid rgb(228, 228, 228);
		margin: 0.5rem 0;
		padding: 0.5rem;
	}
	.input-fields {
		padding: 1rem;
	}
	label {
		width: 20px;
	}
	.error {
		color: var(--color-danger);
	}
</style>
