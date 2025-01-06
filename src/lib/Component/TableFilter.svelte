<script lang="ts">
	import { Button, Input, Modal, Label, Select } from 'flowbite-svelte';
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

<!-- Modern Filter Modal -->
<Modal bind:open={showFiltersModal} size="lg" class="rounded-3xl overflow-hidden" autoclose={false}>
	<div class="relative bg-white dark:bg-gray-800">
		<!-- Header -->
		<div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
			<h3 class="text-2xl font-bold text-white">{m.filters()}</h3>
			<p class="mt-1 text-sm text-blue-100/80">Refine your search results</p>
		</div>

		<!-- Filter Content -->
		<div class="p-6">
			<!-- Search Fields Section -->
			<div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each fields.filter(f => f.type !== 'date' && f.type !== 'select') as field}
					<div class="group">
						<Label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
							{field.label}
						</Label>
						<Input
							type={field.type}
							class="h-11 w-full rounded-lg border border-gray-300 bg-white 
							px-4 shadow-sm transition-all duration-300 hover:border-blue-400 
							focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
							dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							bind:value={filter[field.name]}
						/>
					</div>
				{/each}
			</div>

			<!-- Select Fields Section -->
			<div class="mb-6  grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each fields.filter(f => f.type === 'select') as field}
					<div class="group">
						<Label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
							{field.label}
						</Label>
						{#if !field.database && field.options}
							<div class="relative">
								<select
									class="h-11 w-full rounded-lg border border-gray-300 
									pl-4 pr-10  shadow-sm transition-all duration-300 
									hover:border-blue-400 focus:border-blue-500 focus:ring-2 
									focus:ring-blue-500/20 dark:border-gray-600 
									"
									bind:value={filter[field.name]}
								>
									<option value="" class="py-2">{m.all()}</option>
									{#each field.options as option}
										<option value={option.value} class="py-2">{option.label}</option>
									{/each}
								</select>
								<div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
									<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</div>
						{:else}
							<SelectWithPagination
								store={field.store}
								bind:selectedValue={filter[field.name]}
								fieldsToShow={field.fieldsToShow}
								select={field.select}
							/>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Date Range Section -->
			{#each fields.filter(f => f.type === 'date') as field}
				<div class="mb-6">
					<Label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
						{field.label}
					</Label>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<Label class="mb-1 text-xs text-gray-500 dark:text-gray-400">{m.from()}</Label>
							<Input
								type="date"
								class="h-11 w-full rounded-lg border border-gray-300 bg-white 
								px-4 shadow-sm transition-all duration-300 hover:border-blue-400 
								focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
								dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								bind:value={filter.from}
							/>
						</div>
						<div>
							<Label class="mb-1 text-xs text-gray-500 dark:text-gray-400">{m.to()}</Label>
							<Input
								type="date"
								class="h-11 w-full rounded-lg border border-gray-300 bg-white 
								px-4 shadow-sm transition-all duration-300 hover:border-blue-400 
								focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
								dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								bind:value={filter.to}
							/>
						</div>
					</div>
				</div>
			{/each}

			<!-- Action Buttons -->
			<div class="flex flex-col-reverse sm:flex-row justify-end gap-3">
				<Button
					color="alternative"
					class="h-11 rounded-lg px-6 font-medium bg-gray-100 transition-all 
					duration-300 hover:bg-gray-200 active:scale-95 dark:bg-gray-700 
					dark:hover:bg-gray-600"
					onclick={resetFilters}
				>
					{m.reset()}
				</Button>
				<Button
					class="h-11 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 
					px-6 font-medium text-white shadow-md transition-all duration-300 
					hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
					onclick={applyFilters}
				>
					{m.apply()}
				</Button>
			</div>
		</div>
	</div>
</Modal>

<style>
	/* Custom select styles */
	select {
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		background-size: 1.25rem;
	}

	select option {
		padding: 0.5rem;
		background-color: white;
		color: #1f2937;
	}

	.dark select option {
		background-color: #374151;
		color: white;
	}

	/* Custom scrollbar styles */
	:global(.modal-body) {
		scrollbar-width: thin;
		scrollbar-color: #cbd5e1 transparent;
	}

	:global(.modal-body::-webkit-scrollbar) {
		width: 6px;
	}

	:global(.modal-body::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.modal-body::-webkit-scrollbar-thumb) {
		background-color: #cbd5e1;
		border-radius: 3px;
	}

	:global(.modal-body::-webkit-scrollbar-thumb:hover) {
		background-color: #94a3b8;
	}
</style>
