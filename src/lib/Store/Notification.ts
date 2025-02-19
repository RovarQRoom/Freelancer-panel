import type { NotificationEntity } from '$lib/Model/Entity/Notification';
import { NotificationRepository } from '$lib/Repository/implementation/Notification';
import type {
	InsertNotification,
	InsertNotificationUser,
	UpdateNotification
} from '$lib/Supabase/Types/database.types';
import { writable } from 'svelte/store';
import { toastStore } from './Toast';
import { Store } from '$lib/Model/Extention/Store';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import * as m from '$lib/paraglide/messages';
import { supabase } from '$lib/Supabase/supabase';

const notificationRepository = new NotificationRepository();

const createNotificationStore = () => {
	const { subscribe, update, set } = writable<Store<NotificationEntity>>(
		new Store<NotificationEntity>()
	);

	return {
		subscribe,
		set,
		update,
		insert: async (request: InsertNotification) => {
			try {
				const response = await notificationRepository.createNotificationAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((notifications) => {
					notifications.data.push(response.data);
					return notifications;
				});
				toastStore.success(m['create_success']('notification'));
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},
		insertNotificationUser: async (
			request: InsertNotificationUser[],
			notification?: NotificationEntity
		) => {
			try {
				const response = await notificationRepository.createNotificationUserAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				for (const notificationUser of response.data) {
					const channel = supabase.channel(`notification:${notificationUser.user?.id}`);
					if (notification) {
						notification.users = [notificationUser];
					}
					channel.send({
						type: 'broadcast',
						event: 'notification',
						payload: notification
					});
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		fetchAll: async (options?: GenericListOptions) => {
			try {
				const response = await notificationRepository.readNotificationsAsync(options);
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
				const response = await notificationRepository.readNotificationAsync(id);
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		put: async (request: UpdateNotification) => {
			try {
				const response = await notificationRepository.updateNotificationAsync(request);
				if (response.error) {
					throw new Error(response.error.message);
				}
				update((notifications) => {
					const index = notifications.data.findIndex(
						(notification) => notification.id === request.id
					);
					if (index !== -1) notifications.data[index] = response.data;
					return notifications;
				});
				toastStore.success(m['update_success']('notification'));
				return response.data;
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		},

		remove: async (id: number) => {
			try {
				await notificationRepository.deleteNotificationAsync(id);
				update((notifications) => {
					notifications.data = notifications.data.filter((notification) => notification.id !== id);
					return notifications;
				});
				toastStore.success(m['delete_success']('notification'));
			} catch (error) {
				if (error instanceof Error) toastStore.error(error.message);
			}
		}
	};
};

export const notificationStore = createNotificationStore();
