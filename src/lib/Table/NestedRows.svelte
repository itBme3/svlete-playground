<script lang="ts">
	import Head from './Head.svelte';
	export let show = false;
	export let columns = undefined;
	export let header = false;
</script>

{#if show}
	{#if !columns}
		<slot />
	{:else}
		<tr class="nested">
			<td colspan="9999999999999">
				{#if header}
					<Head {columns} />
				{/if}
				<slot />
			</td>
		</tr>
	{/if}
{/if}
