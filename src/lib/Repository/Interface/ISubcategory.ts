import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { SubcategoryEntity } from '$lib/Model/Entity/Subcategory';
import type { InsertSubcategory, UpdateSubcategory } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface ISubcategory {
	createSubcategoryAsync(
		request: InsertSubcategory
	): Promise<PostgrestSingleResponse<SubcategoryEntity>>;
	readSubcategoriesAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<Array<SubcategoryEntity>>>;
	readSubcategoryAsync(id: number): Promise<PostgrestSingleResponse<SubcategoryEntity>>;
	updateSubcategoryAsync(
		request: UpdateSubcategory
	): Promise<PostgrestSingleResponse<SubcategoryEntity>>;
	updateSubcategoriesAsync(ids: number[], categoryId: number): Promise<SubcategoryEntity[]>;
	deleteSubcategoryAsync(id: number): Promise<void>;
}
