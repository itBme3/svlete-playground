<script lang="ts">
	import Editable from '$lib/Editable/index.svelte';
	import { getPage } from '$lib/utils/data';
	import { onMount } from 'svelte';

	let data: any;

	const save = (saveRecord) => {
		data = data.map((item) => (item.id in saveRecord ? saveRecord[item.id] : item));
	};

	onMount(() => {
		getPage().then((res) => (data = res));
	});
</script>

{#if data}
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
				{#if proxyData[i]?.others?.length}
					<div class="input-group">
						<code>others:</code>
						{#each proxyData[i].others as oter, oterI}
							{#each ['x', 'y'] as key}
								<div class="input-field">
									<label for={`input-oter-${key}`}>{key}</label>
									<input
										type="number"
										id={`input-oter-${key}`}
										value={proxyData[i].others[oterI][key]}
										on:input={(e) => (proxyData[i].others[oterI][key] = e.target.value)}
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
		border: 1px solid #666;
	}
	label {
		width: 20px;
	}
</style>
