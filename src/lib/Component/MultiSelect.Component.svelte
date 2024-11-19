<script lang="ts">
	import MultiSelect from 'svelte-multiselect';
	import { fade } from 'svelte/transition';

	let {
		options = $bindable([]),
		placeholder,
		maxSelect = null,
		required,
		disabled = $bindable(false),
		loading = $bindable(false),
		values = $bindable([])
	}: {
		options: any[];
		placeholder: string;
		maxSelect: number | null;
		required: boolean;
		disabled: boolean;
		loading: boolean;
		values: number[];
	} = $props();

	let selected: any[] = $state([]);

	$effect(() => {
		if (selected.length > 0) {
			values = selected.map((item) => item.id);
		}
	});
</script>

<div class="w-full" transition:fade>
	<MultiSelect
		{options}
		bind:selected
		{placeholder}
		{maxSelect}
		{required}
		{disabled}
		{loading}
		inputClass="bg-white dark:bg-gray-700"
		outerDivClass="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
		ulSelectedClass="flex flex-wrap gap-2 p-2 bg-white dark:bg-gray-700"
		liSelectedClass="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-md flex items-center gap-2"
		ulOptionsClass="mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg"
		liOptionClass="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
		liActiveOptionClass="bg-gray-100 dark:bg-gray-600"
		maxSelectMsgClass="text-sm text-gray-500 dark:text-gray-400"
		let:idx
		let:option
	>
		<div slot="spinner" class="flex justify-center p-4">
			<div class="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
		</div>

		{#if option}
			<span class="flex w-full items-center justify-between gap-3">
				<div class="flex w-auto justify-start gap-2">
					{#if idx !== undefined}
						<strong>{idx + 1}</strong>
					{/if}
					<img
						src={option.image ? option.image : '/images/ekhlas-no-image.png'}
						class="h-8 w-8 rounded-lg object-cover"
						alt={option.image}
					/>
				</div>
				<p>{option.label}</p>
			</span>
		{/if}

		<svelte:fragment slot="remove-icon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</svelte:fragment>
	</MultiSelect>
</div>
