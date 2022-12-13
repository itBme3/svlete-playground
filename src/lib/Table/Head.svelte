<script>
	export let columns = [];
</script>

<thead>
	{#each columns as col}
		<th style="text-align:left">{col.title}</th>
	{/each}
</thead>
