import type { RoleEntity } from '$lib/Model/Entity/Role';
import { RoleRepository } from '$lib/Repository/implementation/Role';
import type { InsertRole, UpdateRole } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const roleRepository = new RoleRepository();

const createRoleStore = () => {
    const { subscribe, update, set } = writable<Store<RoleEntity>>(new Store<RoleEntity>());
    
    return {
        subscribe,
        
        insert: async (request: InsertRole) => {
            try {
                const response = await roleRepository.createRoleAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((roles) => {
                    roles.data.push(response.data);
                    return roles;
                });
                toastStore.success(m['create_success']('role'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        fetchAll: async (options?: GenericListOptions) => {
            try {
                const response = await roleRepository.readRolesAsync(options);
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

        fetchForDropdown: async (options?: GenericListOptions) => {
            const response = await roleRepository.readRolesAsync(options);
            return response.data;
        },

        fetch: async (id: number) => {
            try {
                const response = await roleRepository.readRoleAsync(id);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        put: async (request: UpdateRole) => {
            try {
                const response = await roleRepository.updateRoleAsync(request);
                if (response.error) {
                    throw new Error(response.error.message);
                }
                update((roles) => {
                    const index = roles.data.findIndex((role) => role.id === request.id);
                    if (index !== -1) roles.data[index] = response.data;
                    return roles;
                });
                toastStore.success(m['update_success']('role'));
                return response.data;
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        },

        upsertPolicies: async (roleId: number, policies: number[]) => {
           try {
             const response = await roleRepository.updateRolePoliciesAsync(roleId,policies);
             if (response.error) {
                 throw new Error(response.error.message);
             }
             return response.data;
           } catch (error) {
            if (error instanceof Error) toastStore.error(error.message);
           }
        },

        remove: async (id: number) => {
            try {
                await roleRepository.deleteRoleAsync(id);
                update((roles) => {
                    roles.data = roles.data.filter((role) => role.id !== id);
                    return roles;
                });
                toastStore.success(m['delete_success']('role'));
            } catch (error) {
                if (error instanceof Error) toastStore.error(error.message);
            }
        }
    };
};

export const roleStore = createRoleStore(); 