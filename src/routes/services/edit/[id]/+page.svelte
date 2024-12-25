<script lang="ts">
	import {
		Button,
		Input,
		Label,
		Tabs,
		TabItem,
		Img,
		Spinner,
		MultiSelect,
		Select
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import {
		Languages,
		type UpdateService,
		type UpdateLanguage,
		Tags
	} from '$lib/Supabase/Types/database.types';
	import { languageStore } from '$lib/Store/Language';
	import { storageStore } from '$lib/Store/Storage';
	import { toastStore } from '$lib/Store/Toast';
	import { serviceStore } from '$lib/Store/Service';
	import { createUploadThing } from '$lib/Utils/Uploadthing';
	import { authStore } from '$lib/Store/Auth';
	import { onMount } from 'svelte';
	import { userStore } from '$lib/Store/User';
	import { page } from '$app/stores';
	import type { UserEntity } from '$lib/Model/Entity/User';
	import type { ServiceEntity } from '$lib/Model/Entity/Service';
	import type { LanguageEntity } from '$lib/Model/Entity/Language';
	import { checkPremissionOnRoute } from '$lib/Utils/CheckPremission';
	import { Action } from '$lib/Model/Action/Action';
	import RichTextEditor from '$lib/Component/RichTextEditor.svelte';

	const { startUpload } = createUploadThing('imageUploader');

	let users = $state<UserEntity[]>([]);
	let isLoading = $state(false);

	let editService = $state<UpdateService>({
		id: 0,
		title: 0,
		description: 0,
		media: 0,
		price: 0,
		supports: [],
		tags: [],
		demo: '',
		supervised_by: null,
		created_by: $authStore?.id ?? null
	});

	let titleLanguage = $state<UpdateLanguage>({
		id: 0,
		en: '',
		ar: null,
		ckb: null
	});

	let descriptionLanguage = $state<UpdateLanguage>({
		id: 0,
		en: '',
		ar: null,
		ckb: null
	});

	let mediaLanguage = $state<UpdateLanguage>({
		id: 0,
		en: '',
		ar: null,
		ckb: null
	});

	let mediaFiles = $state<{
		en: { file?: File; preview?: string };
		ar: { file?: File; preview?: string };
		ckb: { file?: File; preview?: string };
	}>({
		en: { file: undefined, preview: undefined },
		ar: { file: undefined, preview: undefined },
		ckb: { file: undefined, preview: undefined }
	});

	let demoFile = $state<{
		file?: File;
		preview?: string;
	}>({
		file: undefined,
		preview: undefined
	});

	const supportLanguages = Object.values(Languages);
	const availableTags = Object.values(Tags);

	async function getService(id: number) {
		isLoading = true;
		try {
			const service = await serviceStore.fetch(id);
			if (!service) return;

			editService = {
				id: service.id,
				title: service.title.id,
				description: service.description?.id ?? null,
				media: service.media?.id ?? null,
				price: service.price,
				supports: service.supports,
				tags: service.tags,
				demo: service.demo,
				supervised_by: service.supervised_by?.id ?? null,
				created_by: service.created_by?.id ?? null
			};

			titleLanguage = {
				id: service.title.id,
				en: service.title.en,
				ar: service.title.ar,
				ckb: service.title.ckb
			};

			descriptionLanguage = {
				id: service.description?.id ?? 0,
				en: service.description?.en ?? '',
				ar: service.description?.ar ?? '',
				ckb: service.description?.ckb ?? ''
			};

			mediaLanguage = {
				id: service.media?.id ?? 0,
				en: service.media?.en ?? '',
				ar: service.media?.ar ?? '',
				ckb: service.media?.ckb ?? ''
			};

			// Set previews
			if (service.media?.en) mediaFiles.en.preview = service.media.en;
			if (service.media?.ar) mediaFiles.ar.preview = service.media.ar;
			if (service.media?.ckb) mediaFiles.ckb.preview = service.media.ckb;
			if (service.demo) demoFile.preview = service.demo;
		} catch (error) {
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			isLoading = false;
		}
	}

	async function handleEditService() {
		if (isLoading) return;
		isLoading = true;

		let backupTitle = titleLanguage;
		let backupDescription = descriptionLanguage;
		let backupMedia = mediaLanguage;
		let backupService = editService;

		try {
			// Update languages
			const titleResponse = await languageStore.put(titleLanguage);
			const descriptionResponse = await languageStore.put(descriptionLanguage);

			// Handle media uploads
			let mediaUrls: UpdateLanguage = { ...mediaLanguage };

			// Upload new media files if they exist
			for (const lang of ['en', 'ar', 'ckb'] as const) {
				if (mediaFiles[lang].file) {
					mediaUrls[lang] = await storageStore.uploadFile(mediaFiles[lang].file, startUpload);
				}
			}

			const mediaResponse = await languageStore.put(mediaUrls);

			// Upload new demo if it exists
			if (demoFile.file) {
				editService.demo = await storageStore.uploadFile(demoFile.file, startUpload);
			}

			// Update service
			editService.title = titleResponse?.id ?? editService.title;
			editService.description = descriptionResponse?.id ?? editService.description;
			editService.media = mediaResponse?.id ?? editService.media;

			await serviceStore.put(editService);
			toastStore.success(m.success());
			goto('/services/1');
		} catch (error) {
			// Rollback changes if error occurs
			if (titleLanguage.id) await languageStore.put(backupTitle);
			if (descriptionLanguage.id) await languageStore.put(backupDescription);
			if (mediaLanguage.id) await languageStore.put(backupMedia);
			if (editService.id) await serviceStore.put(backupService);

			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			isLoading = false;
		}
	}

	onMount(async () => {
		const id = Number($page.params.id);
		if (id) {
			await getService(id);
		}

		users =
			(await userStore.fetchForDropdown({
				limit: 100,
				select: 'id,name'
			})) ?? [];
	});
</script>

<!-- The rest of the template is very similar to add page, just bind to editService instead of createService -->
<!-- I'll show the key differences in the template -->

<div class="container mx-auto p-8">
	<div class="mb-6 flex flex-col items-start justify-center gap-12">
		<Button color="alternative" class="mr-4" on:click={() => goto('/services/1')}>
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<i class="fas fa-arrow-left mr-2" />
			{m.back()}
		</Button>
		<h1
			class="bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent"
		>
			{m.editService()}
		</h1>
	</div>

	{#if isLoading}
		<div class="flex justify-center p-12">
			<Spinner size="12" class="text-primary-light-500" />
		</div>
		<!-- After the loading check, add this form section -->
	{:else}
		<form
			onsubmit={handleEditService}
			class="w-full space-y-6 rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
		>
			<Tabs style="underline" class="mb-4 grid grid-cols-3 justify-center items-center w-full">
				{#each Object.keys(Languages) as language}
					<TabItem open={language === Languages.EN} title={language} activeClasses="w-full p-4 text-blue-light bg-blue-light/20 rounded-t-lg "
					inactiveClasses="w-full p-4 text-primary-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-white">
						<!-- Title -->
						<div class="mb-6 space-y-2">
							<Label class="text-lg font-medium">{m.title()}</Label>
							<Input
								class="w-full border-0 transition-all duration-300"
								bind:value={titleLanguage[language.toLowerCase() as keyof UpdateLanguage]}
								required={language === Languages.EN}
							/>
						</div>

						<!-- Description -->
						<div class="mb-6 space-y-2">
							<Label class="text-lg font-medium">{m.description()}</Label>
							<RichTextEditor
								content={descriptionLanguage[language.toLowerCase() as keyof UpdateLanguage] ?? ''}
								placeholder={m.description()}
								onChange={(html) => {
									const lang = language.toLowerCase() as keyof UpdateLanguage;
									(descriptionLanguage[lang] as any) = html;
								}}
							/>
						</div>

						<!-- Media Upload -->
						<div class="mb-6 space-y-2">
							<Label class="text-lg font-medium">{m.media()}</Label>
							<div class="flex justify-center">
								<div
									class="relative h-64 w-full max-w-md overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-lg"
								>
									{#if mediaFiles[language.toLowerCase() as keyof typeof mediaFiles].preview}
										<Img
											src={mediaFiles[language.toLowerCase() as keyof typeof mediaFiles].preview}
											alt="Preview"
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full flex-col items-center justify-center">
											<span class="mb-2 text-gray-500">{m.no_media_selected()}</span>
											<Button>
												<span class="mr-2">+</span>
												{m.add_image()}
											</Button>
										</div>
									{/if}
									<input
										type="file"
										accept="image/*"
										onchange={(e) => {
											const input = e.target as HTMLInputElement;
											const file = input.files?.[0];
											if (file) {
												const url = URL.createObjectURL(file);
												const lang = language.toLowerCase();
												mediaFiles[lang as keyof typeof mediaFiles].file = file;
												mediaFiles[lang as keyof typeof mediaFiles].preview = url;
											}
										}}
										class="absolute inset-0 cursor-pointer opacity-0"
									/>
								</div>
							</div>
						</div>
					</TabItem>
				{/each}
			</Tabs>

			<!-- Non-language specific fields -->
			<div class="space-y-6">
				<!-- Price -->
				<div class="space-y-2">
					<Label class="text-lg font-medium">{m.price()}</Label>
					<Input type="number" bind:value={editService.price} required min="0" step="0.01" />
				</div>

				<!-- Supports -->
				<div class="space-y-2">
					<Label class="text-lg font-medium">{m.supports()}</Label>
					<MultiSelect
						class="transition-all duration-300 hover:border-primary-light-500"
						items={supportLanguages.map((language) => ({
							value: language,
							name: m[language]()
						}))}
						bind:value={editService.supports as (string | number)[]}
						placeholder={m.select_supported_languages()}
					/>
				</div>

				<!-- Tags -->
				<div class="space-y-2">
					<Label class="text-lg font-medium">{m.tags()}</Label>
					<MultiSelect
						items={availableTags.map((tag) => ({
							value: tag,
							name: m[tag]()
						}))}
						bind:value={editService.tags as (string | number)[]}
						placeholder={m.select_tags()}
					/>
				</div>

				<!-- Demo Upload -->
				<div class="space-y-3">
					<Label class="text-lg font-medium">{m.demo()}</Label>
					<div class="flex justify-center">
						<div
							class="relative h-64 w-full max-w-md overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-lg dark:bg-grey-secondary"
						>
							{#if demoFile.preview}
								<div class="relative h-full">
									<video
										src={demoFile.preview}
										controls
										controlsList="nodownload"
										class="h-full w-full object-contain"
									>
										<track kind="captions" />
									</video>
									<div class="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
										<Button
											size="sm"
											color="blue"
											on:click={() => {
												document.getElementById('demo-upload')?.click();
											}}
										>
											<i class="fas fa-video mr-2"></i>
											{m.add_demo()}
										</Button>
										<Button
											size="sm"
											color="red"
											on:click={() => {
												if (demoFile.preview) {
													URL.revokeObjectURL(demoFile.preview);
												}
												demoFile = { file: undefined, preview: undefined };
												editService.demo = '';
											}}
										>
											{m.remove()}
										</Button>
									</div>
								</div>
							{:else}
								<div
									class="flex h-full w-full flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
								>
									<span class="mb-2 text-gray-500">{m.no_demo_selected()}</span>
									<Button
										on:click={() => {
											document.getElementById('demo-upload')?.click();
										}}
										class="transition-all duration-300 hover:scale-105"
									>
										<i class="fas fa-video mr-2"></i>
										{m.add_demo()}
									</Button>
								</div>
							{/if}
							<input
								id="demo-upload"
								type="file"
								accept="video/*"
								onchange={(e) => {
									const input = e.target as HTMLInputElement;
									const file = input.files?.[0];
									if (file) {
										if (demoFile.preview) {
											URL.revokeObjectURL(demoFile.preview);
										}
										demoFile.preview = URL.createObjectURL(file);
										demoFile.file = file;
									}
								}}
								class="hidden"
							/>
						</div>
					</div>
				</div>

				<!-- Supervisor Selection -->
				<div class="space-y-2">
					<Label class="text-lg font-medium">{m.supervisor()}</Label>
					<Select
						class="transition-all duration-300 hover:border-primary-light-500"
						bind:value={editService.supervised_by}
						items={users.map((user) => ({
							value: user.id,
							name: user.name ?? ''
						}))}
						placeholder={m.select_supervisor()}
					/>
				</div>

				<!-- Submit Buttons -->
				<div class="flex gap-3 pt-4">
					{#if checkPremissionOnRoute($authStore!, [Action.UPDATE_SERVICE], $authStore?.role?.name)}
						<Button
							type="submit"
							class="flex-1 bg-blue-light text-white transition-all duration-300 hover:scale-105 hover:bg-blue-light/90"
							disabled={isLoading}
						>
							{#if isLoading}
								<Spinner class="mr-3" size="4" color="white" />
							{/if}
							{m.save()}
						</Button>
					{/if}
					<Button
						color="alternative"
						class="flex-1 transition-all duration-300 hover:scale-105 hover:bg-gray-200"
						on:click={() => goto('/services/1')}
					>
						{m.cancel()}
					</Button>
				</div>
			</div>
		</form>
	{/if}
</div>
