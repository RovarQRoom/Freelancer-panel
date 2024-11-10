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
	import { Languages, type UpdateCategory, type UpdateLanguage } from '$lib/Supabase/Types/database.types';
	import { categoryStore } from '$lib/Store/Category';
	import { languageStore } from '$lib/Store/Language';
	import { storageStore } from '$lib/Store/Storage';
	import { toastStore } from '$lib/Store/Toast';
	import { CategoryEntity } from '$lib/Model/Entity/Category';
	import { LanguageEntity } from '$lib/Model/Entity/Language';
	import { createUploadThing } from '$lib/Utils/Uploadthing';

	let { hidden = $bindable(true), categoryId = $bindable<number | null>(null) } = $props<{ hidden: boolean; categoryId: number | null }>();

	const { startUpload } = createUploadThing('imageUploader');

	let editCategory = $state<UpdateCategory>({
		id: 0,
		title: 0,
		image: '',
		icon: null
	});
	let editCategoryLanguage = $state<UpdateLanguage>({
		id: 0,
		en: '',
		ar: null,
		ckb: null
	});
	let imageFile = $state<{ file?: File; preview?: string }>({ file: undefined, preview: undefined });
	let iconFile = $state<{ file?: File; preview?: string }>({ file: undefined, preview: undefined });

	let isLoading = $state(false);

	async function getCategory(id: number) {
		isLoading = true;
		try {
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
		} finally {
			isLoading = false;
		}
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
		editCategoryLanguage = {
			id: 0,
			en: '',
			ar: null,
			ckb: null
		};
		imageFile = { file: undefined, preview: undefined };
		iconFile = { file: undefined, preview: undefined };
		editCategory = {
			id: 0,
			title: 0,
			image: '',
			icon: null
		};
	}

	$effect(() => {
		if (categoryId) {
			getCategory(categoryId);
		}
	});
</script>

<Drawer 
	bind:hidden 
	width="w-[480px]" 
	class="transition-transform duration-300"
	on:close={resetForm}
>
	<div class="h-full overflow-y-auto bg-main-light-50 p-6 dark:bg-main-dark-50">
		<h2 class="mb-6 text-2xl font-bold text-main-light-900 dark:text-main-dark-900">
			{m.editCategory()}
		</h2>
		{#if isLoading}
			<div class="flex h-[calc(100%-4rem)] items-center justify-center">
				<Spinner size="12" class="text-primary-light-500 dark:text-primary-dark-500" />
			</div>
		{:else}
			<form onsubmit={handleEditCategory} class="space-y-6">
				<div class="space-y-2">
					<Label class="text-lg font-medium">{m.title()}</Label>
					<Tabs style="underline" class="mb-4">
						{#each Object.keys(Languages) as language}
							<TabItem open={language === Languages.EN} title={language}>
								<Input
									class="w-full transition-all duration-200 focus:ring-2 focus:ring-primary-light-500"
									bind:value={editCategoryLanguage[language.toLowerCase() as keyof UpdateLanguage]}
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
					>
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
		{/if}
	</div>
</Drawer> 