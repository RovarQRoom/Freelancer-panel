import type { ServiceEntity } from '$lib/Model/Entity/Service';
import { ServiceRepository } from '$lib/Repository/implementation/Service';
import type { InsertService, UpdateService } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const serviceRepository = new ServiceRepository();

const createServiceStore = () => {
    const { subscribe, update, set } = writable<Store<ServiceEntity>>(new Store<ServiceEntity>());
    
    return {
        subscribe,
        
        insert: async (request: InsertService) => {
            try {
                const response = await serviceRepository.createServiceAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((services) => {
                    services.data.push(response.data);
                    return services;
                });
                toastStore.success(m['create_success']('service'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetchAll: async (options?: GenericListOptions) => {
            try {
                const response = await serviceRepository.readServicesAsync(options);
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
                const response = await serviceRepository.readServiceAsync(id);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        put: async (request: UpdateService) => {
            try {
                const response = await serviceRepository.updateServiceAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((services) => {
                    const index = services.data.findIndex((service) => service.id === request.id);
                    if (index !== -1) services.data[index] = response.data;
                    return services;
                });
                toastStore.success(m['update_success']('service'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        remove: async (id: number) => {
            try {
                await serviceRepository.deleteServiceAsync(id);
                update((services) => {
                    services.data = services.data.filter((service) => service.id !== id);
                    return services;
                });
                toastStore.success(m['delete_success']('service'));
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        }
    };
};

export const serviceStore = createServiceStore(); 