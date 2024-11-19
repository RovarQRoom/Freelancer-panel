<script lang="ts">
	import { Button, Input, Label, Tabs, TabItem, Spinner, Modal } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		Languages,
		type InsertLanguage,
		type InsertSubcategory
	} from '$lib/Supabase/Types/database.types';
	import { languageStore } from '$lib/Store/Language';
	import { toastStore } from '$lib/Store/Toast';
	import { LanguageEntity } from '$lib/Model/Entity/Language';
	import { subcategoryStore } from '$lib/Store/Subcategory';
	import type { SubcategoryEntity } from '$lib/Model/Entity/Subcategory';
	import { checkPremissionOnRoute } from '$lib/Utils/CheckPremission';
	import { authStore } from '$lib/Store/Auth';
	import { Action } from '$lib/Model/Action/Action';

	let { open = $bindable(false) } = $props<{ open: boolean }>();

	let loadingAddSubcategory = $state(false);
	let createSubcategory = $state<InsertSubcategory>({
		title: 0,
		description: 0
	});
	let createSubcategoryTitleLanguage = $state<InsertLanguage>({
		en: ''
	});
	let createSubcategoryDescriptionLanguage = $state<InsertLanguage>({
		en: ''
	});

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
			open = false;
			resetForm();
		}
	}

	function resetForm() {
		createSubcategoryTitleLanguage = { en: '' };
		createSubcategoryDescriptionLanguage = { en: '' };
		createSubcategory = { title: 0, description: 0 };
	}
</script>

<Modal bind:open size="lg" autoclose={false} on:close={resetForm}>
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
								bind:value={createSubcategoryTitleLanguage[
									language.toLowerCase() as keyof InsertLanguage
								]}
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
								bind:value={createSubcategoryDescriptionLanguage[
									language.toLowerCase() as keyof InsertLanguage
								]}
								required={language === Languages.EN}
							/>
						</TabItem>
					{/each}
				</Tabs>
			</div>

			<div class="flex justify-end gap-3">
				{#if checkPremissionOnRoute($authStore!, [Action.CREATE_SUBCATEGORY], $authStore?.role?.name)}
					<Button
						type="submit"
						class="bg-primary-light-500 text-white"
						onclick={() => handleAddSubcategory()}
						disabled={loadingAddSubcategory}
					>
						{#if loadingAddSubcategory}
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
