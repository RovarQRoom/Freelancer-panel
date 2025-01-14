import type { OrderEntity } from '$lib/Model/Entity/Order';
import { OrderRepository } from '$lib/Repository/implementation/Order';
import type { InsertOrder, UpdateOrder } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const orderRepository = new OrderRepository();

const createOrderStore = () => {
    const { subscribe, update, set } = writable<Store<OrderEntity>>(new Store<OrderEntity>());
    
    return {
        subscribe,
        
        insert: async (request: InsertOrder) => {
            try {
                const response = await orderRepository.createOrderAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((orders) => {
                    orders.data.push(response.data);
                    return orders;
                });
                toastStore.success(m['create_success']());
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetchAll: async (options?: GenericListOptions) => {
            try {
                const response = await orderRepository.readOrdersAsync(options);
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
                const response = await orderRepository.readOrderAsync(id);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        put: async (request: UpdateOrder) => {
            try {
                const response = await orderRepository.updateOrderAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((orders) => {
                    const index = orders.data.findIndex((order) => order.id === request.id);
                    if (index !== -1) orders.data[index] = response.data;
                    return orders;
                });
                toastStore.success(m['update_success']());
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        remove: async (id: number) => {
            try {
                await orderRepository.deleteOrderAsync(id);
                update((orders) => {
                    orders.data = orders.data.filter((order) => order.id !== id);
                    return orders;
                });
                toastStore.success(m['delete_success']());
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        }
    };
};

export const orderStore = createOrderStore(); 