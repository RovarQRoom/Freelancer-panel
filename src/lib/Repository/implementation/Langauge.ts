import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { LanguageEntity } from '$lib/Model/Entity/Language';
import type { InsertLanguage, UpdateLanguage } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { ILanguage } from '../Interface/ILanguage';
import { supabase } from '$lib/Supabase/supabase';
import { languageTag } from '$lib/paraglide/runtime';
import { toastStore } from '$lib/Store/Toast';

export class LanguageRepository implements ILanguage {
	async createLanguageAsync(
		language: InsertLanguage
	): Promise<PostgrestSingleResponse<LanguageEntity>> {
		const response = await supabase
			.from('Language')
			.insert(language)
			.select('*')
			.returns<LanguageEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readLanguagesAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<LanguageEntity[]>> {
		const query = supabase
			.from('Language')
			.select(options?.select ?? `*,title(${languageTag()})`, { count: 'exact' });
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
			.returns<LanguageEntity[]>();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readLanguageAsync(id: number): Promise<PostgrestSingleResponse<LanguageEntity>> {
		const response = await supabase
			.from('Language')
			.select(`*,title(${languageTag()})`)
			.eq('id', id)
			.returns<LanguageEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async updateLanguageAsync(
		language: UpdateLanguage
	): Promise<PostgrestSingleResponse<LanguageEntity>> {
		const response = await supabase
			.from('Language')
			.update(language)
			.eq('id', language.id!)
			.select('*')
			.returns<LanguageEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async deleteLanguageAsync(id: number): Promise<void> {
		const response = await supabase.from('Language').delete().eq('id', id);
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
	}
	async deleteSoftLanguageAsync(id: number): Promise<void> {
		const response = await supabase
			.from('Language')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
	}
}
