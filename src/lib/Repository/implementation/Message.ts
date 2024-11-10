import type { MessageEntity } from '$lib/Model/Entity/Message';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertMessage, UpdateMessage } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IMessage } from '../Interface/IMessage';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class MessageRepository implements IMessage {
    async createMessageAsync(
        request: InsertMessage
    ): Promise<PostgrestSingleResponse<MessageEntity>> {
        const response = await supabase
            .from('Message')
            .insert(request)
            .select('*')
            .returns<MessageEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readMessagesAsync(
        options?: GenericListOptions
    ): Promise<PostgrestSingleResponse<MessageEntity[]>> {
        const query = supabase.from('Message').select(options?.select ?? '*', { count: 'exact' });
        if (options?.search) query.textSearch(options.fieldOption ?? 'content', options.search);
        if (options?.from) query.gte('created_at', options.from);
        if (options?.to) query.lte('created_at', options.to);
        const response = await query
            .is('deleted_at', null)
            .order('id', { ascending: false })
            .range(
                ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
                (options?.page ?? 1) * (options?.limit ?? 10)
            )
            .returns<MessageEntity[]>();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readMessageAsync(id: number): Promise<PostgrestSingleResponse<MessageEntity>> {
        const response = await supabase
            .from('Message')
            .select('*')
            .eq('id', id)
            .returns<MessageEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async updateMessageAsync(
        request: UpdateMessage
    ): Promise<PostgrestSingleResponse<MessageEntity>> {
        const response = await supabase
            .from('Message')
            .update(request)
            .eq('id', request.id!)
            .select('*')
            .returns<MessageEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async deleteMessageAsync(id: number): Promise<void> {
        const response = await supabase
            .from('Message')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
    }
}
