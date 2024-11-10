import type { TypingStatusEntity } from '$lib/Model/Entity/TypingStatus';
import { TypingStatusRepository } from '$lib/Repository/implementation/TypingStatus';
import type { InsertTypingStatus, UpdateTypingStatus } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const typingStatusRepository = new TypingStatusRepository();

const createTypingStatusStore = () => {
    const { subscribe, update, set } = writable<Store<TypingStatusEntity>>(new Store<TypingStatusEntity>());
    
    return {
        subscribe,
        
        insert: async (request: InsertTypingStatus) => {
            try {
                const response = await typingStatusRepository.createTypingStatusAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((typingStatuses) => {
                    typingStatuses.data.push(response.data);
                    return typingStatuses;
                });
                toastStore.success(m['create_success']('typing_status'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetchAll: async (options?: GenericListOptions) => {
            try {
                const response = await typingStatusRepository.readTypingStatusesAsync(options);
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
                const response = await typingStatusRepository.readTypingStatusAsync(id);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        put: async (request: UpdateTypingStatus) => {
            try {
                const response = await typingStatusRepository.updateTypingStatusAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((typingStatuses) => {
                    const index = typingStatuses.data.findIndex((status) => status.id === request.id);
                    if (index !== -1) typingStatuses.data[index] = response.data;
                    return typingStatuses;
                });
                toastStore.success(m['update_success']('typing_status'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        remove: async (id: number) => {
            try {
                await typingStatusRepository.deleteTypingStatusAsync(id);
                update((typingStatuses) => {
                    typingStatuses.data = typingStatuses.data.filter((status) => status.id !== id);
                    return typingStatuses;
                });
                toastStore.success(m['delete_success']('typing_status'));
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        }
    };
};

export const typingStatusStore = createTypingStatusStore(); 