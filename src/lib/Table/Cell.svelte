<script>
	import { onMount, tick } from 'svelte';
	export let col;
	export let row;
	export let on = true;
	export let reactTo = undefined;

	/** binding to html element */
	let innerCell;
	/** used for checking if default slot is empty */
	let slotIsEmpty = true;
	/** needed for reactively checking if innerCell is empty */
	let mounted = false;

	const handleEmptyCell = () => {
		tick().then(() => {
			slotIsEmpty = !innerCell?.innerHTML?.trim()?.length;
		});
	};

	$: if (mounted) {
		reactTo;
		slotIsEmpty = false;
		handleEmptyCell();
	}
	onMount(() => {
		mounted = true;
	});
</script>

{#if on}
	<td>
		<div class="inner-cell" bind:this={innerCell}>
			{#key reactTo}
				{#if $$slots.default && !slotIsEmpty}
					<slot />
				{:else if col?.render}
					<svelte:component this={col.render.component} {...col?.render?.generateProperties(row)} />
				{:else if col?.value}
					{col.value(row)}
				{:else}
					{row[col.key] || '-'}
				{/if}
			{/key}
		</div>
	</td>
{/if}

<style>
	.inner-cell {
		width: 4rem;
	}
</style>
