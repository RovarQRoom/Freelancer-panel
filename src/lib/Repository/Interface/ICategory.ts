import type { GenericListOptions } from "$lib/Model/Common/ListOption";
import type { CategoryEntity } from "$lib/Model/Entity/Category";
import type { InsertCategory, UpdateCategory } from "$lib/Supabase/Types/database.types";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export interface ICategory {
	createCategoryAsync(
		request: InsertCategory
	): Promise<PostgrestSingleResponse<CategoryEntity>>;
	readCategoriesAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<Array<CategoryEntity>>>;
	readCategoryAsync(id: number): Promise<PostgrestSingleResponse<CategoryEntity>>;
	updateCategoryAsync(request: UpdateCategory): Promise<PostgrestSingleResponse<CategoryEntity>>;
	deleteCategoryAsync(id: number): Promise<void>;
}