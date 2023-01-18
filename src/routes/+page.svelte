<script lang="ts">
	import Editable from '$lib/Editable/index.svelte';
	import { Input } from '@madhive/wingsuit';

	let data = [
		{
			id: '1',
			x: 33,
			y: 66
		},
		{
			id: '2',
			x: 33,
			y: 66
		}
	];
</script>

<Editable {data} let:changes let:proxyData let:editedData on:save={({ detail }) => (data = detail)}>
	{#if editedData}
		{#each editedData as item, i (item.id)}
			<div style="padding: 1.25rem; border-radius: 1rem; border: 1px solid #eee; margin: .5rem">
				<label for="input-id">id</label>
				<input
					id="input-id"
					value={editedData[i].id}
					on:input={(e) => (proxyData[i].id = e.target.value)}
				/>
				<label for="input-x">x</label>
				<input
					type="number"
					id="input-x"
					value={editedData[i].x}
					on:input={(e) => (proxyData[i].x = e.target.value)}
				/>
				<label for="input-x">x</label>
				<input
					type="number"
					id="input-y"
					value={editedData[i].y}
					on:input={(e) => (proxyData[i].y = e.target.value)}
				/>
			</div>
		{/each}

		<h1>Changes:</h1>

		{JSON.stringify(changes)}

		<h1>Data:</h1>
		{JSON.stringify(data, null, 3)}
	{/if}
</Editable>
