import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { NotificationEntity } from '$lib/Model/Entity/Notification';
import type { InsertNotification, NotificationUser, InsertNotificationUser, UpdateNotification } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { INotification } from '../Interface/INotification';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class NotificationRepository implements INotification {
    async createNotificationAsync(request: InsertNotification): Promise<PostgrestSingleResponse<NotificationEntity>> {
        const response = await supabase
            .from('Notification')
            .insert(request)
            .select('*,users:NotificationUser(user:User(id,name))')
            .returns<NotificationEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async createNotificationUserAsync(request: InsertNotificationUser[]): Promise<PostgrestSingleResponse<NotificationUser[]>> {
        const response = await supabase
            .from('NotificationUser')
            .insert(request)
            .select('*,user:User(id,name),notification:Notification(id)');
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readNotificationsAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<NotificationEntity[]>> {
        const query = supabase.from('Notification').select(options?.select ?? '*, users:NotificationUser(user:User(id,name))', { count: 'exact' });
        if (options?.search) query.textSearch(options.fieldOption ?? 'title', options.search);
        if (options?.from) query.gte('created_at', options.from);
        if (options?.to) query.lte('created_at', options.to);
        const response = await query
            .is('deleted_at', null)
            .order('id', { ascending: false })
            .range(
                ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
                ((options?.page ?? 1) * (options?.limit ?? 10)) - 1
            )
            .returns<NotificationEntity[]>();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readNotificationAsync(id: number): Promise<PostgrestSingleResponse<NotificationEntity>> {
        const response = await supabase
            .from('Notification')
            .select('*, user:user_id(id,name)')
            .eq('id', id)
            .returns<NotificationEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async updateNotificationAsync(request: UpdateNotification): Promise<PostgrestSingleResponse<NotificationEntity>> {
        const response = await supabase
            .from('Notification')
            .update(request)
            .eq('id', request.id!)
            .select('*')
            .returns<NotificationEntity>()
            .single();
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async deleteNotificationAsync(id: number): Promise<void> {
        const response = await supabase
            .from('Notification')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);
        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
    }
}
