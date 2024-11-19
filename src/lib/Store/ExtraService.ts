import type { ExtraServiceEntity } from '$lib/Model/Entity/ExtraService';
import { ExtraServiceRepository } from '$lib/Repository/implementation/ExtraService';
import type { InsertExtraService, UpdateExtraService } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const extraServiceRepository = new ExtraServiceRepository();

const createExtraServiceStore = () => {
    const { subscribe, update, set } = writable<Store<ExtraServiceEntity>>(new Store<ExtraServiceEntity>());
    
    return {
        subscribe,
        
        insert: async (request: InsertExtraService) => {
            try {
                const response = await extraServiceRepository.createExtraServiceAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((extraServices) => {
                    extraServices.data.push(response.data);
                    return extraServices;
                });
                toastStore.success(m['create_success']());
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetchAll: async (options?: GenericListOptions) => {
            try {
                const response = await extraServiceRepository.readExtraServicesAsync(options);
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
                const response = await extraServiceRepository.readExtraServiceAsync(id);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        put: async (request: UpdateExtraService) => {
            try {
                const response = await extraServiceRepository.updateExtraServiceAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((extraServices) => {
                    const index = extraServices.data.findIndex((service) => service.id === request.id);
                    if (index !== -1) extraServices.data[index] = response.data;
                    return extraServices;
                });
                toastStore.success(m['update_success']());
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        remove: async (id: number) => {
            try {
                await extraServiceRepository.deleteExtraServiceAsync(id);
                update((extraServices) => {
                    extraServices.data = extraServices.data.filter((service) => service.id !== id);
                    return extraServices;
                });
                toastStore.success(m['delete_success']());
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        }
    };
};

export const extraServiceStore = createExtraServiceStore(); 