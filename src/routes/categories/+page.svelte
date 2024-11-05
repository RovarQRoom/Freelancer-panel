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
		Img
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		Languages,
		type InsertCategory,
		type InsertLanguage
	} from '$lib/Supabase/Types/database.types';
	import { z } from 'zod';
	import { onMount } from 'svelte';
	import { categoryStore } from '$lib/Store/Category';
	import { languageTag } from '$lib/paraglide/runtime';
	import type { GenericListOptions } from '$lib/Model/Common/ListOption';
	let hideSidebar = true;
	// Define the schema
	const categorySchema = z.object({
		title: z.number(),
		image: z.string(),
		icon: z.string().optional()
	});
	const languageSchema = z.object({
		[Languages.EN.toLowerCase()]: z.string(),
		[Languages.AR.toLowerCase()]: z.string().optional(),
		[Languages.CKB.toLowerCase()]: z.string().optional()
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

	onMount(async () => {
		await categoryStore.fetchAll();
	});

	function handleAddCategory() {
		// Implement your add category logic here
		hideSidebar = true;
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

	<Table hoverable={true} class="transition-all duration-200">
		<TableHead>
			<TableHeadCell>{m.id()}</TableHeadCell>
			<TableHeadCell>{m.title()}</TableHeadCell>
			<TableHeadCell>{m.image()}</TableHeadCell>
			<TableHeadCell>{m.icon()}</TableHeadCell>
			<TableHeadCell>{m.action()}</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each $categoryStore.data as category}
				<TableBodyRow class="hover:bg-main-light-50 dark:hover:bg-main-dark-50 transition-colors duration-200">
					<TableBodyCell>{category.id}</TableBodyCell>
					<TableBodyCell>{category.title[languageTag()]}</TableBodyCell>
					<TableBodyCell>
						<Img src={category.image} alt="category" class="h-10 w-10 rounded object-cover" />
					</TableBodyCell>
					<TableBodyCell>
						{#if category.icon}
							<i class={category.icon}></i>
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						<Button
							size="sm"
							class="mr-2 bg-secondary-light-500 text-white hover:bg-secondary-light-600 
							dark:bg-secondary-dark-500 dark:hover:bg-secondary-dark-600 transition-all duration-200 
							transform hover:scale-105"
							>Edit</Button>
						<Button
							size="sm"
							class="bg-primary-light-500 text-white hover:bg-primary-light-600 
							dark:bg-primary-dark-500 dark:hover:bg-primary-dark-600 transition-all duration-200 
							transform hover:scale-105"
							>Delete</Button>
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

			<div class="flex gap-3 pt-4">
				<Button
					type="submit"
					class="flex-1 bg-primary-light-500 text-white hover:bg-primary-light-600 
					dark:bg-primary-dark-500 dark:hover:bg-primary-dark-600 transition-all duration-200 
					transform hover:scale-105"
					>{m.save()}</Button>
				<Button
					color="alternative"
					class="flex-1 bg-main-light-200 hover:bg-main-light-300 dark:bg-main-dark-200 
					dark:hover:bg-main-dark-300 transition-all duration-200 transform hover:scale-105"
					on:click={() => (hideSidebar = true)}>{m.cancel()}</Button>
			</div>
		</form>
	</div>
</Drawer>
