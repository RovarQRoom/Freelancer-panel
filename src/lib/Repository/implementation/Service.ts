import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { ServiceEntity } from '$lib/Model/Entity/Service';
import type { InsertService, UpdateService } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IService } from '../Interface/IService';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';
import { languageTag } from '$lib/paraglide/runtime';

export class ServiceRepository implements IService {
	async createServiceAsync(
		request: InsertService
	): Promise<PostgrestSingleResponse<ServiceEntity>> {
		const response = await supabase
			.from('Service')
			.insert(request)
			.select(`*, title(${languageTag()}), description(${languageTag()})`)
			.returns<ServiceEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}

	async readServicesAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<ServiceEntity[]>> {
		const query = supabase
			.from('Service')
			.select(
				options?.select ??
					`*, title(${languageTag()}), description(${languageTag()}), media(${languageTag()}), subcategory(id, title(${languageTag()})), created_by(id, name), supervised_by(id, name)`,
				{ count: 'exact' }
			);
		if (options?.search) query.textSearch(options.fieldOption ?? 'name', options.search);
		if (options?.from) query.gte('created_at', options.from);
		if (options?.to) query.lte('created_at', options.to);
		if (options?.created_at) query.eq('created_at', options.created_at);
		if (options?.[`title.${languageTag()}`])
			query.ilike(`title.${languageTag()}`, `%${options[`title.${languageTag()}`]}%`);
		if (options?.id) query.eq('id', options.id);
		if (options?.price) query.gte('price', options.price);
		if (options?.average_rating) query.gte('average_rating', options.average_rating);
		if (options?.created_by) query.eq('created_by', options.created_by);
		if (options?.supervised_by) query.eq('supervised_by', options.supervised_by);
		if (options?.subcategory) query.eq('subcategory', options.subcategory);
		const response = await query
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((options?.page ?? 1) - 1) * (options?.limit ?? 10),
				(options?.page ?? 1) * (options?.limit ?? 10) - 1
			)
			.returns<ServiceEntity[]>();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}

	async readServiceAsync(id: number): Promise<PostgrestSingleResponse<ServiceEntity>> {
		const response = await supabase
			.from('Service')
			.select(
				`*, title(id,en,ckb,ar), description(id,en,ckb,ar), media(id,en,ckb,ar), supervised_by(id,name), created_by(id,name), subcategory(id)`
			)
			.eq('id', id)
			.returns<ServiceEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}

	async updateServiceAsync(
		request: UpdateService
	): Promise<PostgrestSingleResponse<ServiceEntity>> {
		const response = await supabase
			.from('Service')
			.update(request)
			.eq('id', request.id!)
			.select(`*, title(${languageTag()}), description(${languageTag()})`)
			.returns<ServiceEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}

	async deleteServiceAsync(id: number): Promise<void> {
		const response = await supabase
			.from('Service')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
	}
}
