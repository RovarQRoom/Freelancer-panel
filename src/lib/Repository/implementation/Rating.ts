import type { RatingEntity } from '$lib/Model/Entity/Rating';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertRating, UpdateRating } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IRating } from '../Interface/IRating';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class RatingRepository implements IRating {
    async createRatingAsync(
        request: InsertRating
    ): Promise<PostgrestSingleResponse<RatingEntity>> {
        const response = await supabase
            .from('Rating')
            .insert(request)
            .select('*')
            .returns<RatingEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readRatingsAsync(
        options?: GenericListOptions
    ): Promise<PostgrestSingleResponse<RatingEntity[]>> {
        const query = supabase.from('Rating').select(options?.select ?? '*', { count: 'exact' });
        if (options?.search) query.textSearch(options.fieldOption ?? 'comment', options.search);
        if (options?.from) query.gte('created_at', options.from);
        if (options?.to) query.lte('created_at', options.to);
        const response = await query
            .is('deleted_at', null)
            .order('id', { ascending: false })
            .range(
                ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
                ((options?.page ?? 1) * (options?.limit ?? 10)) - 1
            )
            .returns<RatingEntity[]>();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readRatingAsync(id: number): Promise<PostgrestSingleResponse<RatingEntity>> {
        const response = await supabase
            .from('Rating')
            .select('*')
            .eq('id', id)
            .returns<RatingEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async updateRatingAsync(
        request: UpdateRating
    ): Promise<PostgrestSingleResponse<RatingEntity>> {
        const response = await supabase
            .from('Rating')
            .update(request)
            .eq('id', request.id!)
            .select('*')
            .returns<RatingEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async deleteRatingAsync(id: number): Promise<void> {
        const response = await supabase
            .from('Rating')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
    }
}
