<script lang="ts">
	import type { DoNotCare } from '$lib/types';
	import { Button, ButtonGroup, Icons, objectLookup } from '@madhive/wingsuit';
	import { createEventDispatcher } from 'svelte';
	import {
		ChangeProxy,
		getRelatedValidators,
		removeIndexesFromKeypath as removeIndexesFromKeyPath,
		type EditableValidator
	} from './utils';

	export let data: DoNotCare;
	export let validators: Record<string, EditableValidator>;
	let editedData: DoNotCare = data;
	let proxy: DoNotCare;
	let changes: Record<string, Record<string, any>> = {};
	let proxyData;
	let errors: Record<string, Record<string, { message: string; validator: string }>> = {};
	const dispatch = createEventDispatcher();

	export const reset = () => {
		proxy.reset();
		changes = proxy.changes;
		errors = {};
		proxyData = proxy.data;
		editedData = proxy.editedData;
		// data = proxy.editedData;
	};

	const onDataChange = (id, path, value) => {
		changes = proxy.changes;
		proxyData = proxy.data;
		editedData = proxy.editedData;
		validateChange(id, path, value);
		dispatch('change', { data: proxy.editedData, changes });
	};

	const validateChange = (id, path, value) => {
		const relatedValidators = getRelatedValidators(path, validators);
		relatedValidators.forEach((relatedValidator) => {
			const editedItem = Array.isArray(proxy.editedData)
				? proxy.editedData.find((item) => item.id === id)
				: proxy.editedData;
			const previousItem = Array.isArray(proxy.data)
				? proxy.data.find((item) => item.id === id)
				: proxy.data;
			let finalKeyPath: string;
			const validationKeyPath =
				removeIndexesFromKeyPath(path) === relatedValidator.key
					? (finalKeyPath = path)
					: relatedValidator.key;
			const previousValue = objectLookup(previousItem, validationKeyPath);
			const currentValue =
				id in changes && validationKeyPath in changes[id]
					? changes[id][validationKeyPath]
					: objectLookup(editedItem, validationKeyPath);
			console.log({ currentValue, previousValue });
			const message = relatedValidator.method(editedItem, currentValue, previousValue);
			if (!(id in errors)) {
				errors[id] = {};
			}
			const errorPath = isNaN(path.split('.')[0]) ? path : path.split('.').slice(1).join('.');
			errors[id][errorPath] = { message, validator: relatedValidator.key };
		});
	};

	const createProxy = (createWithData, persistedChanges = changes) => {
		proxy = new ChangeProxy(createWithData, onDataChange);
		proxy.changes = persistedChanges;
		changes = proxy.changes;
		proxyData = proxy.data;
		editedData = proxy.editedData;
	};

	const save = () => {
		dispatch('save', proxy.getDataToSave());
	};

	$: if (data) {
		createProxy(data);
	}
</script>

<ButtonGroup justify="right">
	<Button on:click={save} variant="basic">
		<Icons.Check slot="prefix" />Save
	</Button>
	<Button variant="basic" color="danger" on:click={reset}>
		<Icons.X slot="prefix" />Cancel
	</Button>
</ButtonGroup>
<br />
{#key data}
	<slot {changes} {errors} {proxyData} {editedData} />
{/key}
