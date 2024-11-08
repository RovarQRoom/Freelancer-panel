import type { UserEntity } from '$lib/Model/Entity/User';
import type { InsertUser } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IAuthRepository } from '../Interface/IAuth';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class AuthRepository implements IAuthRepository {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async createAsync(request: InsertUser): Promise<PostgrestSingleResponse<UserEntity>> {
		throw new Error('Method not implemented.');
	}
	async getUserAsync(): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase.auth.getUser();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		const user = await supabase
			.from('User')
			.select('*')
			.eq('auth', response.data.user.id)
			.returns<UserEntity>()
			.single();
		if (user.error) {
			toastStore.error(user.error.message);
			throw new Error(user.error.message);
		}
		return user;
	}
	async loginAsync(email: string, password: string): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		const user = await supabase
			.from('User')
			.select('*')
			.eq('auth', response.data.user.id)
			.returns<UserEntity>()
			.single();
		if (user.error) {
			toastStore.error(user.error.message);
			throw new Error(user.error.message);
		}
		return user;
	}
	async logoutAsync(): Promise<void> {
		const response = await supabase.auth.signOut();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
	}
}
