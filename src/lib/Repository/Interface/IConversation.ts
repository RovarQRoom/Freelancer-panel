import type { ConversationEntity } from '$lib/Model/Entity/Conversation';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertConversation, UpdateConversation } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IConversation {
    createConversationAsync(request: InsertConversation): Promise<PostgrestSingleResponse<ConversationEntity>>;
    readConversationsAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<ConversationEntity[]>>;
    readConversationAsync(id: number): Promise<PostgrestSingleResponse<ConversationEntity>>;
    updateConversationAsync(request: UpdateConversation): Promise<PostgrestSingleResponse<ConversationEntity>>;
    deleteConversationAsync(id: number): Promise<void>;
}
