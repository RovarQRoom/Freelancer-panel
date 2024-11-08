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
		Modal,
		Checkbox,
		Search
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		Languages,
		type InsertCategory,
		type InsertLanguage,
		type InsertSubcategory,
		type UpdateCategory,
		type UpdateLanguage,

		type UpdateSubcategory

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
	import { PenSolid, TrashBinSolid, CirclePlusSolid } from 'flowbite-svelte-icons';
	import { subcategoryStore } from '$lib/Store/Subcategory';
	import type { SubcategoryEntity } from '$lib/Model/Entity/Subcategory';
	let hideSidebar = true;
	let hideEditSidebar = true;
	let showSubcategoryModal = false;
	let isLoading = false;
	let selectedSubcategories: number[] = [];
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
	const { startUpload } = createUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			console.log('Upload completed');
		},
		onUploadError: (error) => {
			console.error('Upload error:', error);
		}
	});

	let filter: GenericListOptions = {
		limit: 10,
		page: 1
	};

	// Initialize the actual data
	let createCategory: InsertCategory = {
		title: 0,
		image: '',
	};
	let createCategoryLanguage: InsertLanguage = {
		en: '',
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

	let showCreateSubcategoryModal = false;
	let selectedCategory: number | null = null;
	let createSubcategory: InsertSubcategory = {
		title: 0,
		description: 0
	};
	let updateSubcategory: UpdateSubcategory = {
		id: 0,
		title: 0,
		description: 0
	};

	let loadingAddSubcategory = false;
	let showEditSubcategoryModal = false;
	let createSubcategoryTitleLanguage: InsertLanguage = {
		en: '',
	};
	let createSubcategoryDescriptionLanguage: InsertLanguage = {
		en: '',
	};
	let updateSubcategoryTitleLanguage: UpdateLanguage = {
		id: 0,
		en: '',
	};
	let updateSubcategoryDescriptionLanguage: UpdateLanguage = {
		id: 0,
		en: '',
	};
	let loadingUpdateSubcategory = false;

	onMount(async () => {
		await categoryStore.fetchAll(filter);
	});

	async function handleAddCategory() {
		if (isLoading) return;
		isLoading = true;
		let langaugeResponse: LanguageEntity | undefined;
		let categoryResponse: CategoryEntity | undefined;
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
		};
		editCategoryLanguage = {
			id: category?.title.id ?? 0,
			en: category?.title.en ?? '',
			ar: category?.title.ar ?? null,
			ckb: category?.title.ckb ?? null
		};
		imageFile.preview = category?.image ?? '';
		iconFile.preview = category?.icon ?? '';
		hideEditSidebar = false;
	}

	async function handleGetSubcategory(id: number) {
		const subcategory = await subcategoryStore.fetch(id);
		updateSubcategory = {
			id: subcategory?.id ?? 0,
			title: subcategory?.title.id ?? 0,
			description: subcategory?.description?.id ?? 0
		};
		updateSubcategoryTitleLanguage = {
			id: subcategory?.title.id ?? 0,
			en: subcategory?.title.en ?? '',
			ar: subcategory?.title.ar ?? null,
			ckb: subcategory?.title.ckb ?? null
		};
		updateSubcategoryDescriptionLanguage = {
			id: subcategory?.description?.id ?? 0,
			en: subcategory?.description?.en ?? '',
			ar: subcategory?.description?.ar ?? null,
			ckb: subcategory?.description?.ckb ?? null
		};
		
	}

	async function handleEditCategory() {
		let backupLanguage = editCategoryLanguage;
		let backupCategory = editCategory;
		let categoryResponse: CategoryEntity | undefined;
		let langaugeResponse: LanguageEntity | undefined;
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
			showSubcategoryModal = true;
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		}
	}

	async function handleAddSubcategory() {
		if (loadingAddSubcategory) return;
		loadingAddSubcategory = true;
		let titleResponse: LanguageEntity | undefined;
		let descriptionResponse: LanguageEntity | undefined;
		let subcategoryResponse: SubcategoryEntity | undefined;
		try {
			titleResponse = await languageStore.insert(createSubcategoryTitleLanguage);
			descriptionResponse = await languageStore.insert(createSubcategoryDescriptionLanguage);
			createSubcategory.title = titleResponse?.id ?? 0;
			createSubcategory.description = descriptionResponse?.id ?? 0;
			subcategoryResponse = await subcategoryStore.insert(createSubcategory);
		} catch (error) {
			if (titleResponse?.id) {
				await languageStore.remove(titleResponse.id);
			}
			if (descriptionResponse?.id) {
				await languageStore.remove(descriptionResponse.id);
			}
			if (subcategoryResponse?.id) {
				await subcategoryStore.remove(subcategoryResponse.id);
			}
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			loadingAddSubcategory = false;
			showCreateSubcategoryModal = false;
		}
	}

	async function handleEditSubcategory() {
		loadingUpdateSubcategory = true;
		let titleResponse: LanguageEntity | undefined;
		let descriptionResponse: LanguageEntity | undefined;
		let subcategoryResponse: SubcategoryEntity | undefined;
		try {
			titleResponse = await languageStore.put(updateSubcategoryTitleLanguage);
			descriptionResponse = await languageStore.put(updateSubcategoryDescriptionLanguage);
			createSubcategory.title = titleResponse?.id ?? 0;
			createSubcategory.description = descriptionResponse?.id ?? 0;
			subcategoryResponse = await subcategoryStore.put(createSubcategory);
		} catch (error) {
			if (titleResponse?.id) {
				await languageStore.remove(titleResponse.id);
			}
			if (descriptionResponse?.id) {
				await languageStore.remove(descriptionResponse.id);
			}
			if (subcategoryResponse?.id) {
				await subcategoryStore.remove(subcategoryResponse.id);
			}
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			loadingUpdateSubcategory = false;
			showEditSubcategoryModal = false;
		}
	}

	async function handleUpdateCategorySubcategories(categoryId: number) {
		try {
			await subcategoryStore.putAll(selectedSubcategories, categoryId);
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
			<TableHead class="bg-gray-50 dark:bg-gray-700">
				<TableHeadCell class="font-semibold">{m.id()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.title()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.image()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.icon()}</TableHeadCell>
				<TableHeadCell class="font-semibold">{m.action()}</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y divide-gray-100 dark:divide-gray-600">
				{#each $categoryStore.data as category}
					<TableBodyRow
						class="group transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer relative"
						on:dblclick={(e) => handleGetSubcategories(category.id)}
					>
					<TableBodyCell>{category.id}</TableBodyCell>
						<div class="absolute inset-0 bg-primary-light-500/0 group-hover:bg-primary-light-500/5 
							transition-all duration-300 pointer-events-none">
							<div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300  z-20
								absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500 
								dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">
								{m.double_click_to_view_subcategories()}
							</div>
						</div>
						
						<TableBodyCell class="group-hover:scale-[1.02] transition-transform duration-200">
							{category.title[languageTag()] ?? m.not_available()}
						</TableBodyCell>
						<TableBodyCell>
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
						</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								<Button
									size="sm"
									class="p-2 hover:scale-110 transition-transform duration-200"
									color="light"
									on:click={() => getCategory(category.id)}
								>
									<PenSolid class="h-4 w-4 text-gray-600 dark:text-gray-300" />
								</Button>
								<Button
									size="sm"
									class="p-2 hover:scale-110 transition-transform duration-200"
									color="red"
									on:click={() => {
										categoryToDelete = category.id;
										showDeleteModal = true;
									}}
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
</div>

<Drawer 
	bind:hidden={hideSidebar} 
	width="w-[520px]" 
	class="transition-transform duration-300"
	on:close={() => {
		hideSidebar = true;
		createCategoryLanguage = {
			en: '',
		};
		imageFile = {
			preview: '',
		};
		iconFile = {
			preview: '',
		};
		createCategoryLanguage = {
			en: '',
		};
		createCategory = {
			title: 0,
			image: '',
		};
	}}
>
	<div class="h-full overflow-y-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8">
		<h2 class="text-2xl font-bold mb-8 bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-transparent">
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
					<div
						class="relative h-64 w-full max-w-md overflow-hidden rounded-lg bg-main-light-100
					transition-all duration-200 hover:shadow-lg dark:bg-main-dark-100"
					>
						{#if imageFile.preview}
							<Img
								src={imageFile.preview}
								alt="Preview"
								class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
							/>
						{:else}
							<div class="flex h-full w-full flex-col items-center justify-center">
								<span class="mb-2 text-main-light-400 dark:text-main-dark-400"
									>{m.no_media_selected()}</span
								>
								<Button class="transform transition-all duration-200 hover:scale-105">
									<span class="mr-2">+</span>
									{m.add_image()}
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
					<div
						class="relative h-20 w-20 overflow-hidden rounded-lg bg-main-light-100
					transition-all duration-200 hover:shadow-lg dark:bg-main-dark-100"
					>
						{#if iconFile.preview}
							<img
								src={iconFile.preview}
								alt="Icon Preview"
								class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
							/>
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
					class="flex-1 transform bg-primary-light-500 text-white 
					transition-all duration-200 hover:scale-105 hover:bg-primary-light-600 
					dark:bg-primary-dark-500 dark:hover:bg-primary-dark-600"
					disabled={isLoading}
				>
					{#if isLoading}
						<Spinner class="mr-3" size="4" color="white" />
					{/if}
					{m.save()}
				</Button>
				<Button
					color="alternative"
					class="flex-1 transform bg-main-light-200 transition-all 
					duration-200 hover:scale-105 hover:bg-main-light-300 dark:bg-main-dark-200 dark:hover:bg-main-dark-300"
					on:click={() => {
						hideSidebar = true;
						createCategoryLanguage = {
							en: '',
						};
						imageFile = {
							preview: '',
						};
						iconFile = {
							preview: '',
						};
						createCategoryLanguage = {
							en: '',
						};
						createCategory = {
							title: 0,
							image: '',
						};
					}}>{m.cancel()}</Button
				>
			</div>
		</form>
	</div>
</Drawer>

<Drawer bind:hidden={hideEditSidebar} width="w-[480px]" class="transition-transform duration-300" on:close={() => {
	hideEditSidebar = true;
	editCategoryLanguage = {
		en: '',
	};
	imageFile = {
		preview: '',
	};
	iconFile = {
		preview: '',
	};
	createCategoryLanguage = {
		en: '',
	};
	createCategory = {
		title: 0,
		image: '',
	};
}}>
	<div class="h-full overflow-y-auto bg-main-light-50 p-6 dark:bg-main-dark-50">
		<h2 class="mb-6 text-2xl font-bold text-main-light-900 dark:text-main-dark-900">
			{m.editCategory()}
		</h2>
		<form on:submit|preventDefault={handleEditCategory} class="space-y-6">
			<div class="space-y-2">
				<Label class="text-lg font-medium">{m.title()}</Label>
				<Tabs style="underline" class="mb-4">
					{#each Object.keys(Languages) as language}
						<TabItem
							open={language === Languages.EN}
							title={m[`language_${language.toLowerCase() as AvailableLanguageTag}`]()}
						>
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
					<div
						class="relative h-64 w-full max-w-md overflow-hidden rounded-lg bg-main-light-100
					transition-all duration-200 hover:shadow-lg dark:bg-main-dark-100"
					>
						{#if imageFile.preview}
							<Img
								src={imageFile.preview}
								alt="Preview"
								class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
							/>
						{:else}
							<div class="flex h-full w-full flex-col items-center justify-center">
								<span class="mb-2 text-main-light-400 dark:text-main-dark-400"
									>No Media Selected</span
								>
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
					<div
						class="relative h-20 w-20 overflow-hidden rounded-lg bg-main-light-100
					transition-all duration-200 hover:shadow-lg dark:bg-main-dark-100"
					>
						{#if iconFile.preview}
							<img
								src={iconFile.preview}
								alt="Icon Preview"
								class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
							/>
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
					class="flex-1 transform bg-primary-light-500 text-white 
					transition-all duration-200 hover:scale-105 hover:bg-primary-light-600 
					dark:bg-primary-dark-500 dark:hover:bg-primary-dark-600"
					disabled={isLoading}
				>
					{#if isLoading}
						<Spinner class="mr-3" size="4" color="white" />
					{/if}
					{m.save()}
				</Button>
				<Button
					color="alternative"
					class="flex-1 transform bg-main-light-200 transition-all 
					duration-200 hover:scale-105 hover:bg-main-light-300 dark:bg-main-dark-200 dark:hover:bg-main-dark-300"
					on:click={() => {
						hideEditSidebar = true;
						editCategoryLanguage = {
							en: '',
						};
						imageFile = {
							preview: '',
						};
						iconFile = {
							preview: '',
						};
						createCategoryLanguage = {
							en: '',
						};
						createCategory = {
							title: 0,
							image: '',
						};
					}}>{m.cancel()}</Button
				>
			</div>
		</form>
	</div>
</Drawer>

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
						<span>Update Selected ({selectedSubcategories.length})</span>
					</Button>
				{/if}
				<Button
					class="transform bg-gradient-to-r from-primary-light-500 to-purple-500 text-white 
					transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
					on:click={() => {
						showCreateSubcategoryModal = true;
					}}
				>
					<CirclePlusSolid class="h-5 w-5" />
					{m.addSubcategory()}
				</Button>
			</div>
		</div>

		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell class="!p-4">
					<Checkbox
						on:change={(e) => {
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
								on:change={(e) => {
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
										handleGetSubcategory(subcategory.id);
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

<!-- Create Subcategory Modal -->
<Modal bind:open={showCreateSubcategoryModal} size="lg" autoclose={false}>
	<div class="p-4">
		<h3 class="mb-4 text-xl font-bold">{m.addSubcategory()}</h3>
		<form class="space-y-4">
			<div class="space-y-2">
				<Label>{m.title()}</Label>
				<Tabs style="underline">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<Input
								class="w-full"
								required={language === Languages.EN}
							/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<div class="space-y-2">
				<Label>{m.description()}</Label>
				<Tabs style="underline">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<Input
								class="w-full"
								required={language === Languages.EN}
							/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<div class="flex justify-end gap-3">
				<Button 
					type="submit" 
					class="bg-primary-light-500 text-white" 
					on:click={() => handleAddSubcategory()}
					disabled={loadingAddSubcategory}
				>
					{#if loadingAddSubcategory}
						<Spinner class="mr-3" size="4" color="white" />
					{/if}
					{m.save()}
				</Button>
				<Button color="alternative" on:click={() => (showCreateSubcategoryModal = false)}>
					{m.cancel()}
				</Button>
			</div>
		</form>
	</div>
</Modal>

<!-- Edit Subcategory Modal -->
<Modal bind:open={showEditSubcategoryModal} size="lg" autoclose={false}>
	<div class="p-4">
		<h3 class="mb-4 text-xl font-bold">{m.editSubcategory()}</h3>
		<form class="space-y-4">
			<div class="space-y-2">
				<Label>{m.subCategorytitle()}</Label>
				<Tabs style="underline">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<Input
								bind:value={updateSubcategoryTitleLanguage[language.toLowerCase() as keyof UpdateLanguage]}
								class="w-full"
								placeholder={m.subCategorytitlePlaceholder()}
								required={language === Languages.EN}
							/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<div class="space-y-2">
				<Label>{m.subCategoryDescription()}</Label>
				<Tabs style="underline">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<Input
								bind:value={updateSubcategoryDescriptionLanguage[language.toLowerCase() as keyof UpdateLanguage]}
								class="w-full"
								placeholder={m.subCategoryDescriptionPlaceholder()}
								required={language === Languages.EN}
							/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<div class="flex justify-end gap-3">
				<Button 
					type="submit" 
					class="bg-primary-light-500 text-white" 
					on:click={() => handleEditSubcategory()}
					disabled={loadingUpdateSubcategory}
				>
					{#if loadingUpdateSubcategory}
						<Spinner class="mr-3" size="4" color="white" />
					{/if}
					{m.save()}
				</Button>
				<Button color="alternative" on:click={() => (showEditSubcategoryModal = false)}>
					{m.cancel()}
				</Button>
			</div>
		</form>
	</div>
</Modal>


