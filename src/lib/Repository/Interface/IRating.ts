import type { RatingEntity } from '$lib/Model/Entity/Rating';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertRating, UpdateRating } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IRating {
    createRatingAsync(request: InsertRating): Promise<PostgrestSingleResponse<RatingEntity>>;
    readRatingsAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<RatingEntity[]>>;
    readRatingAsync(id: number): Promise<PostgrestSingleResponse<RatingEntity>>;
    updateRatingAsync(request: UpdateRating): Promise<PostgrestSingleResponse<RatingEntity>>;
    deleteRatingAsync(id: number): Promise<void>;
}
