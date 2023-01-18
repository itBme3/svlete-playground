<script lang="ts">
	import Editable from '$lib/Editable/index.svelte';

	let data = [
		{
			id: '1',
			x: 33,
			y: 66,
			alts: [{ x: 3, y: 6 }]
		},
		{
			id: '2',
			x: 22,
			y: 77,
			alts: [{ x: 2, y: 77 }]
		}
	];

	const save = (saveRecord) => {
		data = data.map((item) => (item.id in saveRecord ? saveRecord[item.id] : item));
	};
</script>

<Editable {data} let:changes let:proxyData on:save={({ detail }) => save(detail)}>
	{#each proxyData as item, i (item.id)}
		<div class="input-group">
			<code>id: <strong>{proxyData[i].id}</strong></code>
			{#each ['x', 'y'] as key}
				<div class="input-field">
					<label for={`input-${key}`}>{key}</label>
					<input
						type="number"
						id={`input-${key}`}
						value={proxyData[i][key]}
						on:input={(e) => (proxyData[i][key] = e.target.value)}
					/>
				</div>
			{/each}
			{#if proxyData[i]?.alts?.length}
				<div class="input-group">
					<code>alternatives:</code>
					{#each proxyData[i].alts as alt, altI}
						{#each ['x', 'y'] as key}
							<div class="input-field">
								<label for={`input-alt-${key}`}>{key}</label>
								<input
									type="number"
									id={`input-alt-${key}`}
									value={proxyData[i].alts[altI][key]}
									on:input={(e) => (proxyData[i].alts[altI][key] = e.target.value)}
								/>
							</div>
						{/each}
					{/each}
				</div>
			{/if}
		</div>
	{/each}

	<h1>Changes:</h1>

	{JSON.stringify(changes)}

	<h1>Data:</h1>
	{JSON.stringify(data, null, 3)}
</Editable>

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
		border: 1px solid #666;
	}
	label {
		width: 20px;
	}
</style>
