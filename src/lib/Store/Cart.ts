import type { CartEntity } from '$lib/Model/Entity/Cart';
import { CartRepository } from '$lib/Repository/implementation/Cart';
import type { InsertCart, UpdateCart } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const cartRepository = new CartRepository();

const createCartStore = () => {
    const { subscribe, update, set } = writable<Store<CartEntity>>(new Store<CartEntity>());
    
    return {
        subscribe,
        
        insert: async (request: InsertCart) => {
            try {
                const response = await cartRepository.createCartAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((carts) => {
                    carts.data.push(response.data);
                    return carts;
                });
                toastStore.success(m['create_success']());
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetchAll: async (options?: GenericListOptions) => {
            try {
                const response = await cartRepository.readCartsAsync(options);
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
                const response = await cartRepository.readCartAsync(id);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        put: async (request: UpdateCart) => {
            try {
                const response = await cartRepository.updateCartAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((carts) => {
                    const index = carts.data.findIndex((cart) => cart.id === request.id);
                    if (index !== -1) carts.data[index] = response.data;
                    return carts;
                });
                toastStore.success(m['update_success']());
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        remove: async (id: number) => {
            try {
                await cartRepository.deleteCartAsync(id);
                update((carts) => {
                    carts.data = carts.data.filter((cart) => cart.id !== id);
                    return carts;
                });
                toastStore.success(m['delete_success']());
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        }
    };
};

export const cartStore = createCartStore(); 