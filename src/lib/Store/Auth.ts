import { writable } from 'svelte/store';
import type { UserEntity } from '$lib/Model/Entity/User';
import * as m from '$lib/paraglide/messages.js';
import { toastStore } from './Toast';
import type { InsertUser } from '$lib/Supabase/Types/database.types';
import { AuthRepository } from '$lib/Repository/implementation/Auth';
import { UserRepository } from '$lib/Repository/implementation/User';
import type { UpdateUserPassword } from '$lib/Model/Request/User';

const authRepository = new AuthRepository();
const usersRepository = new UserRepository();

const createAuthStore = () => {
	const { subscribe, set } = writable<UserEntity | null>(null);
	return {
		subscribe,
		set: async (data: UserEntity | null) => set(data),
		insert: async (request: InsertUser) => {
			try {
				const checkEmail = await usersRepository.readUserByEmailAsync(request.email);
				if (checkEmail.data) {
					toastStore.error(m.email_already_exists());
					throw new Error(m.email_already_exists());
				}
				const checkPhone = await usersRepository.readUserByPhoneAsync(request.phone);
				if (checkPhone.data) {
					toastStore.error(m.phone_number_already_exists());
					throw new Error(m.phone_number_already_exists());
				}
				const response = await authRepository.createAsync(request);
				if (response.error) {
					toastStore.error(m.failed_to_create_user());
					throw new Error(response.error.message);
				}
				toastStore.success(m.user_created_successfully());
				return response;
			} catch (error) {
				toastStore.error(m.failed_to_create_user());
				throw error;
			}
		},
		fetch: async () => {
			try {
				const response = await authRepository.getUserAsync();
				if (response.error) {
					toastStore.error(m.failed_to_get_user());
					throw new Error(response.error.message);
				}
				set(response.data);
				return response;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				toastStore.error(m.failed_to_get_user());
				set(null);
				return null;
			}
		},
		putPassword: async (request: UpdateUserPassword) => {
			try {
				const response = await authRepository.checkPasswordAsync(request.id, request.currentPassword);
				if (!response.data) {
					toastStore.error(m.incorrect_current_password());
					throw new Error(m.incorrect_current_password());
				}
				if(request.newPassword !== request.confirmPassword) {
					toastStore.error(m.password_not_match());
					throw new Error(m.password_not_match());
				}
				await authRepository.updatePasswordAsync(request.newPassword);
				toastStore.success(m.password_updated_successfully());
				return response;
			} catch (error) {
				toastStore.error(m.failed_to_update_password());
				throw error;
			}
		},
		login: async (email: string, password: string) => {
			try {
				console.log(email, password);
				
				const response = await authRepository.loginAsync(email, password);
				if (response.error) {
					toastStore.error(m.failed_to_login());
					throw new Error(response.error.message);
				}
				set(response.data);
				return response;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				toastStore.error(m.failed_to_login());
				set(null);
			}
		},
		logout: async () => {
			try {
				await authRepository.logoutAsync();
				set(null);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				toastStore.error(m.failed_to_logout());
				set(null);
			}
		}
	};
};

export const authStore = createAuthStore();
