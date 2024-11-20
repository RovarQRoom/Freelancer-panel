<script lang="ts">
	import { Button, Input, Label, Tabs, TabItem, Spinner, Modal, Img } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		Languages,
		type InsertLanguage,
		type InsertExtraService
	} from '$lib/Supabase/Types/database.types';
	import { languageStore } from '$lib/Store/Language';
	import { toastStore } from '$lib/Store/Toast';
	import { LanguageEntity } from '$lib/Model/Entity/Language';
	import { extraServiceStore } from '$lib/Store/ExtraService';
	import type { ExtraServiceEntity } from '$lib/Model/Entity/ExtraService';
	import { checkPremissionOnRoute } from '$lib/Utils/CheckPremission';
	import { authStore } from '$lib/Store/Auth';
	import { Action } from '$lib/Model/Action/Action';
	import { storageStore } from '$lib/Store/Storage';
	import { createUploadThing } from '$lib/Utils/Uploadthing';

	let { open = $bindable(false), serviceId = $bindable<number | null>(null) } = $props<{
		open: boolean;
		serviceId: number | null;
	}>();

	let loadingAdd = $state(false);
	let createExtraService = $state<InsertExtraService>({
		title: 0,
		description: 0,
		price: 0,
		icon: '',
		service: serviceId ?? 0
	});
	let createTitleLanguage = $state<InsertLanguage>({
		en: ''
	});
	let createDescriptionLanguage = $state<InsertLanguage>({
		en: ''
	});

	const { startUpload } = createUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			console.log('Upload completed');
		},
		onUploadError: (error) => {
			console.error('Upload error:', error);
		}
	});

	let iconFile = $state<{ file?: File; preview?: string }>({
		file: undefined,
		preview: undefined
	});

	async function handleAdd() {
		if (loadingAdd || !serviceId) return;
		loadingAdd = true;
		let titleResponse: LanguageEntity | undefined;
		let descriptionResponse: LanguageEntity | undefined;
		let extraServiceResponse: ExtraServiceEntity | undefined;
		try {
			titleResponse = await languageStore.insert(createTitleLanguage);
			descriptionResponse = await languageStore.insert(createDescriptionLanguage);
			if (iconFile.file) {
				createExtraService.icon = await storageStore.uploadFile(iconFile.file, startUpload);
			}
			createExtraService.title = titleResponse?.id ?? 0;
			createExtraService.description = descriptionResponse?.id ?? 0;
			createExtraService.service = serviceId;
			extraServiceResponse = await extraServiceStore.insert(createExtraService);
			toastStore.success(m.success());
		} catch (error) {
			if (titleResponse?.id) {
				await languageStore.remove(titleResponse.id);
			}
			if (descriptionResponse?.id) {
				await languageStore.remove(descriptionResponse.id);
			}
			if (extraServiceResponse?.id) {
				await extraServiceStore.remove(extraServiceResponse.id);
			}
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			loadingAdd = false;
			open = false;
			resetForm();
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
		createTitleLanguage = { en: '' };
		createDescriptionLanguage = { en: '' };
		createExtraService = { title: 0, description: 0, price: 0, icon: '', service: serviceId ?? 0 };
		iconFile = { file: undefined, preview: undefined };
	}
</script>

<Modal bind:open size="lg" autoclose={false} on:close={resetForm}>
	<div class="p-4">
		<h3 class="mb-4 text-xl font-bold">{m.addExtraService()}</h3>
		<form class="space-y-4">
			<Tabs style="underline">
				{#each Object.keys(Languages) as language}
					<TabItem open={language === Languages.EN} title={language}>
						<div class="space-y-4">
							<div class="space-y-2">
								<Label>{m.title()}</Label>
								<Input
									class="w-full"
									bind:value={createTitleLanguage[language.toLowerCase() as keyof InsertLanguage]}
									required={language === Languages.EN}
								/>
							</div>
							<div class="space-y-2">
								<Label>{m.description()}</Label>
								<Input
									class="w-full"
									bind:value={createDescriptionLanguage[language.toLowerCase() as keyof InsertLanguage]}
									required={language === Languages.EN}
								/>
							</div>
						</div>
					</TabItem>
				{/each}
			</Tabs>

			<div class="space-y-2">
				<Label>{m.price()}</Label>
				<Input type="number" bind:value={createExtraService.price} required min="0" step="0.01" />
			</div>

			<div class="space-y-3">
				<Label>{m.icon()}</Label>
				<div class="flex justify-start">
					<div
						class="relative h-20 w-20 overflow-hidden rounded-lg bg-main-light-100
						transition-all duration-200 hover:shadow-lg dark:bg-main-dark-100"
					>
						{#if iconFile.preview}
							<Img
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

			<div class="flex justify-end gap-3">
				{#if checkPremissionOnRoute($authStore!, [Action.CREATE_EXTRA_SERVICE], $authStore?.role?.name)}
					<Button
						type="submit"
						class="bg-primary-light-500 text-white"
						on:click={handleAdd}
						disabled={loadingAdd}
					>
						{#if loadingAdd}
							<Spinner class="mr-3" size="4" color="white" />
						{/if}
						{m.save()}
					</Button>
				{/if}
				<Button color="alternative" on:click={() => (open = false)}>
					{m.cancel()}
				</Button>
			</div>
		</form>
	</div>
</Modal> 