import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { RoleEntity } from '$lib/Model/Entity/Role';
import type { InsertRole, UpdateRole } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IRole {
    createRoleAsync(request: InsertRole): Promise<PostgrestSingleResponse<RoleEntity>>;
    readRolesAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<RoleEntity[]>>;
    readRoleAsync(id: number): Promise<PostgrestSingleResponse<RoleEntity>>;
    updateRoleAsync(request: UpdateRole): Promise<PostgrestSingleResponse<RoleEntity>>;
    updateRolePoliciesAsync(roleId: number, policies: number[]): Promise<PostgrestSingleResponse<{ id: number }[]>>;
    deleteRoleAsync(id: number): Promise<void>;
}
