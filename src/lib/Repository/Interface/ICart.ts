import type { CartEntity } from '$lib/Model/Entity/Cart';
import type { GenericListOptions } from '$lib/Model/Common/ListOption';
import type { InsertCart, UpdateCart } from '$lib/Supabase/Types/database.types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface ICart {
    createCartAsync(request: InsertCart): Promise<PostgrestSingleResponse<CartEntity>>;
    readCartsAsync(options?: GenericListOptions): Promise<PostgrestSingleResponse<CartEntity[]>>;
    readCartAsync(id: number): Promise<PostgrestSingleResponse<CartEntity>>;
    updateCartAsync(request: UpdateCart): Promise<PostgrestSingleResponse<CartEntity>>;
    deleteCartAsync(id: number): Promise<void>;
} 