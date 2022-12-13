<script lang="ts">
	import { Input, Header, Button } from '@madhive/wingsuit';
	import { arrayErrors } from '../../../lib/utils/examples';

	const data: { name: string | undefined; count: number | undefined } = {
		name: undefined,
		count: undefined
	};

	const errors: Record<string, string | undefined> = {
		name: undefined,
		count: undefined
	};

	const validate = () => {
		Object.keys(data).forEach((key) => (errors[key] = arrayErrors.validate(data, key)?.join(', ')));
	};
</script>

<Header>
	<h4 slot="left">Current Validators (array response)</h4>
	<Button slot="right" on:click={validate}>Save</Button>
</Header>

<div>
	<Input.Text required label="Name" error={errors.name} bind:value={data.name} />
	<Input.Number label="Count" error={errors.count} bind:value={data.count} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}
	:global(header) {
		padding: 0 !important;
	}
</style>
