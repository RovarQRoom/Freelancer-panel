<script lang="ts">
	import { Button, Input, Label, Tabs, TabItem, Spinner, Modal, Img } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		Languages,
		type UpdateLanguage,
		type UpdateExtraService
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

	let { open = $bindable(false), extraServiceId = $bindable<number | null>(null) } = $props<{
		open: boolean;
		extraServiceId: number | null;
	}>();

	let loadingEdit = $state(false);
	let isLoading = $state(false);

	let editExtraService = $state<UpdateExtraService>({
		id: 0,
		title: 0,
		description: 0,
		price: 0,
		icon: '',
		service: 0
	});

	let editTitleLanguage = $state<UpdateLanguage>({
		id: 0,
		en: '',
		ar: null,
		ckb: null
	});

	let editDescriptionLanguage = $state<UpdateLanguage>({
		id: 0,
		en: '',
		ar: null,
		ckb: null
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

	async function getExtraService(id: number) {
		isLoading = true;
		try {
			const extraService = await extraServiceStore.fetch(id);
			if (!extraService) return;

			editExtraService = {
				id: extraService.id,
				title: extraService.title.id,
				description: extraService.description?.id ?? 0,
				price: extraService.price,
				icon: extraService.icon ?? '',
				service: extraService.service.id
			};

			editTitleLanguage = {
				id: extraService.title.id,
				en: extraService.title.en,
				ar: extraService.title.ar,
				ckb: extraService.title.ckb
			};

			editDescriptionLanguage = {
				id: extraService.description?.id ?? 0,
				en: extraService.description?.en ?? '',
				ar: extraService.description?.ar ?? null,
				ckb: extraService.description?.ckb ?? null
			};

			if (extraService.icon) {
				iconFile.preview = extraService.icon;
			}
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			isLoading = false;
		}
	}

	async function handleEdit() {
		if (loadingEdit || !extraServiceId) return;
		loadingEdit = true;

		let backupTitle = editTitleLanguage;
		let backupDescription = editDescriptionLanguage;
		let backupExtraService = editExtraService;
		let extraServiceResponse: ExtraServiceEntity | undefined;

		try {
			const titleResponse = await languageStore.put(editTitleLanguage);
			const descriptionResponse = await languageStore.put(editDescriptionLanguage);

			if (iconFile.file) {
				editExtraService.icon = await storageStore.uploadFile(iconFile.file, startUpload);
			}

			editExtraService.title = titleResponse?.id ?? editExtraService.title;
			editExtraService.description = descriptionResponse?.id ?? editExtraService.description;

			extraServiceResponse = await extraServiceStore.put(editExtraService);
			toastStore.success(m.success());
		} catch (error) {
			if (editTitleLanguage.id) await languageStore.put(backupTitle);
			if (editDescriptionLanguage.id) await languageStore.put(backupDescription);
			if (editExtraService.id) await extraServiceStore.put(backupExtraService);

			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			loadingEdit = false;
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
		editTitleLanguage = { id: 0, en: '', ar: null, ckb: null };
		editDescriptionLanguage = { id: 0, en: '', ar: null, ckb: null };
		editExtraService = { id: 0, title: 0, description: 0, price: 0, icon: '', service: 0 };
		iconFile = { file: undefined, preview: undefined };
	}

	$effect(() => {
		if (extraServiceId) {
			getExtraService(extraServiceId);
		}
	});
</script>

<Modal bind:open size="lg" autoclose={false} on:close={resetForm}>
	{#if isLoading}
		<div class="flex h-64 items-center justify-center">
			<Spinner size="12" class="text-primary-light-500" />
		</div>
	{:else}
		<div class="p-4">
			<h3 class="mb-4 text-xl font-bold">{m.editExtraService()}</h3>
			<form class="space-y-4">
				<Tabs style="underline">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<div class="space-y-4">
								<div class="space-y-2">
									<Label>{m.title()}</Label>
									<Input
										class="w-full"
										bind:value={editTitleLanguage[language.toLowerCase() as keyof UpdateLanguage]}
										required={language === Languages.EN}
									/>
								</div>
								<div class="space-y-2">
									<Label>{m.description()}</Label>
									<Input
										class="w-full"
										bind:value={editDescriptionLanguage[
											language.toLowerCase() as keyof UpdateLanguage
										]}
										required={language === Languages.EN}
									/>
								</div>
							</div>
						</TabItem>
					{/each}
				</Tabs>

				<div class="space-y-2">
					<Label>{m.price()}</Label>
					<Input type="number" bind:value={editExtraService.price} required min="0" step="0.01" />
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
					{#if checkPremissionOnRoute($authStore!, [Action.UPDATE_EXTRA_SERVICE], $authStore?.role?.name)}
						<Button
							type="submit"
							class="bg-primary-light-500 text-white"
							on:click={handleEdit}
							disabled={loadingEdit}
						>
							{#if loadingEdit}
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
	{/if}
</Modal> 