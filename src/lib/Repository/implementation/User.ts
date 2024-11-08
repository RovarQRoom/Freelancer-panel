import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { UserEntity } from '$lib/Model/Entity/User';
import type { InsertUser, UpdateUser } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IUsersRepository } from '../Interface/IUser';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class UserRepository implements IUsersRepository {
	async createUserAsync(request: InsertUser): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase
			.from('User')
			.insert(request)
			.select('*')
			.returns<UserEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readUserAsync(id: number): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase
			.from('User')
			.select('*')
			.eq('id', id)
			.returns<UserEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readUsersAsync(
		options?: GenericListOptions
	): Promise<PostgrestSingleResponse<Array<UserEntity>>> {
		const query = supabase.from('User').select(options?.select ?? '*', { count: 'exact' });
		if (options?.search) query.textSearch(options.fieldOption ?? 'name', options.search);
		if (options?.from) query.gte('created_at', options.from);
		if (options?.to) query.lte('created_at', options.to);
		return query
			.is('deleted_at', null)
			.order('id', { ascending: false })
			.range(
				((options?.page ?? 1) - 1) * (options?.limit ?? 10),
				(options?.page ?? 1) * (options?.limit ?? 10)
			)
			.returns<UserEntity[]>();
	}
	async readUserByEmailAsync(email: string): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase
			.from('User')
			.select('*')
			.eq('email', email)
			.returns<UserEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async readUserByPhoneAsync(phone: string): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase
			.from('User')
			.select('*')
			.eq('phone', phone)
			.returns<UserEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async updateUserAsync(request: UpdateUser): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase
			.from('User')
			.update(request)
			.eq('id', request.id!)
			.select('*')
			.returns<UserEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
	async deleteUserAsync(id: number): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase
			.from('User')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id)
			.select('*')
			.returns<UserEntity>()
			.single();
		if (response.error) {
			toastStore.error(response.error.message);
			throw new Error(response.error.message);
		}
		return response;
	}
}
