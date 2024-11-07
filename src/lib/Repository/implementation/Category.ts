import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { CategoryEntity } from '$lib/Model/Entity/Category';
import type { InsertCategory, UpdateCategory } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { ICategory } from '../Interface/ICategory';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';
import { languageTag } from '$lib/paraglide/runtime';

export class CategoryRepository implements ICategory {
	async createCategoryAsync(
		request: InsertCategory
	): Promise<PostgrestSingleResponse<CategoryEntity>> {
		const response = await supabase
			.from('Category')
			.insert(request)
			.select(`*,title(${languageTag()})`)
			.returns<CategoryEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readCategoriesAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<Array<CategoryEntity>>> {
		const query = supabase
			.from('Category')
			.select(options?.select ?? `*,title(${languageTag()})`, { count: 'exact' })
			;
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
			.returns<CategoryEntity[]>();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readCategoryAsync(id: number): Promise<PostgrestSingleResponse<CategoryEntity>> {
		const response = await supabase
			.from('Category')
			.select(`*,title(id,en,ckb,ar)`)
			.eq('id', id)
			.returns<CategoryEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async updateCategoryAsync(
		request: UpdateCategory
	): Promise<PostgrestSingleResponse<CategoryEntity>> {
		const response = await supabase
			.from('Category')
			.update(request)
			.eq('id', request.id!)
			.select(`*,title(${languageTag()})`)
			.returns<CategoryEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async deleteCategoryAsync(id: number): Promise<void> {
		const response = await supabase
			.from('Category')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id)
			.select(`*,title(${languageTag()})`)
			.returns<CategoryEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
	}
}
