<script lang="ts">
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';

	let {
		store,
		selectedValue = $bindable<string | undefined>(undefined),
		fieldsToShow,
		select
	}: {
		store: any;
		selectedValue: string | undefined;
		fieldsToShow?: { name: string; relation?: string }[];
		select?: string;
	} = $props();

	let filter: GenericListOptions = $state({
		limit: 10,
		page: 1,
		select
	});

	async function getOptions() {
		await store.fetchAll(filter);
		selectedValue = undefined;
	}

	$effect(() => {
		getOptions();
	});

	function handleSelectChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedValue = target.value;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-end">
		<select
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
			focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600
			dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			onchange={handleSelectChange}>
			<option value={undefined}>Select an option</option>
			{#each $store.data as option}
				<option value={option.id}>
					{#if fieldsToShow}
						{fieldsToShow
							.map((field) =>
								field.relation ? option[field.name][field.relation] : option[field.name]
							)
							.join(' - ')}
					{:else}{option.name}{/if}
				</option>
			{/each}
		</select>
	</div>

	<!-- <PaginationForComponents {store} {filter} /> -->
</div>
