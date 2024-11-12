import type { InsertUser } from "$lib/Supabase/Types/database.types";

export class UserRequest implements InsertUser {
    auth?: string | null | undefined;
    created_at?: string | undefined;
    deleted_at?: string | null | undefined;
    id?: number | undefined;
    image?: string | null | undefined;
    name?: string | null | undefined;
    role?: number | null | undefined;
    phone: string = '';
    email: string = '';
    password: string = '';
}