import type { UserEntity } from '$lib/Model/Entity/User';
import type { InsertUser } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IAuthRepository {
	createAsync(request: InsertUser): Promise<PostgrestSingleResponse<UserEntity>>;
	getUserAsync(): Promise<PostgrestSingleResponse<UserEntity>>;
	checkPasswordAsync(id: string, password: string): Promise<PostgrestSingleResponse<boolean>>;
	updatePasswordAsync(password: string): Promise<void>;
	loginAsync(email: string, password: string): Promise<PostgrestSingleResponse<UserEntity>>;
	logoutAsync(): Promise<void>;
}
