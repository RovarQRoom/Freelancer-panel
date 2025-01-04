import type { SubcategoryEntity } from '$lib/Model/Entity/Subcategory';
import { SubcategoryRepository } from '$lib/Repository/implementation/Subcategory';
import type { InsertSubcategory, UpdateSubcategory } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';

const subcategoryRepository = new SubcategoryRepository();

const createSubcategoryStore = () => {
	const { subscribe, update, set } = writable<Store<SubcategoryEntity>>(
		new Store<SubcategoryEntity>()
	);
	return {
		subscribe,

		insert: async (request: InsertSubcategory) => {
			try {
				const response = await subcategoryRepository.createSubcategoryAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((subcategories) => {
					subcategories.data.push(response.data);
					return subcategories;
				});
				toastStore.success('Subcategory created successfully');
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},
		fetchAll: async (options?: GenericListOptions) => {
			try {
				const response = await subcategoryRepository.readSubcategoriesAsync(options);
				if (response.error) {
					throw new Error(response.error.message);
				}
				const pages = Math.ceil((response.count ?? 0) / (options?.limit ?? 10));
				set({
					data: response.data,
					total: response.count ?? 0,
					pages,
					currentPage: options?.page ?? 1,
					remaining: (options?.page ?? 1) * (options?.limit ?? 10) - (response.count ?? 0)
				});
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},
		fetch: async (id: number) => {
			try {
				const response = await subcategoryRepository.readSubcategoryAsync(id);
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},
		fetchForDropdown: async (options?: GenericListOptions) => {
			try {
				const response = await subcategoryRepository.readSubcategoriesAsync(options);
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},
		put: async (request: UpdateSubcategory) => {
			try {
				const response = await subcategoryRepository.updateSubcategoryAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((subcategories) => {
					const index = subcategories.data.findIndex(
						(subcategory) => subcategory.id === request.id
					);
					if (index !== -1) subcategories.data[index] = response.data;
					return subcategories;
				});
				toastStore.success('Subcategory updated successfully');
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},
		putAll: async (ids: number[], categoryId: number) => {
			try {
				const response = await subcategoryRepository.updateSubcategoriesAsync(ids, categoryId);
				update((subcategories) => {
					for (const subcategory of response) {
						const index = subcategories.data.findIndex(
							(subcategory) => subcategory.id === subcategory.id
						);
						if (index !== -1) subcategories.data[index] = subcategory;
					}
					return subcategories;
				});
				toastStore.success('Subcategories updated successfully');
				return response;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},
		remove: async (id: number) => {
			try {
				await subcategoryRepository.deleteSubcategoryAsync(id);
				toastStore.success('Subcategory deleted successfully');
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		}
	};
};

export const subcategoryStore = createSubcategoryStore();
