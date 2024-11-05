import type { ISubcategory } from '../Interface/ISubcategory';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';
import type { InsertSubcategory, UpdateSubcategory } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { SubcategoryEntity } from '$lib/Model/Entity/Subcategory';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import moment from 'moment';

export class SubcategoryRepository implements ISubcategory {
	async createSubcategoryAsync(
		request: InsertSubcategory
	): Promise<PostgrestSingleResponse<SubcategoryEntity>> {
		const response = await supabase
			.from('Subcategory')
			.insert(request)
			.select('*')
			.returns<SubcategoryEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readSubcategoriesAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<Array<SubcategoryEntity>>> {
		const query = supabase.from('Subcategory').select(options?.select ?? '*', { count: 'exact' });
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
			.returns<SubcategoryEntity[]>();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readSubcategoryAsync(id: number): Promise<PostgrestSingleResponse<SubcategoryEntity>> {
		const response = await supabase
			.from('Subcategory')
			.select('*')
			.eq('id', id)
			.returns<SubcategoryEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async updateSubcategoryAsync(
		request: UpdateSubcategory
	): Promise<PostgrestSingleResponse<SubcategoryEntity>> {
		const response = await supabase
			.from('Subcategory')
			.update(request)
			.select('*')
			.returns<SubcategoryEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async deleteSubcategoryAsync(id: number): Promise<void> {
		const response = await supabase
			.from('Subcategory')
			.update({ deleted_at: moment().toISOString() })
			.eq('id', id);
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
	}
}
