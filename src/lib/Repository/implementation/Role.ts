import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { RoleEntity } from '$lib/Model/Entity/Role';
import type { InsertRole, UpdateRole } from '$lib/Supabase/Types/database.types';
import { supabase } from '$lib/Supabase/supabase';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IRole } from '../Interface/IRole';
import { toastStore } from '$lib/Store/Toast';

export class RoleRepository implements IRole {
    async createRoleAsync(request: InsertRole): Promise<PostgrestSingleResponse<RoleEntity>> {
        const response = await supabase
            .from('Role')
            .insert(request)
            .select('*,policies:RolePolicy(count)')
            .returns<RoleEntity>()
            .single();
        
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readRolesAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<RoleEntity[]>> {
        const query = supabase.from('Role').select(options?.select ?? '*', { count: 'exact' });
        
        if (options?.search) query.textSearch(options.fieldOption ?? 'name', options.search);
        if (options?.from) query.gte('created_at', options.from);
        if (options?.to) query.lte('created_at', options.to);
        
        const response = await query
            .order(options?.orderBy ?? 'id', { ascending: options?.order ?? false })
            .range(
                ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
                ((options?.page ?? 1) * (options?.limit ?? 10)) - 1
            )
            .returns<RoleEntity[]>();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readRoleAsync(id: number): Promise<PostgrestSingleResponse<RoleEntity>> {
        const response = await supabase
            .from('Role')
            .select('*,policies:RolePolicy(policy:Policy(id,name))')
            .eq('id', id)
            .returns<RoleEntity>()
            .single();
        
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async updateRoleAsync(request: UpdateRole): Promise<PostgrestSingleResponse<RoleEntity>> {
        const response = await supabase
            .from('Role')
            .update(request)
            .eq('id', request.id!)
            .select('*,policies:RolePolicy(count)')
            .returns<RoleEntity>()
            .single();
        
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }
    async updateRolePoliciesAsync(roleId: number, policies: number[]): Promise<PostgrestSingleResponse<{ id: number }[]>> {
        // First delete all existing policies for this role
        const deleteResponse = await supabase
            .from('RolePolicy')
            .delete()
            .eq('role', roleId);
        
        if (deleteResponse.error) {
            toastStore.error(deleteResponse.error.message);
            throw new Error(deleteResponse.error.message);
        }

        // Then insert the new policies
        const insertResponse = await supabase
            .from('RolePolicy')
            .insert(
                policies.map(policy => ({ role: roleId, policy: policy }))
            )
            .select('id')
            .returns<{ id: number }[]>();
        
        if (insertResponse.error) {
            toastStore.error(insertResponse.error.message);
            throw new Error(insertResponse.error.message);
        }

        return insertResponse;
    }

    async deleteRoleAsync(id: number): Promise<void> {
        const response = await supabase
            .from('Role')
            .delete()
            .eq('id', id);
        
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
    }
}
