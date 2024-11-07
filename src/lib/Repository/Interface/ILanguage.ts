import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { LanguageEntity } from '$lib/Model/Entity/Language';
import type { InsertLanguage, UpdateLanguage } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface ILanguage {
	createLanguageAsync(language: InsertLanguage): Promise<PostgrestSingleResponse<LanguageEntity>>;
	readLanguagesAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<LanguageEntity[]>>;
	readLanguageAsync(id: number): Promise<PostgrestSingleResponse<LanguageEntity>>;
	updateLanguageAsync(language: UpdateLanguage): Promise<PostgrestSingleResponse<LanguageEntity>>;
	deleteLanguageAsync(id: number): Promise<void>;
	deleteSoftLanguageAsync(id: number): Promise<void>;
}
