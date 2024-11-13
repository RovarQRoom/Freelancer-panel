import { SECRET_SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { VITE_SUPABASE_URL } from "$env/static/public";
import type { Database } from "$lib/Supabase/Types/database.types";
import { createClient } from "@supabase/supabase-js";
import type { RequestHandler } from "@sveltejs/kit";

const server = createClient<Database>(
	VITE_SUPABASE_URL,
	SECRET_SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);

export const PUT: RequestHandler = async ({ request }) => {
	const userRequest: { id: string; password: string } = await request.json();
	try {
		const authUser = await server.auth.admin.updateUserById(userRequest.id, {
			password: userRequest.password
		});
		if (!authUser || authUser.error) {
			return new Response('Failed to update user', { status: 500 });
		}
		return new Response('User updated successfully', { status: 200 });
	} catch (error) {
		console.error('Failed to update user', { error });
		return new Response('Failed to update user', { status: 500 });
	}
};
