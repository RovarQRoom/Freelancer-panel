// src/hooks.server.ts
import { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
const handleParaglide: Handle = i18n.handle();

export const handle: Handle = async ({ event, resolve }) => {
	// Run Paraglide handle first
	return handleParaglide({
		event,
		resolve: async (event) => {
			// Then run the Supabase handle
			event.locals.supabase = createServerClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
				cookies: {
					getAll: () => event.cookies.getAll(),
					setAll: (cookiesToSet) => {
						cookiesToSet.forEach(({ name, value, options }) => {
							event.cookies.set(name, value, { ...options, path: '/' });
						});
					}
				}
			});

			event.locals.safeGetSession = async () => {
				const {
					data: { session }
				} = await event.locals.supabase.auth.getSession();
				if (!session) {
					return { session: null, user: null };
				}

				const {
					data: { user },
					error
				} = await event.locals.supabase.auth.getUser();
				if (error) {
					// JWT validation has failed
					return { session: null, user: null };
				}

				return { session, user };
			};

			return resolve(event, {
				filterSerializedResponseHeaders(name) {
					return name === 'content-range' || name === 'x-supabase-api-version';
				}
			});
		}
	});
};
