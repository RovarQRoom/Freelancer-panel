import type { RatingEntity } from '$lib/Model/Entity/Rating';
import { RatingRepository } from '$lib/Repository/implementation/Rating';
import type { InsertRating, UpdateRating } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const ratingRepository = new RatingRepository();

const createRatingStore = () => {
    const { subscribe, update, set } = writable<Store<RatingEntity>>(new Store<RatingEntity>());
    
    return {
        subscribe,
        
        insert: async (request: InsertRating) => {
            try {
                const response = await ratingRepository.createRatingAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((ratings) => {
                    ratings.data.push(response.data);
                    return ratings;
                });
                toastStore.success(m['create_success']('rating'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetchAll: async (options?: GenericListOptions) => {
            try {
                const response = await ratingRepository.readRatingsAsync(options);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                const pages = Math.ceil((response.count ?? 0) / (options?.limit ?? 10));
                set({
                    data: response.data,
                    total: response.count ?? 0,
                    pages,
                    currentPage: options?.page ?? 1,
                    remaining: (options?.page ?? 1) * (options?.limit ?? 10) - (response.count ?? 0)
                });
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetch: async (id: number) => {
            try {
                const response = await ratingRepository.readRatingAsync(id);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        put: async (request: UpdateRating) => {
            try {
                const response = await ratingRepository.updateRatingAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((ratings) => {
                    const index = ratings.data.findIndex((rating) => rating.id === request.id);
                    if (index !== -1) ratings.data[index] = response.data;
                    return ratings;
                });
                toastStore.success(m['update_success']('rating'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        remove: async (id: number) => {
            try {
                await ratingRepository.deleteRatingAsync(id);
                update((ratings) => {
                    ratings.data = ratings.data.filter((rating) => rating.id !== id);
                    return ratings;
                });
                toastStore.success(m['delete_success']('rating'));
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        }
    };
};

export const ratingStore = createRatingStore(); 