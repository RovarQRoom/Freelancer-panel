<script lang="ts">
	import { Button, Dropdown } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import * as m from '$lib/paraglide/messages';
	import PaginationForComponents from './PaginationForComponents.svelte';

	let {
		store,
		selectedValue = $bindable<string | undefined>(undefined),
		fieldsToShow,
		select,
		placeholder
	}: {
		store: any;
		selectedValue: string | undefined;
		fieldsToShow?: { name: string; relation?: string }[];
		select?: string;
		placeholder?: string;
	} = $props();

	let filter: GenericListOptions = $state({
		limit: 5,
		page: 1,
		select
	});

	let dropdownText = $state(placeholder || m.select_an_option());

	let hoveredColumnIndex = $state(-1);

	async function getOptions() {
		await store.fetchAll(filter);
	}

	$effect(() => {
		getOptions();
	});

	function handleSelect(option: any) {
		selectedValue = option.id;
		dropdownText = getOptionLabel(option);
	}

	function getFieldValue(option: any, field: { name: string; relation?: string }) {
		const value = field.relation ? option[field.name][field.relation] : option[field.name];
		return typeof value === 'object' ? value.en : value;
	}

	function getOptionLabel(option: any) {
		if (fieldsToShow) {
			return fieldsToShow.map((field) => getFieldValue(option, field)).join(' - ');
		}
		return option.title.en;
	}

	$effect(() => {
		if (selectedValue == undefined) {
			dropdownText = placeholder || m.select_an_option();
		}
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-end">
		{#if $store && $store.data && $store.data.length > 0}
			<Button class="font-medium">
				<span class="truncate max-w-[200px]">{dropdownText}</span>
				<ChevronDownOutline class="w-3 h-3 ms-2 transition-transform duration-200" />
			</Button>
			<Dropdown
				class="w-[32rem] p-0 overflow-hidden rounded-xl shadow-xl border border-gray-200
				dark:border-gray-700">
				<div class="flex flex-col">
					<div
						class="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300
						dark:scrollbar-thumb-gray-600 scrollbar-track-transparent
						dark:scrollbar-track-transparent scrollbar-thumb-rounded-full">
						<table class="w-full text-sm text-left relative">
							<thead
								class="text-xs uppercase sticky top-0 bg-white/95 dark:bg-gray-800/95
								backdrop-blur-md z-10">
								<tr class="border-b border-gray-100 dark:border-gray-700">
									{#if fieldsToShow}
										{#each fieldsToShow as field, index}
											<th
												class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200
												tracking-wider relative transition-colors duration-200 {hoveredColumnIndex === index ? 'bg-gray-50/80 dark:bg-gray-700/80' : ''}"
												onmouseenter={() => (hoveredColumnIndex = index)}
												onmouseleave={() => (hoveredColumnIndex = -1)}>
												{field.name}
											</th>
										{/each}
									{:else}
										<th
											class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 tracking-wider
											relative transition-colors duration-200 {hoveredColumnIndex === 0 ? 'bg-gray-50/80 dark:bg-gray-700/80' : ''}"
											onmouseenter={() => (hoveredColumnIndex = 0)}
											onmouseleave={() => (hoveredColumnIndex = -1)}>
											Title
										</th>
									{/if}
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
								{#each $store.data as option}
									<tr
										class="group bg-white dark:bg-gray-800 hover:bg-gray-50/80
										dark:hover:bg-gray-700/80 transition-all duration-200 cursor-pointer {selectedValue === option.id ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}"
										onclick={() => handleSelect(option)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												handleSelect(option);
											}
										}}
										tabindex="0">
										{#if fieldsToShow}
											{#each fieldsToShow as field, index}
												<td
													class="px-6 py-3.5 transition-colors duration-200 relative {hoveredColumnIndex === index ? 'bg-gray-50/80 dark:bg-gray-700/80' : ''}
													{selectedValue === option.id ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-300'}">
													<div class="flex items-center gap-2">
														{#if selectedValue === option.id && index === 0}
															<!-- svelte-ignore element_invalid_self_closing_tag -->
															<div
																class="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400" />
														{/if}
														<span class="truncate">{getFieldValue(option, field)}</span>
													</div>
												</td>
											{/each}
										{:else}
											<td
												class="px-6 py-3.5 transition-colors duration-200 relative {hoveredColumnIndex === 0 ? 'bg-gray-50/80 dark:bg-gray-700/80' : ''}
												{selectedValue === option.id ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-300'}">
												<div class="flex items-center gap-2">
													{#if selectedValue === option.id}
														<!-- svelte-ignore element_invalid_self_closing_tag -->
														<div
															class="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400" />
													{/if}
													<span class="truncate">{option.title.en}</span>
												</div>
											</td>
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="border-t border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800">
						<PaginationForComponents {store} {filter} />
					</div>
				</div>
			</Dropdown>
		{:else}
			<div class="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
		{/if}
	</div>
</div>
