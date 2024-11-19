import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { UserEntity } from '$lib/Model/Entity/User';
import type { UpdateUser } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IUsersRepository } from '../Interface/IUser';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';
import type { UserRequest } from '$lib/Model/Request/User';

export class UserRepository implements IUsersRepository {
	async createUserAsync(request: UserRequest): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await fetch('/api/user/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});
		if (!response.ok) {
			throw new Error('Failed to create user');
		}
		const user = (await response.json()) as PostgrestSingleResponse<UserEntity>;
		return user;
	}
	async readUserAsync(id: number): Promise<PostgrestSingleResponse<UserEntity>> {
		const response = await supabase
			.from('User')
			.select('*,role:Role(id,name)')
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
				(options?.page ?? 1) * (options?.limit ?? 10) - 1
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
	async checkEmailAsync(
		email: string,
		id?: number
	): Promise<PostgrestSingleResponse<UserEntity> | null> {
		const query = supabase.from('User').select('id,email').eq('email', email);

		if (id) {
			query.neq('id', id);
		}

		const response = await query.returns<UserEntity>().single();

		if (response.error) {
			toastStore.error(response.error.message);
			return null;
		}
		return response;
	}
	async checkPhoneAsync(
		phone: string,
		id?: number
	): Promise<PostgrestSingleResponse<UserEntity> | null> {
		const query = supabase.from('User').select('id,phone').eq('phone', phone);

		if (id) {
			query.neq('id', id);
		}

		const response = await query.returns<UserEntity>().single();

		if (response.error) {
			toastStore.error(response.error.message);
			return null;
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
