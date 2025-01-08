import type { MessageEntity } from '$lib/Model/Entity/Message';
import { MessageRepository } from '$lib/Repository/implementation/Message';
import type { InsertMessage, UpdateMessage } from '$lib/Supabase/Types/database.types';
import { get, writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const messageRepository = new MessageRepository();

const createMessageStore = () => {
	const { subscribe, update, set } = writable<Store<MessageEntity>>(new Store<MessageEntity>());

	return {
		subscribe,
		set,
        update,
		insert: async (request: InsertMessage) => {
			try {
				const response = await messageRepository.createMessageAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((messages) => {
					messages.data.push(response.data);
					return messages;
				});
				toastStore.success(m['create_success']('message'));
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		fetchAll: async (options?: GenericListOptions) => {
			try {
				if (options?.page && options?.limit) {
					const startRow = (options.page - 1) * options.limit;
					const currentTotal = get(messageStore)?.total ?? 0;

					// If we're not on page 1 and we've reached the end, return early
					if (options.page > 1 && startRow >= currentTotal) {
						return [];
					}
				}

				const response = await messageRepository.readMessagesAsync(options);
				if (response.error?.code === 'PGRST103') {
					update((store) => ({
						...store,
						remaining: 0
					}));
					return [];
				}

				if (response.error) {
					throw new Error(response.error.message);
				}

				const pages = Math.ceil((response.count ?? 0) / (options?.limit ?? 10));
				const remaining = Math.max(
					0,
					(response.count ?? 0) - (options?.page ?? 1) * (options?.limit ?? 10)
				);

				// If it's the first page, reset the store
				if (options?.page === 1) {
					set({
						data: response.data,
						total: response.count ?? 0,
						pages,
						currentPage: options?.page ?? 1,
						remaining
					});
				} else {
					// For subsequent pages, append the data
					update((store) => ({
						...store,
						data: [...store.data, ...response.data],
						total: response.count ?? 0,
						pages,
						currentPage: options?.page ?? 1,
						remaining
					}));
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
				return [];
			}
		},

		fetch: async (id: number) => {
			try {
				const response = await messageRepository.readMessageAsync(id);
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		put: async (request: UpdateMessage) => {
			try {
				const response = await messageRepository.updateMessageAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((messages) => {
					const index = messages.data.findIndex((message) => message.id === request.id);
					if (index !== -1) messages.data[index] = response.data;
					return messages;
				});
				toastStore.success(m['update_success']('message'));
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		remove: async (id: number) => {
			try {
				await messageRepository.deleteMessageAsync(id);
				update((messages) => {
					messages.data = messages.data.filter((message) => message.id !== id);
					return messages;
				});
				toastStore.success(m['delete_success']('message'));
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		}
	};
};

export const messageStore = createMessageStore();
