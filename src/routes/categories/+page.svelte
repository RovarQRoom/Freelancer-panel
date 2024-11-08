<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Drawer,
		Button,
		Input,
		Label,
		Tabs,
		TabItem,
		Img,
		Spinner,
		Modal
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		Languages,
		type InsertCategory,
		type InsertLanguage,

		type UpdateCategory,

		type UpdateLanguage


	} from '$lib/Supabase/Types/database.types';
	import { onMount } from 'svelte';
	import { categoryStore } from '$lib/Store/Category';
	import { languageTag, type AvailableLanguageTag } from '$lib/paraglide/runtime';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	import { createUploadThing } from '$lib/Utils/Uploadthing';
	import { languageStore } from '$lib/Store/Language';
	import { LanguageEntity } from '$lib/Model/Entity/Language';
	import { storageStore } from '$lib/Store/Storage';
	import { toastStore } from '$lib/Store/Toast';
	import { CategoryEntity } from '$lib/Model/Entity/Category';
	import { PenSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import SubcategoryMultiselect from '$lib/Component/Subcategory.Multiselect.svelte';
	import { subcategoryStore } from '$lib/Store/Subcategory';
	let hideSidebar = true;
	let isLoading = false;
	let hideEditSidebar = true;
	let selectedSubcategories: string[] = [];
	let editCategory: UpdateCategory = {
		id: 0,
		title: 0,
		image: '',
		icon: null
	};
	let editCategoryLanguage: UpdateLanguage = {
		id: 0,
		en: '',
		ar: null,
		ckb: null
	};
	  // Create the upload configuration at component level
	  const { startUpload } = createUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      console.log("Upload completed");
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },
  });

	let filter: GenericListOptions = {
		limit: 10,
		page: 1
	};

	// Initialize the actual data
	let createCategory: InsertCategory = {
		title: 0,
		image: '',
		icon: null
	};
	let createCategoryLanguage: InsertLanguage = {
		en: '',
		ar: null,
		ckb: null
	};
	let imageFile: {
		file?: File;
		preview?: string;
	} = {};
	let iconFile: {
		file?: File;
		preview?: string;
	} = {};

	let showDeleteModal = false;
	let categoryToDelete: number | null = null;

	onMount(async () => {
		await categoryStore.fetchAll(filter);
	});

	async function handleAddCategory() {
		if (isLoading) return;
		isLoading = true;
		let langaugeResponse:LanguageEntity | undefined;
		let categoryResponse:CategoryEntity | undefined;
	try {
			langaugeResponse = await languageStore.insert(createCategoryLanguage);
			if (imageFile.file) {
				createCategory.image = await storageStore.uploadFile(imageFile.file, startUpload);
			}
			if (iconFile.file) {
				createCategory.icon = await storageStore.uploadFile(iconFile.file, startUpload);
			}
			createCategory.title = langaugeResponse.id;
			categoryResponse = await categoryStore.insert(createCategory);
			if (selectedSubcategories.length > 0 && categoryResponse?.id) {
				await subcategoryStore.putAll(selectedSubcategories.map(Number), categoryResponse?.id);
			}
		} catch (error) {
			if (langaugeResponse?.id) {
				await languageStore.remove(langaugeResponse.id);
			}
			if (categoryResponse?.id) {
				await categoryStore.remove(categoryResponse.id);
			}

			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			isLoading = false;
			hideSidebar = true;
			imageFile = {};
			iconFile = {};
		}
	}

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imageFile.preview = URL.createObjectURL(file);
				imageFile.file = file;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleIconUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				iconFile.preview = URL.createObjectURL(file);
				iconFile.file = file;
			};
			reader.readAsDataURL(file);
		}
	}

	async function getCategory(id: number) {
		const category = await categoryStore.fetch(id);
		editCategory = {
			id: category?.id ?? 0,
			title: category?.title.id ?? 0,
			image: category?.image ?? '',
			icon: category?.icon ?? null
		}
		editCategoryLanguage = {
			id: category?.title.id ?? 0,
			en: category?.title.en ?? '',
			ar: category?.title.ar ?? null,
			ckb: category?.title.ckb ?? null
		}
		imageFile.preview = category?.image ?? '';
		iconFile.preview = category?.icon ?? '';
		hideEditSidebar = false;
	}

	async function handleEditCategory() {
		let backupLanguage = editCategoryLanguage;
		let backupCategory = editCategory;
		let categoryResponse:CategoryEntity | undefined;
		let langaugeResponse:LanguageEntity | undefined;
		try {
			langaugeResponse = await languageStore.put(editCategoryLanguage);
			if (imageFile.file) {
				editCategory.image = await storageStore.uploadFile(imageFile.file, startUpload);
			}
			if (iconFile.file) {
				editCategory.icon = await storageStore.uploadFile(iconFile.file, startUpload);
			}
			editCategory.title = langaugeResponse?.id ?? 0;
			categoryResponse = await categoryStore.put(editCategory);
		} catch (error) {
			if (langaugeResponse?.id) {
				await languageStore.put(backupLanguage);
			}
			if (categoryResponse?.id) {
				await categoryStore.put(backupCategory);
			}
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			hideEditSidebar = true;
			imageFile = {};
			iconFile = {};
		}
	}

	async function handleDeleteCategory() {
		if (!categoryToDelete) return;
		try {
			const category = await categoryStore.fetch(categoryToDelete);
			await categoryStore.remove(categoryToDelete);
			if (category?.title?.id) {
				console.log(category.title.id);
				await languageStore.removeSoft(category.title.id);
			}
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			showDeleteModal = false;
			categoryToDelete = null;
		}
	}
</script>

<div class="p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-main-light-900 dark:text-main-dark-900 transition-colors duration-200">
			{m.categories()}
		</h1>
		<Button
			class="bg-primary-light-500 text-white hover:bg-primary-light-600 dark:bg-primary-dark-500 
			dark:hover:bg-primary-dark-600 transition-all duration-200 transform hover:scale-105"
			on:click={() => (hideSidebar = false)}>{m.addCategory()}</Button>
	</div>

	<Table hoverable={true} class="bg-white dark:bg-gray-800 transition-all duration-200">
		<TableHead>
			<TableHeadCell>{m.id()}</TableHeadCell>
			<TableHeadCell>{m.title()}</TableHeadCell>
			<TableHeadCell>{m.image()}</TableHeadCell>
			<TableHeadCell>{m.icon()}</TableHeadCell>
			<TableHeadCell>{m.action()}</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#each $categoryStore.data as category}
				<TableBodyRow class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
					<TableBodyCell>{category.id}</TableBodyCell>
					<TableBodyCell>{category.title[languageTag()]}</TableBodyCell>
					<TableBodyCell>
						<Img src={category.image} alt="category" class="h-10 w-10 rounded object-cover" />
					</TableBodyCell>
					<TableBodyCell>
						{#if category.icon}
						<Img src={category.icon} alt="category" class="h-10 w-10 rounded object-cover" />
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<div class="flex gap-2">
							<Button
								size="sm"
								class="p-2"
								color="light"
								on:click={() =>{
									getCategory(category.id);
								}}
							>
								<PenSolid class="w-4 h-4" />
							</Button>
							<Button
								size="sm"
								class="p-2"
								color="red"
								on:click={() => {
									categoryToDelete = category.id;
									showDeleteModal = true;
								}}
							>
								<TrashBinSolid class="w-4 h-4" />
							</Button>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<Drawer bind:hidden={hideSidebar} width="w-[480px]" class="transition-transform duration-300">
	<div class="bg-main-light-50 p-6 dark:bg-main-dark-50 h-full overflow-y-auto">
		<h2 class="mb-6 text-2xl font-bold text-main-light-900 dark:text-main-dark-900">
			{m.addCategory()}
		</h2>
		<form on:submit|preventDefault={handleAddCategory} class="space-y-6">
			<div class="space-y-2">
				<Label class="text-lg font-medium">{m.title()}</Label>
				<Tabs style="underline" class="mb-4">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<Input
								class="w-full transition-all duration-200 focus:ring-2 focus:ring-primary-light-500"
								bind:value={createCategoryLanguage[language.toLowerCase() as keyof InsertLanguage]}
									required={language === Languages.EN}
								/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<div class="space-y-3">
				<Label class="text-lg font-medium">{m.image()}</Label>
				<div class="flex justify-center">
					<div class="relative h-64 w-full max-w-md overflow-hidden rounded-lg bg-main-light-100 
					dark:bg-main-dark-100 transition-all duration-200 hover:shadow-lg">
						{#if imageFile.preview}
							<Img 
								src={imageFile.preview} 
								alt="Preview" 
								class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
							/>
						{:else}
							<div class="flex h-full w-full flex-col items-center justify-center">
								<span class="text-main-light-400 dark:text-main-dark-400 mb-2">No Media Selected</span>
								<Button class="transform transition-all duration-200 hover:scale-105">
									<span class="mr-2">+</span>
									Add Image
								</Button>
							</div>
						{/if}
						<input
							type="file"
							accept="image/*"
							on:change={handleImageUpload}
							class="absolute inset-0 cursor-pointer opacity-0"
						/>
					</div>
				</div>
			</div>

			<div class="space-y-3">
				<Label class="text-lg font-medium">{m.icon()}</Label>
				<div class="flex justify-start">
					<div class="relative h-20 w-20 overflow-hidden rounded-lg bg-main-light-100 
					dark:bg-main-dark-100 transition-all duration-200 hover:shadow-lg">
						{#if iconFile.preview}
							<img src={iconFile.preview} alt="Icon Preview" 
							class="h-full w-full object-cover transition-transform duration-200 hover:scale-105" />
						{:else}
							<div class="flex h-full w-full flex-col items-center justify-center">
								<span class="text-xl text-main-light-400 dark:text-main-dark-400">+</span>
							</div>
						{/if}
						<input
							type="file"
							accept="image/*"
							on:change={handleIconUpload}
							class="absolute inset-0 cursor-pointer opacity-0"
						/>
					</div>
				</div>
			</div>
			<div class="space-y-3">
				<SubcategoryMultiselect categoryId={createCategory.id} />
			</div>

			<div class="flex gap-3 pt-4">
				<Button
					type="submit"
					class="flex-1 bg-primary-light-500 text-white hover:bg-primary-light-600 
					dark:bg-primary-dark-500 dark:hover:bg-primary-dark-600 transition-all duration-200 
					transform hover:scale-105"
					disabled={isLoading}
				>
					{#if isLoading}
						<Spinner class="mr-3" size="4" color="white" />
					{/if}
					{m.save()}
				</Button>
				<Button
					color="alternative"
					class="flex-1 bg-main-light-200 hover:bg-main-light-300 dark:bg-main-dark-200 
					dark:hover:bg-main-dark-300 transition-all duration-200 transform hover:scale-105"
					on:click={() => (hideSidebar = true)}>{m.cancel()}</Button>
			</div>
		</form>
	</div>
</Drawer>

<Drawer bind:hidden={hideEditSidebar} width="w-[480px]" class="transition-transform duration-300">
	<div class="bg-main-light-50 p-6 dark:bg-main-dark-50 h-full overflow-y-auto">
		<h2 class="mb-6 text-2xl font-bold text-main-light-900 dark:text-main-dark-900">
			{m.editCategory()}
		</h2>
		<form on:submit|preventDefault={handleEditCategory} class="space-y-6">
			<div class="space-y-2">
				<Label class="text-lg font-medium">{m.title()}</Label>
				<Tabs style="underline" class="mb-4">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={m[`language_${language.toLowerCase() as AvailableLanguageTag}`]()}>
							<Input
								class="w-full transition-all duration-200 focus:ring-2 focus:ring-primary-light-500"
								bind:value={editCategoryLanguage[language.toLowerCase() as keyof InsertLanguage]}
									required={language === Languages.EN}
								/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<div class="space-y-3">
				<Label class="text-lg font-medium">{m.image()}</Label>
				<div class="flex justify-center">
					<div class="relative h-64 w-full max-w-md overflow-hidden rounded-lg bg-main-light-100 
					dark:bg-main-dark-100 transition-all duration-200 hover:shadow-lg">
						{#if imageFile.preview}
							<Img 
								src={imageFile.preview} 
								alt="Preview" 
								class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
							/>
						{:else}
							<div class="flex h-full w-full flex-col items-center justify-center">
								<span class="text-main-light-400 dark:text-main-dark-400 mb-2">No Media Selected</span>
								<Button class="transform transition-all duration-200 hover:scale-105">
									<span class="mr-2">+</span>
									Add Image
								</Button>
							</div>
						{/if}
						<input
							type="file"
							accept="image/*"
							on:change={handleImageUpload}
							class="absolute inset-0 cursor-pointer opacity-0"
						/>
					</div>
				</div>
			</div>

			<div class="space-y-3">
				<Label class="text-lg font-medium">{m.icon()}</Label>
				<div class="flex justify-start">
					<div class="relative h-20 w-20 overflow-hidden rounded-lg bg-main-light-100 
					dark:bg-main-dark-100 transition-all duration-200 hover:shadow-lg">
						{#if iconFile.preview}
							<img src={iconFile.preview} alt="Icon Preview" 
							class="h-full w-full object-cover transition-transform duration-200 hover:scale-105" />
						{:else}
							<div class="flex h-full w-full flex-col items-center justify-center">
								<span class="text-xl text-main-light-400 dark:text-main-dark-400">+</span>
							</div>
						{/if}
						<input
							type="file"
							accept="image/*"
							on:change={handleIconUpload}
							class="absolute inset-0 cursor-pointer opacity-0"
						/>
					</div>
				</div>
			</div>

			<div class="flex gap-3 pt-4">
				<Button
					type="submit"
					class="flex-1 bg-primary-light-500 text-white hover:bg-primary-light-600 
					dark:bg-primary-dark-500 dark:hover:bg-primary-dark-600 transition-all duration-200 
					transform hover:scale-105"
					disabled={isLoading}
				>
					{#if isLoading}
						<Spinner class="mr-3" size="4" color="white" />
					{/if}
					{m.save()}
				</Button>
				<Button
					color="alternative"
					class="flex-1 bg-main-light-200 hover:bg-main-light-300 dark:bg-main-dark-200 
					dark:hover:bg-main-dark-300 transition-all duration-200 transform hover:scale-105"
					on:click={() => (hideEditSidebar = true)}>{m.cancel()}</Button>
			</div>
		</form>
	</div>
</Drawer>

<Modal
	bind:open={showDeleteModal}
	size="xs"
	autoclose={false}
	class="w-full"
>
	<div class="text-center">
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			{m.deleteConfirmation()}
		</h3>
		<div class="flex justify-center gap-4">
			<Button color="red" on:click={handleDeleteCategory}>
				{m.yes()}
			</Button>
			<Button color="alternative" on:click={() => (showDeleteModal = false)}>
				{m.no()}
			</Button>
		</div>
	</div>
</Modal>
