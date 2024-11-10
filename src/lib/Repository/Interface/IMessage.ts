import type { MessageEntity } from '$lib/Model/Entity/Message';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertMessage, UpdateMessage } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IMessage {
    createMessageAsync(request: InsertMessage): Promise<PostgrestSingleResponse<MessageEntity>>;
    readMessagesAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<MessageEntity[]>>;
    readMessageAsync(id: number): Promise<PostgrestSingleResponse<MessageEntity>>;
    updateMessageAsync(request: UpdateMessage): Promise<PostgrestSingleResponse<MessageEntity>>;
    deleteMessageAsync(id: number): Promise<void>;
}
