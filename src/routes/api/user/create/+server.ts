import { SECRET_SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { VITE_SUPABASE_URL } from "$env/static/public";
import type { UserEntity } from "$lib/Model/Entity/User";
import type { UserRequest } from "$lib/Model/Request/User";
import type { Database } from "$lib/Supabase/Types/database.types";
import { createClient } from "@supabase/supabase-js";
import type { RequestHandler } from "@sveltejs/kit";

const server = createClient<Database>(
  VITE_SUPABASE_URL,
  SECRET_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export const POST: RequestHandler = async ({ request }) => {
  const userRequest: UserRequest = await request.json();
  try {
    const authUser = await server.auth.admin.createUser({
      email: userRequest.email,
      password: userRequest.password,
      email_confirm: true,
    });
    if (!authUser || authUser.error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to create user",
          data: { error: authUser.error },
        }),
      );
    }
    const user = await server
      .from("User")
      .insert({
        email: authUser.data.user.email || '',
        phone: userRequest.phone || '',
        name: userRequest.name || '',
        role: userRequest.role || 4,
        image: userRequest.image || '',
        auth: authUser.data.user.id,
      })
      .select("*,Role(name)")
      .returns<UserEntity>()
      .single();
    if (!user || user.error) {
      await server.auth.admin.deleteUser(authUser.data.user.id);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to create user",
          data: { error: user.error },
        }),
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully",
        data: user,
      }),
    );
  } catch (error) {
    console.log("Failed to operate on user", { error });
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to operate on user",
        data: { error },
      }),
    );
  }
};