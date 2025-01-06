import type { UserEntity } from '$lib/Model/Entity/User';
import { UserRepository } from '$lib/Repository/implementation/User';
import type { UpdateUser } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages.js';
import type { UserRequest } from '$lib/Model/Request/User';

const userRepository = new UserRepository();

const createUserStore = () => {
	const { subscribe, update, set } = writable<Store<UserEntity>>(new Store<UserEntity>());
	return {
		subscribe,

		insert: async (request: UserRequest) => {
			try {
				if (request.phone) {
					const checkPhone = await userRepository.checkPhoneAsync(request.phone);
					if (checkPhone && checkPhone?.data) {
						throw new Error(m.phone_already_exists());
					}
				}
				if (request.email) {
					const checkEmail = await userRepository.checkEmailAsync(request.email, request.id);
					if (checkEmail && checkEmail?.data) {
						throw new Error(m.email_already_exists());
					}
				}
				const response = await userRepository.createUserAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((users) => {
					users.data.push(response.data);
					return users;
				});
				toastStore.success(m['create_success']('user'));
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		fetchAll: async (options?: GenericListOptions) => {
			try {
				console.log('User FetchAll', options);

				const response = await userRepository.readUsersAsync(options);
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
		fetchForDropdown: async (filter?: GenericListOptions) => {
			const response = await userRepository.readUsersAsync(filter);
			return response.data;
		},

		fetch: async (id: number) => {
			try {
				const response = await userRepository.readUserAsync(id);
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		fetchByEmail: async (email: string) => {
			try {
				const response = await userRepository.readUserByEmailAsync(email);
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		fetchByPhone: async (phone: string) => {
			try {
				const response = await userRepository.readUserByPhoneAsync(phone);
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		put: async (request: UpdateUser) => {
			try {
				if (request.email) {
					const checkEmail = await userRepository.checkEmailAsync(request.email, request.id);
					if (checkEmail && checkEmail?.data) {
						throw new Error(m.email_already_exists());
					}
				}
				if (request.phone) {
					const checkPhone = await userRepository.checkPhoneAsync(request.phone, request.id);
					if (checkPhone && checkPhone?.data) {
						throw new Error(m.phone_already_exists());
					}
				}
				const response = await userRepository.updateUserAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((users) => {
					const index = users.data.findIndex((user) => user.id === request.id);
					if (index !== -1) users.data[index] = response.data;
					return users;
				});
				toastStore.success(m['update_success']());
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		remove: async (id: number) => {
			try {
				await userRepository.deleteUserAsync(id);
				toastStore.success(m['delete_success']('user'));
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		}
	};
};

export const userStore = createUserStore();
