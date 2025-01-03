<script lang="ts">
	import { Button, Input, Select, Modal, Label, Datepicker } from 'flowbite-svelte';
	import { SearchOutline, FilterSolid } from 'flowbite-svelte-icons';
	import * as m from '$lib/paraglide/messages';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import type { Store } from '$lib/Model/Extention/Store';

	let {
		store,
		filter = $bindable(),
		fields
	}: {
		store: any;
		filter: GenericListOptions;
		fields: Array<{
			label: string;
			name: string;
			type: 'text' | 'number' | 'select' | 'date' | 'boolean';
			dateRange?: boolean;
			options?: Array<{ value: string; label: string }>;
		}>;
	} = $props();

	let showFiltersModal = $state(false);

	function resetFilters() {
		filter = { limit: 10 };
	}

	function applyFilters() {
		store.fetchAll(filter);
		// showFiltersModal = false;
	}
</script>


<div class="mb-4 w-full">
	<div class="flex flex-col gap-4 sm:flex-row">
		<!-- Search Bar -->
		<div class="relative flex-1">
			<Input
				class="rounded-xl border-gray-200 bg-white/50 pl-10 pr-4 shadow-sm backdrop-blur-sm 
				transition-all duration-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 
				focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800/50"
				placeholder={m.search()}
				bind:value={filter.search}>
				<SearchOutline slot="left" class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
			</Input>
		</div>

		<!-- Filter Button -->
		<Button
			class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
			px-6 text-white shadow-md transition-all duration-300 hover:scale-102 hover:shadow-lg 
			hover:shadow-blue-500/25 active:scale-98"
			onclick={() => (showFiltersModal = true)}>
			<FilterSolid class="h-4 w-4" />
			<span>{m.filters()}</span>
		</Button>
	</div>
</div>

<!-- Filter Modal -->
<Modal bind:open={showFiltersModal} size="md" class="rounded-xl" autoclose={false}>
	<div class="p-6">
		<h3 class="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl 
		font-bold text-transparent">
			{m.filters()}
		</h3>

		<div class="space-y-6">
			{#each fields as field}
				<div class="flex flex-col gap-2">
					<Label class="text-sm font-medium text-gray-700 dark:text-gray-300">
						{field.label}
					</Label>

					{#if field.type === 'select' && field.options && field.options.length > 0}
						<Select
							class="rounded-xl border-gray-200 bg-white/50 shadow-sm backdrop-blur-sm 
							transition-all duration-300 hover:border-blue-400 focus:border-blue-500 
							focus:ring-2 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800/50"
							bind:value={filter[field.name]}>
							<option value="">{m.all()}</option>
							{#each field.options as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</Select>

					{:else if field.type === 'date' && field.dateRange && filter.from instanceof Date && filter.to instanceof Date}
						<Datepicker 
							range 
							bind:rangeFrom={filter.from} 
							bind:rangeTo={filter.to}					
						/>
					{:else}
						<Input
							type={field.type as any}
							class="rounded-xl border-gray-200 bg-white/50 shadow-sm backdrop-blur-sm 
							transition-all duration-300 hover:border-blue-400 focus:border-blue-500 
							focus:ring-2 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-800/50"
							bind:value={filter[field.name]} />
					{/if}
				</div>
			{/each}
		</div>

		<div class="mt-8 flex justify-end gap-3">
			<Button
				color="alternative"
				class="rounded-xl px-6 transition-all duration-300 hover:scale-102 
				hover:bg-gray-100 active:scale-98 dark:hover:bg-gray-600"
				onclick={resetFilters}>
				{m.reset()}
			</Button>
			<Button
				class="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-white 
				shadow-md transition-all duration-300 hover:scale-102 hover:shadow-lg 
				hover:shadow-blue-500/25 active:scale-98"
				onclick={applyFilters}>
				{m.apply()}
			</Button>
		</div>
	</div>
</Modal>
