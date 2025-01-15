import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { ServiceJobEntity } from '$lib/Model/Entity/ServiceJob';
import type { InsertServiceJob, UpdateServiceJob } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IServiceJob } from '../Interface/IServiceJob';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class ServiceJobRepository implements IServiceJob {
	async createServiceJobAsync(
		request: InsertServiceJob
	): Promise<PostgrestSingleResponse<ServiceJobEntity>> {
		const response = await supabase
			.from('ServiceJob')
			.insert(request)
			.select('*')
			.returns<ServiceJobEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}

	async readServiceJobsAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<ServiceJobEntity[]>> {
		const query = supabase.from('ServiceJob').select(options?.select ?? '*', { count: 'exact' });

		if (options?.search) query.textSearch(options.fieldOption ?? 'name', options.search);
		if (options?.from) query.gte('created_at', options.from);
		if (options?.to) query.lte('created_at', options.to);
		if (options?.client) query.eq('client', options.client);
		if (options?.serviceProvider) query.eq('serviceProvider', options.serviceProvider);
		if (options?.service) query.eq('service', options.service);
		if (options?.order) query.eq('order', options.order);
		if (options?.status) query.eq('status', options.status);

		const response = await query
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((options?.page ?? 1) - 1) * (options?.limit ?? 10),
				(options?.page ?? 1) * (options?.limit ?? 10) - 1
			)
			.returns<ServiceJobEntity[]>();

		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}

	async readServiceJobAsync(id: number): Promise<PostgrestSingleResponse<ServiceJobEntity>> {
		const response = await supabase
			.from('ServiceJob')
			.select('*')
			.eq('id', id)
			.returns<ServiceJobEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}

	async updateServiceJobAsync(
		request: UpdateServiceJob
	): Promise<PostgrestSingleResponse<ServiceJobEntity>> {
		const response = await supabase
			.from('ServiceJob')
			.update(request)
			.eq('id', request.id!)
			.select('*')
			.returns<ServiceJobEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}

	async deleteServiceJobAsync(id: number): Promise<void> {
		const response = await supabase
			.from('ServiceJob')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
	}
}
