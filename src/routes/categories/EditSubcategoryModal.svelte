<script lang="ts">
	import { Button, Input, Label, Tabs, TabItem, Spinner, Modal } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		Languages,
		type UpdateLanguage,
		type UpdateSubcategory
	} from '$lib/Supabase/Types/database.types';
	import { languageStore } from '$lib/Store/Language';
	import { toastStore } from '$lib/Store/Toast';
	import { LanguageEntity } from '$lib/Model/Entity/Language';
	import { subcategoryStore } from '$lib/Store/Subcategory';
	import type { SubcategoryEntity } from '$lib/Model/Entity/Subcategory';
	import { authStore } from '$lib/Store/Auth';
	import { checkPremissionOnRoute } from '$lib/Utils/CheckPremission';
	import { Action } from '$lib/Model/Action/Action';

	let { open = $bindable(false), subcategoryId = $bindable<number | null>(null) } = $props<{
		open: boolean;
		subcategoryId: number | null;
	}>();

	let loadingUpdateSubcategory = $state(false);
	let updateSubcategory = $state<UpdateSubcategory>({
		id: 0,
		title: 0,
		description: 0
	});
	let updateSubcategoryTitleLanguage = $state<UpdateLanguage>({
		id: 0,
		en: ''
	});
	let updateSubcategoryDescriptionLanguage = $state<UpdateLanguage>({
		id: 0,
		en: ''
	});

	async function getSubcategory(id: number) {
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

	async function handleEditSubcategory() {
		loadingUpdateSubcategory = true;
		let titleResponse: LanguageEntity | undefined;
		let descriptionResponse: LanguageEntity | undefined;
		let subcategoryResponse: SubcategoryEntity | undefined;
		try {
			titleResponse = await languageStore.put(updateSubcategoryTitleLanguage);
			descriptionResponse = await languageStore.put(updateSubcategoryDescriptionLanguage);
			updateSubcategory.title = titleResponse?.id ?? 0;
			updateSubcategory.description = descriptionResponse?.id ?? 0;
			subcategoryResponse = await subcategoryStore.put(updateSubcategory);
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
			open = false;
		}
	}

	function resetForm() {
		updateSubcategoryTitleLanguage = { id: 0, en: '' };
		updateSubcategoryDescriptionLanguage = { id: 0, en: '' };
		updateSubcategory = { id: 0, title: 0, description: 0 };
	}

	$effect(() => {
		if (subcategoryId) {
			getSubcategory(subcategoryId);
		}
	});
</script>

<Modal bind:open size="lg" autoclose={false} on:close={resetForm}>
	<div class="p-4">
		<h3 class="mb-4 text-xl font-bold">{m.editSubcategory()}</h3>
		<form class="space-y-4">
			<div class="space-y-2">
				<Label>{m.subCategorytitle()}</Label>
				<Tabs style="underline">
					{#each Object.keys(Languages) as language}
						<TabItem open={language === Languages.EN} title={language}>
							<Input
								bind:value={updateSubcategoryTitleLanguage[
									language.toLowerCase() as keyof UpdateLanguage
								]}
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
								bind:value={updateSubcategoryDescriptionLanguage[
									language.toLowerCase() as keyof UpdateLanguage
								]}
								class="w-full"
								placeholder={m.subCategoryDescriptionPlaceholder()}
								required={language === Languages.EN}
							/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<div class="flex justify-end gap-3">
				{#if checkPremissionOnRoute($authStore!, [Action.UPDATE_SUBCATEGORY], $authStore?.role?.name)}
					<Button
						type="submit"
						class="bg-primary-light-500 text-white"
						onclick={() => handleEditSubcategory()}
						disabled={loadingUpdateSubcategory}
					>
						{#if loadingUpdateSubcategory}
							<Spinner class="mr-3" size="4" color="white" />
						{/if}
						{m.save()}
					</Button>
				{/if}
				<Button color="alternative" onclick={() => (open = false)}>
					{m.cancel()}
				</Button>
			</div>
		</form>
	</div>
</Modal>
