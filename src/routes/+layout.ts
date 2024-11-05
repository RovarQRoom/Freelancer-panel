// src/routes/+layout.ts
import { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');
	const supabase = isBrowser()
		? createBrowserClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const user = session?.user ?? null;

	return {
		supabase,
		session,
		user,
		pageTransition: {
			duration: 200,
			easing: 'ease-in-out',
			css: true
		}
	};
};
