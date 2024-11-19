import type { CartEntity } from '$lib/Model/Entity/Cart';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertCart, UpdateCart } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { ICart } from '../Interface/ICart';
import { supabase } from '$lib/Supabase/supabase';
import { toastStore } from '$lib/Store/Toast';

export class CartRepository implements ICart {
    async createCartAsync(request: InsertCart): Promise<PostgrestSingleResponse<CartEntity>> {
        const response = await supabase
            .from('Cart')
            .insert(request)
            .select('*, user:User(id,name), extraServices:CartExtraService(extraService:ExtraService(*)), services:CartService(service:Service(*))')
            .returns<CartEntity>()
            .single();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readCartsAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<CartEntity[]>> {
        const query = supabase
            .from('Cart')
            .select(options?.select ?? '*, user:User(id,name), extraServices:CartExtraService(extraService:ExtraService(*)), services:CartService(service:Service(*))', { count: 'exact' });

        if (options?.search) query.textSearch(options.fieldOption ?? 'name', options.search);
        if (options?.from) query.gte('created_at', options.from);
        if (options?.to) query.lte('created_at', options.to);

        const response = await query
            .is('deleted_at', null)
            .order('id', { ascending: false })
            .range(
                ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
                ((options?.page ?? 1) * (options?.limit ?? 10)) - 1
            )
            .returns<CartEntity[]>();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async readCartAsync(id: number): Promise<PostgrestSingleResponse<CartEntity>> {
        const response = await supabase
            .from('Cart')
            .select('*, user:User(id,name), extraServices:CartExtraService(extraService:ExtraService(*)), services:CartService(service:Service(*))')
            .eq('id', id)
            .returns<CartEntity>()
            .single();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async updateCartAsync(request: UpdateCart): Promise<PostgrestSingleResponse<CartEntity>> {
        const response = await supabase
            .from('Cart')
            .update(request)
            .eq('id', request.id!)
            .select('*, user:User(id,name), extraServices:CartExtraService(extraService:ExtraService(*)), services:CartService(service:Service(*))')
            .returns<CartEntity>()
            .single();

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
        return response;
    }

    async deleteCartAsync(id: number): Promise<void> {
        const response = await supabase
            .from('Cart')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (response.error) {
            toastStore.error(response.error.message);
            throw new Error(response.error.message);
        }
    }
} 