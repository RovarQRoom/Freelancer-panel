import type { OrderEntity } from '$lib/Model/Entity/Order';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertOrder, UpdateOrder } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IOrder } from '../Interface/IOrder';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class OrderRepository implements IOrder {
    async createOrderAsync(request: InsertOrder): Promise<PostgrestSingleResponse<OrderEntity>> {
        const response = await supabase
            .from('Order')
            .insert(request)
            .select('*, user:User(id,name), extraServices:OrderExtraService(extraService:ExtraService(*)), services:OrderService(service:Service(*))')
            .returns<OrderEntity>()
            .single();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readOrdersAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<OrderEntity[]>> {
        const query = supabase
            .from('Order')
            .select(options?.select ?? '*, user:User(id,name), extraServices:OrderExtraService(extraService:ExtraService(*)), services:OrderService(service:Service(*))', { count: 'exact' });

        if (options?.search) query.textSearch(options.fieldOption ?? 'name', options.search);
        if (options?.from) query.gte('created_at', options.from);
        if (options?.to) query.lte('created_at', options.to);
        if (options?.status) query.eq('status', options.status);
        if (options?.user) query.eq('user', options.user);
        

        const response = await query
            .is('deleted_at', null)
            .order('id', { ascending: false })
            .range(
                ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
                ((options?.page ?? 1) * (options?.limit ?? 10)) - 1
            )
            .returns<OrderEntity[]>();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readOrderAsync(id: number): Promise<PostgrestSingleResponse<OrderEntity>> {
        const response = await supabase
            .from('Order')
            .select('*, user:User(id,name), extraServices:OrderExtraService(extraService:ExtraService(*)), services:OrderService(service:Service(*))')
            .eq('id', id)
            .returns<OrderEntity>()
            .single();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async updateOrderAsync(request: UpdateOrder): Promise<PostgrestSingleResponse<OrderEntity>> {
        const response = await supabase
            .from('Order')
            .update(request)
            .eq('id', request.id!)
            .select('*, user:User(id,name), extraServices:OrderExtraService(extraService:ExtraService(*)), services:OrderService(service:Service(*))')
            .returns<OrderEntity>()
            .single();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async deleteOrderAsync(id: number): Promise<void> {
        const response = await supabase
            .from('Order')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
    }
} 