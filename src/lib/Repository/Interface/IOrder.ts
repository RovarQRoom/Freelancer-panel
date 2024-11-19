import type { OrderEntity } from '$lib/Model/Entity/Order';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertOrder, UpdateOrder } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface IOrder {
    createOrderAsync(request: InsertOrder): Promise<PostgrestSingleResponse<OrderEntity>>;
    readOrdersAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<OrderEntity[]>>;
    readOrderAsync(id: number): Promise<PostgrestSingleResponse<OrderEntity>>;
    updateOrderAsync(request: UpdateOrder): Promise<PostgrestSingleResponse<OrderEntity>>;
    deleteOrderAsync(id: number): Promise<void>;
} 