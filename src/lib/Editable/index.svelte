<script lang="ts">
	import type { DoNotCare } from '$lib/types';
	import { Button, ButtonGroup, Icons, objectLookup } from '@madhive/wingsuit';
	import { onMount, createEventDispatcher, tick } from 'svelte';
	import { ChangeProxy, createChangeProxy } from './utils';

	export let data: DoNotCare;
	let editedData: DoNotCare = data;
	let proxy: DoNotCare;
	let changes: Map<string, { [key: string]: any }> = new Map();
	let proxyData;
	const dispatch = createEventDispatcher();

	const onDataChange = (id, path, value) => {
		changes = proxy.changes;
		proxyData = proxy.data;
		// data = proxy.editedData;
	};

	const createProxy = (createWithData) => {
		proxy = new ChangeProxy(createWithData, onDataChange);
		changes = proxy.changes;
		proxyData = proxy.data;
		editedData = proxy.editedData;
	};

	const save = () => {
		dispatch('save', proxy.editedData);
	};

	$: if (data) {
		console.log('createProxy');
		createProxy(data);
	}

	onMount(() => {
		createProxy(data);
	});
</script>

<ButtonGroup>
	<Button on:click={save}><Icons.Check />Save</Button>
	<Button
		variant="ghost"
		color="danger"
		on:click={() => {
			proxy.reset();
			data = proxy.editedData;
		}}><Icons.X />Cancel</Button
	>
</ButtonGroup>
{#key data}
	<slot {changes} {proxyData} {editedData} />
{/key}
