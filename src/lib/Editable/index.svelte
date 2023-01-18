<script lang="ts">
	import type { DoNotCare } from '$lib/types';
	import { Button, ButtonGroup, Icons } from '@madhive/wingsuit';
	import { createEventDispatcher } from 'svelte';
	import { ChangeProxy } from './utils';

	export let data: DoNotCare;
	let editedData: DoNotCare = data;
	let proxy: DoNotCare;
	let changes: Record<string, { [key: string]: any }> = {};
	let proxyData;
	const dispatch = createEventDispatcher();

	const onDataChange = (id, path, value) => {
		console.log('change:', {
			id,
			path,
			value
		});
		changes = proxy.changes;
		proxyData = proxy.data;
	};

	const createProxy = (createWithData, persistedChanges = changes) => {
		console.log('createProxy', createWithData);
		console.log({ persistedChanges });
		proxy = new ChangeProxy(createWithData, onDataChange);
		proxy.changes = persistedChanges;
		changes = proxy.changes;
		proxyData = proxy.data;
		editedData = proxy.editedData;
	};

	const save = () => {
		dispatch('save', proxy.dataToSave);
	};
	const cancel = () => {
		proxy.reset();
		changes = proxy.changes;
		data = proxy.editedData;
	};

	$: if (data) {
		createProxy(data);
	}
</script>

<ButtonGroup justify="right">
	<Button on:click={save} variant="basic">
		<Icons.Check slot="prefix" />Save
	</Button>
	<Button variant="basic" color="danger" on:click={cancel}>
		<Icons.X slot="prefix" />Cancel
	</Button>
</ButtonGroup>
{#key data}
	<slot {changes} {proxyData} />
{/key}
