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
		type InsertService,
		type InsertLanguage,
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
	import type { UserEntity } from '$lib/Model/Entity/User';
	import type { LanguageEntity } from '$lib/Model/Entity/Language';
	import type { ServiceEntity } from '$lib/Model/Entity/Service';
	import { checkPremissionOnRoute } from '$lib/Utils/CheckPremission';
	import { Action } from '$lib/Model/Action/Action';

	const { startUpload } = createUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			console.log('Upload completed');
		},
		onUploadError: (error) => {
			console.error('Upload error:', error);
		}
	});
	let users = $state<UserEntity[]>([]);
	onMount(async () => {
		users =
			(await userStore.fetchForDropdown({
				limit: 100,
				select: 'id,name'
			})) ?? [];
	});

	let isLoading = $state(false);
	let createService = $state<InsertService>({
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

	let titleLanguage = $state<InsertLanguage>({
		en: ''
	});
	let descriptionLanguage = $state<InsertLanguage>({
		en: ''
	});

	let demoFile = $state<{
		file?: File;
		preview?: string;
		isUploading?: boolean;
	}>({
		file: undefined,
		preview: undefined,
		isUploading: false
	});

	let mediaLanguage = $state<{
		en: {
			file?: File;
			preview?: string;
		};
		ar: {
			file?: File;
			preview?: string;
		};
		ckb: {
			file?: File;
			preview?: string;
		};
	}>({
		en: {
			file: undefined,
			preview: undefined
		},
		ar: {
			file: undefined,
			preview: undefined
		},
		ckb: {
			file: undefined,
			preview: undefined
		}
	});

	// Available languages for support
	const supportLanguages = Object.values(Languages);

	const availableTags = Object.values(Tags);

	async function handleAddService() {
		if (isLoading) return;
		isLoading = true;
		let titleResponse: LanguageEntity | null = null;
		let descriptionResponse: LanguageEntity | null = null;
		let mediaResponse: LanguageEntity | null = null;
		let serviceResponse: ServiceEntity | undefined = undefined;
		try {
			// Create language entries for title and description
			titleResponse = await languageStore.insert(titleLanguage);
			descriptionResponse = await languageStore.insert(descriptionLanguage);

			// Handle media uploads and create media language entries
			let mediaUrls: InsertLanguage = { en: '' };

			// Upload English media first (required)
			if (mediaLanguage.en.file) {
				mediaUrls.en = await storageStore.uploadFile(mediaLanguage.en.file, startUpload);
			}

			// Upload Arabic media if exists
			if (mediaLanguage.ar.file) {
				mediaUrls.ar = await storageStore.uploadFile(mediaLanguage.ar.file, startUpload);
			}

			// Upload Kurdish media if exists
			if (mediaLanguage.ckb.file) {
				mediaUrls.ckb = await storageStore.uploadFile(mediaLanguage.ckb.file, startUpload);
			}

			// Create media language entry
			mediaResponse = await languageStore.insert(mediaUrls);

			// Upload demo file if exists
			if (demoFile.file) {
				createService.demo = await storageStore.uploadFile(demoFile.file, startUpload);
			}

			// Set all IDs in createService
			createService.title = titleResponse?.id ?? null;
			createService.description = descriptionResponse?.id ?? null;
			createService.media = mediaResponse?.id ?? null;
			createService.created_by = $authStore?.id ?? null;

			// Create service
			serviceResponse = await serviceStore.insert(createService);
			toastStore.success(m.success());
			goto('/services/1');
		} catch (error) {
			if (titleResponse && titleResponse.id) languageStore.remove(titleResponse.id);
			if (descriptionResponse && descriptionResponse.id)
				languageStore.remove(descriptionResponse.id);
			if (mediaResponse && mediaResponse.id) languageStore.remove(mediaResponse.id);
			if (serviceResponse && serviceResponse.id) serviceStore.remove(serviceResponse.id);
			if (error instanceof Error) toastStore.error(error.message);
		} finally {
			isLoading = false;
		}
	}

	function handleDemoUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			// Revoke previous preview URL to prevent memory leaks
			if (demoFile.preview) {
				URL.revokeObjectURL(demoFile.preview);
			}
			demoFile.preview = URL.createObjectURL(file);
			demoFile.file = file;
		}
	}
</script>

<div class="container mx-auto p-8 flex flex-col w-full justify-center items-center">
	<div class="w-full mb-6 flex flex-col items-start justify-center gap-12">
		<Button color="alternative" class="mr-4" on:click={() => goto('/services/1')}>
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<i class="fas fa-arrow-left mr-2" />
			{m.back()}
		</Button>
		<h1
			class="bg-gradient-to-r from-primary-light-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent"
		>
			{m.addService()}
		</h1>
	</div>

	<form
		onsubmit={handleAddService}
		class="w-full space-y-6 rounded-xl  p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<Tabs style="underline" class="mb-4 grid grid-cols-3 justify-center items-center w-full">
			{#each Object.keys(Languages) as language}
				<TabItem open={language === Languages.EN} title={language} activeClasses="w-full p-4 text-blue-light bg-blue-light/20 rounded-t-lg "
				inactiveClasses="w-full p-4 text-primary-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-white">
					<!-- Title -->
					<div class="mb-6 space-y-2">
						<Label class="text-lg font-medium">{m.title()}</Label>
						<Input
							class="w-full bg-grey-light dark:bg-grey-secondary border-0 transition-all duration-300"
							bind:value={titleLanguage[language.toLowerCase() as keyof InsertLanguage]}
							required={language === Languages.EN}
						/>
					</div>

					<!-- Description -->
					<div class="mb-6 space-y-2">
						<Label class="text-lg font-medium">{m.description()}</Label>
						<!-- svelte-ignore element_invalid_self_closing_tag -->
						<textarea
							class="w-full rounded-lg border-0 p-2.5 transition-all duration-300 hover:border-primary-light-500 bg-grey-light dark:bg-grey-secondary"
							rows="4"
							bind:value={descriptionLanguage[language.toLowerCase() as keyof InsertLanguage]}
							required={language === Languages.EN}
						/>
					</div>

					<!-- Media Upload -->
					<div class="mb-6 space-y-2">
						<Label class="text-lg font-medium">{m.media()}</Label>
						<div class="flex justify-center">
							<div
								class="relative h-64 w-full overflow-hidden rounded-lg bg-grey-light transition-all duration-300 hover:shadow-lg dark:bg-grey-secondary"
							>
								{#if mediaLanguage[language.toLowerCase() as keyof typeof mediaLanguage].preview}
									<Img
										src={mediaLanguage[language.toLowerCase() as keyof typeof mediaLanguage]
											.preview}
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
											mediaLanguage[lang as keyof typeof mediaLanguage].file = file;
											mediaLanguage[lang as keyof typeof mediaLanguage].preview = url;
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
				<Input type="number" bind:value={createService.price} required min="0" step="0.01"
				class="border-0 w-full h-12 bg-grey-light dark:bg-grey-secondary"
				/>
			</div>

			<!-- Supports -->
			<div class="space-y-2">
				<Label class="text-lg font-medium">{m.supports()}</Label>
				<MultiSelect
					class="transition-all duration-300 hover:border-primary-light-500 bg-grey-light dark:bg-grey-secondary border-0"
					items={supportLanguages.map((language) => ({
						value: language,
						name: m[language]()
					}))}
					bind:value={createService.supports as (string | number)[]}
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
					bind:value={createService.tags as (string | number)[]}
					placeholder={m.select_tags()}
					class="transition-all duration-300 hover:border-primary-light-500 bg-grey-light dark:bg-grey-secondary border-0"
				/>
			</div>

			<!-- Demo Upload -->
			<div class="space-y-3">
				<Label class="text-lg font-medium">{m.demo()}</Label>
				<div class="flex justify-center">
					<div
						class="relative h-64 w-full max-w-md overflow-hidden rounded-lg bg-grey-light transition-all duration-300 hover:shadow-lg dark:bg-grey-secondary"
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
							onchange={handleDemoUpload}
							class="hidden"
						/>
					</div>
				</div>
			</div>

			<!-- Supervisor Selection -->
			<div class="space-y-2">
				<Label class="text-lg font-medium">{m.supervisor()}</Label>
				<Select
					class="transition-all duration-300 hover:border-primary-light-500 bg-grey-light dark:bg-grey-secondary border-0"
					bind:value={createService.supervised_by}
					items={users.map((user) => ({
						value: user.id,
						name: user.name ?? ''
					}))}
					placeholder={m.select_supervisor()}
				/>
			</div>

			<!-- Submit Buttons -->
			<div class="flex gap-3 pt-4">
				{#if checkPremissionOnRoute($authStore!, [Action.CREATE_SERVICE], $authStore?.role?.name)}
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
</div>
