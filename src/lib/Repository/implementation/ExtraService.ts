import type { ExtraServiceEntity } from '$lib/Model/Entity/ExtraService';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertExtraService, UpdateExtraService } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IExtraService } from '../Interface/IExtraService';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';
import { languageTag } from '$lib/paraglide/runtime';

export class ExtraServiceRepository implements IExtraService {
    async createExtraServiceAsync(request: InsertExtraService): Promise<PostgrestSingleResponse<ExtraServiceEntity>> {
        const response = await supabase
            .from('ExtraService')
            .insert(request)
            .select(`*, title(${languageTag()}), description(${languageTag()})`)
            .returns<ExtraServiceEntity>()
            .single();
        
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readExtraServicesAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<ExtraServiceEntity[]>> {
        const query = supabase
            .from('ExtraService')
            .select(options?.select ?? `*, title(${languageTag()}), description(${languageTag()})`, { count: 'exact' });

        if (options?.search) query.textSearch(options.fieldOption ?? 'name', options.search);
        if (options?.from) query.gte('created_at', options.from);
        if (options?.to) query.lte('created_at', options.to);

        const response = await query
            .is('deleted_at', null)
            .order('id', { ascending: false })
            .range(
                ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
                ((options?.page ?? 1) * (options?.limit ?? 10)) - 1
            )
            .returns<ExtraServiceEntity[]>();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readExtraServiceAsync(id: number): Promise<PostgrestSingleResponse<ExtraServiceEntity>> {
        const response = await supabase
            .from('ExtraService')
            .select(`*, title(id,en,ckb,ar), description(id,en,ckb,ar)`)
            .eq('id', id)
            .returns<ExtraServiceEntity>()
            .single();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async updateExtraServiceAsync(request: UpdateExtraService): Promise<PostgrestSingleResponse<ExtraServiceEntity>> {
        const response = await supabase
            .from('ExtraService')
            .update(request)
            .eq('id', request.id!)
            .select(`*, title(${languageTag()}), description(${languageTag()})`)
            .returns<ExtraServiceEntity>()
            .single();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async deleteExtraServiceAsync(id: number): Promise<void> {
        const response = await supabase
            .from('ExtraService')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
    }
} 