<script lang="ts">
	import {
		MultiSelect,
		Button,
		Modal,
		Tabs,
		TabItem,
		Input,
		Label,
		Textarea
	} from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		Languages,
		type InsertLanguage,
		type InsertSubcategory
	} from '$lib/Supabase/Types/database.types';
	import { CirclePlusSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { subcategoryStore } from '$lib/Store/Subcategory';
	import { languageTag } from '$lib/paraglide/runtime';
	import type { LanguageEntity } from '$lib/Model/Entity/Language';
	import { languageStore } from '$lib/Store/Language';
	import type { SubcategoryEntity } from '$lib/Model/Entity/Subcategory';
	import { toastStore } from '$lib/Store/Toast';

	export let selected: string[] = [];
	export let categoryId: number | null = null;
	let upsertSubcategoryTitle: InsertLanguage = {
		en: ''
	};
	let upsertSubcategoryDescription: InsertLanguage = {
		en: ''
	};
	let upsertSubcategory: InsertSubcategory = {
		title: 0
	};
	let showModal = false;

	onMount(async () => {
		await subcategoryStore.fetchAll({
			select: `id, title(en, ar, ckb), description(en, ar, ckb)`,
			fieldOption: 'category',
			isEmpty: true,
			equal: categoryId?.toString()
		});
	});

	async function handleUpsert() {
		let titleResponse: LanguageEntity | undefined;
		let descriptionResponse: LanguageEntity | undefined;
		let subcategoryResponse: SubcategoryEntity | undefined;
		try {
			titleResponse = upsertSubcategoryTitle.id
				? await languageStore.put(upsertSubcategoryTitle)
				: await languageStore.insert(upsertSubcategoryTitle);
			descriptionResponse = upsertSubcategoryDescription.id
				? await languageStore.put(upsertSubcategoryDescription)
				: await languageStore.insert(upsertSubcategoryDescription);
			showModal = false;
			upsertSubcategory.title = titleResponse?.id ?? 0;
			upsertSubcategory.description = descriptionResponse?.id ?? 0;
			subcategoryResponse = upsertSubcategory.id
				? await subcategoryStore.put(upsertSubcategory)
				: await subcategoryStore.insert(upsertSubcategory);
		} catch (error) {
			if (titleResponse) {
				languageStore.remove(titleResponse.id);
			}
			if (descriptionResponse) {
				languageStore.remove(descriptionResponse.id);
			}
			if (error instanceof Error) {
				toastStore.error(error.message);
			}
		} finally {
			showModal = false;
			upsertSubcategoryTitle = {
				id: 0,
				en: ''
			};
			upsertSubcategoryDescription = {
				id: 0,
				en: ''
			};
		}
	}
</script>

<div class="flex items-start gap-2">
	<MultiSelect
		class="flex-1"
		items={$subcategoryStore.data.map((item) => ({
			name: item.title[languageTag()] ?? item.title.en ?? '',
			value: item.id
		}))}
		bind:value={selected}
	/>
	<Button class="p-2" color="primary" on:click={() => (showModal = true)}>
		<CirclePlusSolid class="h-4 w-4" />
	</Button>
</div>

<Modal bind:open={showModal} size="lg" autoclose={false} class="w-full">
	<div class="space-y-6 p-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
			{m.add()}
		</h3>

		<div class="space-y-4">
			<!-- Title Section -->
			<div class="space-y-2">
				<Label class="text-lg font-medium">{m.title()}</Label>
				<Tabs style="underline" class="mb-4">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<Input
								class="w-full transition-all duration-200 focus:ring-2 focus:ring-primary-light-500 dark:text-main-dark-500"
								placeholder={m.title()}
								bind:value={upsertSubcategoryTitle[language.toLowerCase() as keyof InsertLanguage]}
								required={language === Languages.EN}
							/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<!-- Description Section -->
			<div class="space-y-2">
				<Label class="text-lg font-medium">{m.description()}</Label>
				<Tabs style="underline" class="mb-4">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<Input
								class="w-full transition-all duration-200 focus:ring-2 focus:ring-primary-light-500 dark:text-main-dark-500"
								placeholder={m.description()}
								bind:value={upsertSubcategoryDescription[
									language.toLowerCase() as keyof InsertLanguage
								]}
								required={language === Languages.EN}
								
							/>
						</TabItem>
					{/each}
				</Tabs>
			</div>
		</div>

		<div class="flex justify-end gap-4">
			<Button color="primary" on:click={handleUpsert}>
				{m.save()}
			</Button>
			<Button color="alternative" on:click={() => (showModal = false)}>
				{m.cancel()}
			</Button>
		</div>
	</div>
</Modal>
