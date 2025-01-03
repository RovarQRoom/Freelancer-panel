import type { LanguageEntity } from '$lib/Model/Entity/Language';
import { writable } from 'svelte/store';
import { LanguageRepository } from '../Repository/implementation/Langauge';
import { Store } from '../Model/Extention/Store';
import type { InsertLanguage, UpdateLanguage } from '$lib/Supabase/Types/database.types';
import { toastStore } from './Toast';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages.js';
const langaugeRepository = new LanguageRepository();

const createLanguageStore = () => {
	const { subscribe, update, set } = writable<Store<LanguageEntity>>(new Store<LanguageEntity>());
	return {
		subscribe,
		insert: async (language: InsertLanguage) => {
			try {
				const response = await langaugeRepository.createLanguageAsync(language);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((store) => {
					store.data = [response.data, ...store.data];
					return store;
				});
				toastStore.success(m['create_success']());
				return response.data;
			} catch (error) {
				if (error instanceof Error) {
					toastStore.error(error.message);
					throw new Error(error.message);
				}
				throw error;
			}
		},
		fetch: async (id: number) => {
			try {
				const response = await langaugeRepository.readLanguageAsync(id);
				return response;
			} catch (error) {
				if (error instanceof Error) {
					toastStore.error(error.message);
					throw new Error(error.message);
				}
				throw error;
			}
		},
		fetchAll: async (options?: GenericListOptions) => {
			try {
				const response = await langaugeRepository.readLanguagesAsync(options);
				const pages = Math.ceil((response.count ?? 0) / (options?.limit ?? 10));
				set({
					data: response.data ?? [],
					total: response.count ?? 0,
					pages,
					currentPage: options?.page ?? 1,
					remaining: (options?.page ?? 1) * (options?.limit ?? 10) - (response.count ?? 0)
				});
				return response.data;
			} catch (error) {
				if (error instanceof Error) {
					toastStore.error(error.message);
					throw new Error(error.message);
				}
				throw error;
			}
		},
		put: async (language: UpdateLanguage) => {
			try {
				const response = await langaugeRepository.updateLanguageAsync(language);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((store) => {
					store.data = store.data.map((item) => (item.id === language.id ? response.data : item));
					return store;
				});
				toastStore.success(m['update_success']());
				return response.data;
			} catch (error) {
				if (error instanceof Error) {
					toastStore.error(error.message);
					throw new Error(error.message);
				}
				throw error;
			}
		},
		remove: async (id: number) => {
			try {
				await langaugeRepository.deleteLanguageAsync(id);
				update((store) => {
					store.data = store.data.filter((item) => item.id !== id);
					return store;
				});
				toastStore.success(m['delete_success']());
			} catch (error) {
				if (error instanceof Error) {
					toastStore.error(error.message);
					throw new Error(error.message);
				}
				throw error;
			}
		},
		removeSoft: async (id: number) => {
			try {
				await langaugeRepository.deleteLanguageAsync(id);
				toastStore.success(m['delete_success']());
				// update((store) => {
				// 	store.data = store.data.filter((item) => item.id !== id);
				// 	return store;
				// });
			} catch (error) {
				if (error instanceof Error) {
					toastStore.error(error.message);
					throw new Error(error.message);
				}
				throw error;
			}
		}
	};
};

export const languageStore = createLanguageStore();
