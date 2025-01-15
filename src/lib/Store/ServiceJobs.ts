import type { ServiceJobEntity } from '$lib/Model/Entity/ServiceJob';
import { ServiceJobRepository } from '$lib/Repository/implementation/ServiceJob';
import type { InsertServiceJob, UpdateServiceJob } from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';

const serviceJobRepository = new ServiceJobRepository();

const createServiceJobStore = () => {
	const { subscribe, update, set } = writable<Store<ServiceJobEntity>>(
		new Store<ServiceJobEntity>()
	);

	return {
		subscribe,

		insert: async (request: InsertServiceJob) => {
			try {
				const response = await serviceJobRepository.createServiceJobAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((serviceJobs) => {
					serviceJobs.data.push(response.data);
					return serviceJobs;
				});
				toastStore.success(m['create_success']('service job'));
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		fetchAll: async (options?: GenericListOptions) => {
			try {
				const response = await serviceJobRepository.readServiceJobsAsync(options);
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

		fetch: async (id: number) => {
			try {
				const response = await serviceJobRepository.readServiceJobAsync(id);
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		put: async (request: UpdateServiceJob) => {
			try {
				const response = await serviceJobRepository.updateServiceJobAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((serviceJobs) => {
					const index = serviceJobs.data.findIndex((serviceJob) => serviceJob.id === request.id);
					if (index !== -1) serviceJobs.data[index] = response.data;
					return serviceJobs;
				});
				toastStore.success(m['update_success']('service job'));
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		remove: async (id: number) => {
			try {
				await serviceJobRepository.deleteServiceJobAsync(id);
				update((serviceJobs) => {
					serviceJobs.data = serviceJobs.data.filter((serviceJob) => serviceJob.id !== id);
					return serviceJobs;
				});
				toastStore.success(m['delete_success']('service job'));
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		}
	};
};

export const serviceJobStore = createServiceJobStore();
