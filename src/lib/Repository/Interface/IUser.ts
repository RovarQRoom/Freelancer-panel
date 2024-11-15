import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { UserEntity } from '$lib/Model/Entity/User';
import type { InsertUser, UpdateUser } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IUsersRepository {
	createUserAsync(request: InsertUser): Promise<PostgrestSingleResponse<UserEntity>>;
	readUserAsync(id: number): Promise<PostgrestSingleResponse<UserEntity>>;
	readUsersAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<Array<UserEntity>>>;
	readUserByEmailAsync(email: string): Promise<PostgrestSingleResponse<UserEntity>>;
	readUserByPhoneAsync(phone: string): Promise<PostgrestSingleResponse<UserEntity>>;
	checkEmailAsync(id: number, email: string): Promise<PostgrestSingleResponse<UserEntity> | null>;
	checkPhoneAsync(id: number, phone: string): Promise<PostgrestSingleResponse<UserEntity> | null>;
	updateUserAsync(request: UpdateUser): Promise<PostgrestSingleResponse<UserEntity>>;
	deleteUserAsync(id: number): Promise<PostgrestSingleResponse<UserEntity>>;
}
