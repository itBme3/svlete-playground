<script>
	export let columns = [];
</script>

<thead>
	<th class="toggle-nested" />
	{#each columns as col}
		<th style="text-align:left">{col.title}</th>
	{/each}
</thead>
