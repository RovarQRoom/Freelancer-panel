import type { ConversationEntity } from '$lib/Model/Entity/Conversation';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertConversation, UpdateConversation } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IConversation } from '../Interface/IConversation';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class ConversationRepository implements IConversation {
    async createConversationAsync(
        request: InsertConversation
    ): Promise<PostgrestSingleResponse<ConversationEntity>> {
        const response = await supabase
            .from('Conversation')
            .insert(request)
            .select('*')
            .returns<ConversationEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readConversationsAsync(
        options?: GenericListOptions
    ): Promise<PostgrestSingleResponse<ConversationEntity[]>> {
        const query = supabase.from('Conversation').select(options?.select ?? '*', { count: 'exact' });
        if (options?.search) query.textSearch(options.fieldOption ?? 'name', options.search);
        if (options?.from) query.gte('created_at', options.from);
        if (options?.to) query.lte('created_at', options.to);
        const response = await query
            .is('deleted_at', null)
            .order('id', { ascending: false })
            .range(
                ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
                (options?.page ?? 1) * (options?.limit ?? 10)
            )
            .returns<ConversationEntity[]>();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readConversationAsync(id: number): Promise<PostgrestSingleResponse<ConversationEntity>> {
        const response = await supabase
            .from('Conversation')
            .select('*')
            .eq('id', id)
            .returns<ConversationEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async updateConversationAsync(
        request: UpdateConversation
    ): Promise<PostgrestSingleResponse<ConversationEntity>> {
        const response = await supabase
            .from('Conversation')
            .update(request)
            .eq('id', request.id!)
            .select('*')
            .returns<ConversationEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async deleteConversationAsync(id: number): Promise<void> {
        const response = await supabase
            .from('Conversation')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
    }
}
