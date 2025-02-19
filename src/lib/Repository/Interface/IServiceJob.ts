import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { ServiceJobEntity } from '$lib/Model/Entity/ServiceJob';
import type { InsertServiceJob, UpdateServiceJob } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IServiceJob {
	createServiceJobAsync(
		request: InsertServiceJob
	): Promise<PostgrestSingleResponse<ServiceJobEntity>>;
	readServiceJobsAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<ServiceJobEntity[]>>;
	readServiceJobAsync(id: number): Promise<PostgrestSingleResponse<ServiceJobEntity>>;
	updateServiceJobAsync(
		request: UpdateServiceJob
	): Promise<PostgrestSingleResponse<ServiceJobEntity>>;
	deleteServiceJobAsync(id: number): Promise<void>;
}
