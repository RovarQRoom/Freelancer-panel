<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Img,
		Modal,
		Checkbox,
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { categoryStore } from '$lib/Store/Category';
	import { languageTag } from '$lib/paraglide/runtime';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import { languageStore } from '$lib/Store/Language';
	import { toastStore } from '$lib/Store/Toast';
	import { PenSolid, TrashBinSolid, CirclePlusSolid } from 'flowbite-svelte-icons';
	import { subcategoryStore } from '$lib/Store/Subcategory';
	import AddCategoryDrawer from '../AddCategoryDrawer.svelte';
	import EditCategoryDrawer from '../EditCategoryDrawer.svelte';
	import AddSubcategoryModal from '../AddSubcategoryModal.svelte';
	import EditSubcategoryModal from '../EditSubcategoryModal.svelte';

	let hideSidebar = $state(true);
	let hideEditSidebar = $state(true);
	let showSubcategoryModal = $state(false);
	let selectedSubcategories = $state<number[]>([]);
	let showDeleteModal = $state(false);
	let categoryToDelete = $state<number | null>(null);
	let selectedCategory = $state<number | null>(null);
	let selectedSubcategoryId = $state<number | null>(null);
	let showCreateSubcategoryModal = $state(false);
	let showEditSubcategoryModal = $state(false);

	let filter: GenericListOptions = {
		limit: 10,
		page: 1
	};

	onMount(async () => {
		await categoryStore.fetchAll(filter);
	});


	async function handleDeleteCategory() {
		if (!categoryToDelete) return;
		try {
			const category = await categoryStore.fetch(categoryToDelete);
			await categoryStore.remove(categoryToDelete);
			if (category?.title?.id) {
				await languageStore.removeSoft(category.title.id);
			}
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			showDeleteModal = false;
			categoryToDelete = null;
		}
	}

	async function handleGetSubcategories(categoryId: number) {
		try {
			await subcategoryStore.fetchAll({
				select: `id, title(id, en, ar, ckb), description(id, en, ar, ckb), category`,
				fieldOption: 'category',
				isEmpty: true,
				equal: categoryId?.toString()
			});
			selectedSubcategories = $subcategoryStore.data
				.filter(subcategory => subcategory.category === categoryId)
				.map(subcategory => subcategory.id);
			selectedCategory = categoryId;	
			showSubcategoryModal = true;
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		}
	}

	async function handleUpdateCategorySubcategories(categoryId: number) {
		try {
		
			await subcategoryStore.putAll(selectedSubcategories, categoryId);
			selectedSubcategories = [];
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		}
	}

	async function handleRemoveSubcategory(id: number) {
		await subcategoryStore.remove(id);
	}
</script>

<div class="p-6 max-w-7xl mx-auto">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-transparent">
			{m.categories()}
		</h1>
		<Button
			class="flex items-center gap-2 transform bg-gradient-to-r from-primary-light-500 to-purple-500 text-white 
			transition-all duration-300 hover:scale-105 hover:shadow-lg"
			on:click={() => (hideSidebar = false)}
		>
			<CirclePlusSolid class="h-5 w-5" />
			{m.addCategory()}
		</Button>
	</div>

	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
		<Table hoverable={true} class="w-full">
			<TableHead class="bg-gray-50 dark:bg-gray-700 text-center">
				<TableHeadCell class="font-semibold">{m.id()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.title()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.image()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.icon()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.action()}</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y divide-gray-100 dark:divide-gray-600">
				{#each $categoryStore.data as category}
					<TableBodyRow
						class="group transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer relative text-center"
						on:click={(e) => handleGetSubcategories(category.id)}
					>
					<TableBodyCell>{category.id}</TableBodyCell>
						
						<TableBodyCell class="group-hover:scale-[1.02] transition-transform duration-200">
							{category.title[languageTag()] ?? m.not_available()}
						</TableBodyCell>
						<TableBodyCell class="text-center w-full flex flex-col justify-center items-center">
							{#if category.image}
							<Img 
								src={category.image} 
								alt="category" 
								class="h-12 w-12 rounded-lg object-cover shadow-sm group-hover:shadow-md 
								group-hover:scale-105 transition-all duration-200" 
								/>
							{:else}
								<span class="text-gray-400 dark:text-gray-500">{m.not_available()}</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell>
							<div class="w-full flex flex-col justify-center items-center">
								{#if category.icon}
								<Img 
									src={category.icon} 
									alt="category" 
									class="h-12 w-12 rounded-lg object-cover shadow-sm group-hover:shadow-md 
									group-hover:scale-105 transition-all duration-200" 
								/>
							{:else}
								<span class="text-gray-400 dark:text-gray-500">{m.not_available()}</span>
							{/if}
							</div>
						</TableBodyCell>
						<TableBodyCell>
							<div class="w-full flex flex-col justify-center items-center">
								<div class="flex gap-2">
									<!-- svelte-ignore event_directive_deprecated -->
									<button
									class="p-2 hover:scale-110 transition-transform duration-200 flex items-center justify-center"
									color="light"
									on:click|stopPropagation={() => {
										selectedCategory = category.id;
										hideEditSidebar = false;
									}}
								>
									<PenSolid class="h-4 w-4 text-gray-600 dark:text-gray-300" />
								</button>
								<!-- svelte-ignore event_directive_deprecated -->
								<button
									class="p-2 hover:scale-110 transition-transform duration-200 flex items-center justify-center"
									color="red"
									on:click|stopPropagation={() => {
										categoryToDelete = category.id;
										showDeleteModal = true;
									}}
								>
									<TrashBinSolid class="h-4 w-4" />
								</button>
							</div>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

<AddCategoryDrawer bind:hidden={hideSidebar} bind:selectedSubcategories={selectedSubcategories} />
<EditCategoryDrawer bind:hidden={hideEditSidebar} bind:categoryId={selectedCategory} />

<Modal 
	bind:open={showDeleteModal} 
	size="xs" 
	autoclose={false} 
	class="rounded-xl overflow-hidden shadow-xl"
>
	<div class="p-6 text-center">
		<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
			<TrashBinSolid class="h-6 w-6 text-red-600" />
		</div>
		<h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-200">
			{m.deleteConfirmation()}
		</h3>
		<div class="flex justify-center gap-4">
			<Button
				color="red"
				class="px-6 py-2 transition-all duration-200 hover:scale-105"
				on:click={handleDeleteCategory}
			>
				{m.yes()}
			</Button>
			<Button
				color="alternative"
				class="px-6 py-2 transition-all duration-200 hover:scale-105"
				on:click={() => (showDeleteModal = false)}
			>
				{m.no()}
			</Button>
		</div>
	</div>
</Modal>

<!-- Subcategories List Modal -->
<Modal 
	bind:open={showSubcategoryModal} 
	size="xl" 
	autoclose={false}
	class="rounded-xl overflow-hidden shadow-xl"
>
	<div class="p-6">
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-2xl font-bold bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-transparent">
				{m.subcategories()}
			</h3>
			<div class="flex gap-3">
				{#if selectedSubcategories.length > 0}
					<Button
						class="transform bg-gradient-to-r from-primary-light-500 to-purple-500 text-white 
						transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
						on:click={() => handleUpdateCategorySubcategories(selectedCategory ?? 0)}
					>
						<span>{m.update_selected()} ({selectedSubcategories.length})</span>
					</Button>
				{/if}
				<!-- svelte-ignore event_directive_deprecated -->
				<button
					class="transform bg-gradient-to-r from-primary-light-500 to-purple-500 text-white 
					transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
					on:click|stopPropagation={() => {
						showCreateSubcategoryModal = true;
					}}
				>
					<CirclePlusSolid class="h-5 w-5" />
					{m.addSubcategory()}
				</button>
			</div>
		</div>

		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell class="!p-4">
					<Checkbox
						onchange={(e) => {
							const checked = (e.target as HTMLInputElement).checked;
							if (checked) {
								selectedSubcategories = $subcategoryStore.data.map(s => s.id);
							} else {
								selectedSubcategories = [];
							}
						}}
						checked={selectedSubcategories.length === $subcategoryStore.data.length && $subcategoryStore.data.length > 0}
					/>
				</TableHeadCell>
				<TableHeadCell>{m.title()}</TableHeadCell>
				<TableHeadCell>{m.description()}</TableHeadCell>
				<TableHeadCell>{m.action()}</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y">
				{#each $subcategoryStore.data as subcategory}
					<TableBodyRow>
						<TableBodyCell class="!p-4">
							<Checkbox
								checked={selectedSubcategories.includes(subcategory.id)}
								onchange={(e) => {
									const checked = (e.target as HTMLInputElement).checked;
									if (checked) {
										selectedSubcategories = [...selectedSubcategories, subcategory.id];
									} else {
										selectedSubcategories = selectedSubcategories.filter(id => id !== subcategory.id);
									}
								}}
							/>
						</TableBodyCell>
						<TableBodyCell>{subcategory.title[languageTag()]}</TableBodyCell>
						<TableBodyCell>{subcategory.description?.[languageTag()] ?? ''}</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								<Button 
									size="sm" 
									class="p-2" 
									color="light" 
									on:click={() => {
										selectedSubcategoryId = subcategory.id;
										showEditSubcategoryModal = true;
									}}
								>
									<PenSolid class="h-4 w-4" />
								</Button>
								<Button 
									size="sm" 
									class="p-2" 
									color="red"
									on:click={() => handleRemoveSubcategory(subcategory.id)}
								>
									<TrashBinSolid class="h-4 w-4" />
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</Modal>

<!-- Add Subcategory Modal -->
<AddSubcategoryModal bind:open={showCreateSubcategoryModal} />

<!-- Edit Subcategory Modal -->
<EditSubcategoryModal 
	bind:open={showEditSubcategoryModal}
	bind:subcategoryId={selectedSubcategoryId}
/>


