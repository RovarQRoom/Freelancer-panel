import type { TypingStatusEntity } from '$lib/Model/Entity/TypingStatus';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertTypingStatus, UpdateTypingStatus } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface ITypingStatus {
    createTypingStatusAsync(request: InsertTypingStatus): Promise<PostgrestSingleResponse<TypingStatusEntity>>;
    readTypingStatusesAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<TypingStatusEntity[]>>;
    readTypingStatusAsync(id: number): Promise<PostgrestSingleResponse<TypingStatusEntity>>;
    updateTypingStatusAsync(request: UpdateTypingStatus): Promise<PostgrestSingleResponse<TypingStatusEntity>>;
    deleteTypingStatusAsync(id: number): Promise<void>;
}
