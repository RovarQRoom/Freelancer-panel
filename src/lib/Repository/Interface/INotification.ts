import type { NotificationEntity } from '$lib/Model/Entity/Notification';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertNotification, InsertNotificationUser, NotificationUser, UpdateNotification } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface INotification {
    createNotificationAsync(request: InsertNotification): Promise<PostgrestSingleResponse<NotificationEntity>>;
    createNotificationUserAsync(request: InsertNotificationUser[]): Promise<PostgrestSingleResponse<NotificationUser[]>>;
    readNotificationsAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<NotificationEntity[]>>;
    readNotificationAsync(id: number): Promise<PostgrestSingleResponse<NotificationEntity>>;
    updateNotificationAsync(request: UpdateNotification): Promise<PostgrestSingleResponse<NotificationEntity>>;
    deleteNotificationAsync(id: number): Promise<void>;
}
