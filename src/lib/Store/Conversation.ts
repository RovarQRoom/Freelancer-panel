import type { ConversationEntity } from '$lib/Model/Entity/Conversation';
import { ConversationRepository } from '$lib/Repository/implementation/Conversation';
import type { InsertConversation, UpdateConversation } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const conversationRepository = new ConversationRepository();

const createConversationStore = () => {
    const { subscribe, update, set } = writable<Store<ConversationEntity>>(new Store<ConversationEntity>());
    
    return {
        subscribe,
        
        insert: async (request: InsertConversation) => {
            try {
                const response = await conversationRepository.createConversationAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((conversations) => {
                    conversations.data.push(response.data);
                    return conversations;
                });
                toastStore.success(m['create_success']('conversation'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetchAll: async (options?: GenericListOptions) => {
            try {
                const response = await conversationRepository.readConversationsAsync(options);
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
                const response = await conversationRepository.readConversationAsync(id);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        put: async (request: UpdateConversation) => {
            try {
                const response = await conversationRepository.updateConversationAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((conversations) => {
                    const index = conversations.data.findIndex((conversation) => conversation.id === request.id);
                    if (index !== -1) conversations.data[index] = response.data;
                    return conversations;
                });
                toastStore.success(m['update_success']('conversation'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        remove: async (id: number) => {
            try {
                await conversationRepository.deleteConversationAsync(id);
                update((conversations) => {
                    conversations.data = conversations.data.filter((conversation) => conversation.id !== id);
                    return conversations;
                });
                toastStore.success(m['delete_success']('conversation'));
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        }
    };
};

export const conversationStore = createConversationStore(); 