<script lang="ts">
	import {
		Button,
		Input,
		Label,
		Tabs,
		TabItem,
		Img,
		Spinner,
		Drawer
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { Languages, type InsertCategory, type InsertLanguage } from '$lib/Supabase/Types/database.types';
	import { categoryStore } from '$lib/Store/Category';
	import { languageStore } from '$lib/Store/Language';
	import { storageStore } from '$lib/Store/Storage';
	import { toastStore } from '$lib/Store/Toast';
	import { CategoryEntity } from '$lib/Model/Entity/Category';
	import { LanguageEntity } from '$lib/Model/Entity/Language';
	import { createUploadThing } from '$lib/Utils/Uploadthing';
	import { subcategoryStore } from '$lib/Store/Subcategory';

	let { hidden = $bindable(true), selectedSubcategories = $bindable<number[]>([]) } = $props<{ hidden: boolean; selectedSubcategories: number[] }>();

	const { startUpload } = createUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			console.log('Upload completed');
		},
		onUploadError: (error) => {
			console.error('Upload error:', error);
		}
	});

	let isLoading = $state(false);
	let createCategory = $state<InsertCategory>({
		title: 0,
		image: ''
	});
	let createCategoryLanguage = $state<InsertLanguage>({
		en: ''
	});
	let imageFile = $state<{ file?: File; preview?: string }>({
		file: undefined,
		preview: undefined
	});
	let iconFile = $state<{ file?: File; preview?: string }>({
		file: undefined,
		preview: undefined
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
			hidden = true;
			resetForm();
		}
	}

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			imageFile.preview = URL.createObjectURL(file);
			imageFile.file = file;
		}
	}

	function handleIconUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			iconFile.preview = URL.createObjectURL(file);
			iconFile.file = file;
		}
	}

	function resetForm() {
		createCategoryLanguage = { en: '' };
		imageFile = {};
		iconFile = {};
		createCategory = { title: 0, image: '' };
	}
</script>

<Drawer 
	bind:hidden 
	width="w-[520px]" 
	class="transition-transform duration-300"
	on:close={resetForm}
>
	<div class="h-full overflow-y-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8">
		<h2 class="text-2xl font-bold mb-8 bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-transparent">
			{m.addCategory()}
		</h2>
		<form onsubmit={handleAddCategory} class="space-y-6">
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
							onchange={handleImageUpload}
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
							onchange={handleIconUpload}
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
						hidden = true;
						resetForm();
					}}>{m.cancel()}</Button
				>
			</div>
		</form>
	</div>
</Drawer> 