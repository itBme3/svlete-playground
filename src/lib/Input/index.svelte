<script>
	export let value = '';
	export let disabled = false;
</script>

{#if disabled}
	{value}
{:else}
	<input bind:value />
{/if}
