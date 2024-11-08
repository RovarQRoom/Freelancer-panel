import type { CategoryEntity } from '$lib/Model/Entity/Category';
import { CategoryRepository } from '$lib/Repository/implementation/Category';
import type { InsertCategory, UpdateCategory } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages.js';

const categoryRepository = new CategoryRepository();

const createCategoryStore = () => {
	const { subscribe, update, set } = writable<Store<CategoryEntity>>(new Store<CategoryEntity>());
	return {
		subscribe,

		insert: async (request: InsertCategory) => {
			try {
				const response = await categoryRepository.createCategoryAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((categories) => {
					categories.data.push(response.data);
					return categories;
				});
				toastStore.success(m['create_success']('category'));
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		fetchAll: async (options?: GenericListOptions) => {
			try {
				const response = await categoryRepository.readCategoriesAsync(options);
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
				const response = await categoryRepository.readCategoryAsync(id);
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		put: async (request: UpdateCategory) => {
			try {
				const response = await categoryRepository.updateCategoryAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((categories) => {
					const index = categories.data.findIndex((category) => category.id === request.id);
					if (index !== -1) categories.data[index] = response.data;
					return categories;
				});
				toastStore.success('Category updated successfully');
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		remove: async (id: number) => {
			try {
				await categoryRepository.deleteCategoryAsync(id);
				toastStore.success('Category deleted successfully');
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		}
	};
};

export const categoryStore = createCategoryStore();
