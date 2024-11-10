import type { ServiceEntity } from '$lib/Model/Entity/Service';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertService, UpdateService } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IService {
    createServiceAsync(request: InsertService): Promise<PostgrestSingleResponse<ServiceEntity>>;
    readServicesAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<ServiceEntity[]>>;
    readServiceAsync(id: number): Promise<PostgrestSingleResponse<ServiceEntity>>;
    updateServiceAsync(request: UpdateService): Promise<PostgrestSingleResponse<ServiceEntity>>;
    deleteServiceAsync(id: number): Promise<void>;
}
