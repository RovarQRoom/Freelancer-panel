<script lang="ts">
	import { Button, Input, Modal, Label } from 'flowbite-svelte';
	import { SearchOutline, FilterSolid } from 'flowbite-svelte-icons';
	import * as m from '$lib/paraglide/messages';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import SelectWithPagination from './SelectWithPagination.svelte';
	import type { Fields } from '$lib/Model/Common/FieldsOptions';

	let {
		filter,
		fields,
		store
	}: {
		filter: GenericListOptions;
		fields: Array<Fields>;
		store: any;
	} = $props();

	let showFiltersModal = $state(false);

	async function resetFilters() {
		filter = { limit: 10 };
		await store.fetchAll(filter);
	}

	async function applyFilters() {
		await store.fetchAll(filter);
	}
</script>


<div class="mb-3 w-full">
	<div class="flex flex-col gap-2 sm:flex-row">
		<!-- Search Bar -->
		<div class="relative flex-1">
			<Input
				class="rounded-lg border-gray-200 bg-white/50 pl-10 pr-4 py-1.5 shadow-sm backdrop-blur-sm 
				transition-all duration-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 
				focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800/50"
				placeholder={m.search()}
				bind:value={filter.search}>
				<SearchOutline slot="left" class="absolute left-3 top-2 h-4 w-4 text-gray-400" />
			</Input>
		</div>

		<!-- Filter Button -->
		<Button
			class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 
			px-4 py-1.5 text-white shadow-sm transition-all duration-300 hover:scale-102 hover:shadow 
			hover:shadow-blue-500/25 active:scale-98"
			onclick={() => (showFiltersModal = true)}>
			<FilterSolid class="h-3.5 w-3.5" />
			<span>{m.filters()}</span>
		</Button>
	</div>
</div>

<!-- Filter Modal -->
<Modal bind:open={showFiltersModal} size="md" class="rounded-lg" autoclose={false}>
	<div class="p-4">
		<h3 class="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl 
		font-bold text-transparent">
			{m.filters()}
		</h3>

		<div class="space-y-4">
			{#each fields as field}
				<div class="flex flex-col gap-1">
					<Label class="text-sm font-medium text-gray-700 dark:text-gray-300">
						{field.label}
					</Label>

					{#if field.type === 'select'}
						<!-- <Select
							class="rounded-lg border-gray-200 bg-white/50 py-1.5 shadow-sm backdrop-blur-sm 
							transition-all duration-300 hover:border-blue-400 focus:border-blue-500 
							focus:ring-1 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800/50"
							bind:value={filter[field.name]}>
							<option value="">{m.all()}</option>
							{#each field.options as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</Select> -->
						<SelectWithPagination
							store={field.store}
							bind:selectedValue={filter[field.name]} 
							fieldsToShow={field.fieldsToShow}
							select={field.select}
							/>

					{:else if field.type === 'date'}
						<div class="flex flex-col gap-2">
							<div class="grid grid-cols-2 gap-4">
								<div class="flex flex-col gap-1">
									<Label class="text-sm font-medium text-gray-600 dark:text-gray-400">
										{m.from()}
									</Label>
									<Input
										type="date"
										class="rounded-lg border-gray-200 bg-white/50 py-2 shadow-sm backdrop-blur-sm 
										transition-all duration-300 hover:border-blue-400 focus:border-blue-500 
										focus:ring-1 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800/50"
										bind:value={filter.from} />
								</div>
								
								<div class="flex flex-col gap-1">
									<Label class="text-sm font-medium text-gray-600 dark:text-gray-400">
										{m.to()}
									</Label>
									<Input
										type="date"
										class="rounded-lg border-gray-200 bg-white/50 py-2 shadow-sm backdrop-blur-sm 
										transition-all duration-300 hover:border-blue-400 focus:border-blue-500 
										focus:ring-1 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800/50"
										bind:value={filter.to} />
								</div>
							</div>
						</div>
					{:else}
						<Input
							type={field.type as any}
							class="rounded-lg border-gray-200 bg-white/50 py-1.5 shadow-sm backdrop-blur-sm 
							transition-all duration-300 hover:border-blue-400 focus:border-blue-500 
							focus:ring-1 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800/50"
							bind:value={filter[field.name]} />
					{/if}
				</div>
			{/each}
		</div>

		<div class="mt-6 flex justify-end gap-2">
			<Button
				color="alternative"
				class="rounded-lg px-4 py-1.5 transition-all duration-300 hover:scale-102 
				hover:bg-gray-100 active:scale-98 dark:hover:bg-gray-600"
				onclick={applyFilters}>
				{m.apply()}
			</Button>
			<Button
				color="alternative"
				class="rounded-lg px-4 py-1.5 transition-all duration-300 hover:scale-102 
				hover:bg-gray-100 active:scale-98 dark:hover:bg-gray-600"
				onclick={resetFilters}>
				{m.reset()}
			</Button>
		</div>
	</div>
</Modal>
