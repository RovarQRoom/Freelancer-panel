import type { MessageEntity } from '$lib/Model/Entity/Message';
import { MessageRepository } from '$lib/Repository/implementation/Message';
import type { InsertMessage, UpdateMessage } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const messageRepository = new MessageRepository();

const createMessageStore = () => {
    const { subscribe, update, set } = writable<Store<MessageEntity>>(new Store<MessageEntity>());
    
    return {
        subscribe,
        
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
                const response = await messageRepository.readMessagesAsync(options);
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