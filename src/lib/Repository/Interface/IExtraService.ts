import type { ExtraServiceEntity } from '$lib/Model/Entity/ExtraService';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertExtraService, UpdateExtraService } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IExtraService {
    createExtraServiceAsync(request: InsertExtraService): Promise<PostgrestSingleResponse<ExtraServiceEntity>>;
    readExtraServicesAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<ExtraServiceEntity[]>>;
    readExtraServiceAsync(id: number): Promise<PostgrestSingleResponse<ExtraServiceEntity>>;
    updateExtraServiceAsync(request: UpdateExtraService): Promise<PostgrestSingleResponse<ExtraServiceEntity>>;
    deleteExtraServiceAsync(id: number): Promise<void>;
} 