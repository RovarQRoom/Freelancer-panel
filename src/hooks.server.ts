// src/hooks.server.ts
import { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';
const handleParaglide: Handle = i18n.handle();

const supabase: Handle = async ({ event, resolve }) => {

	event.locals.supabase = createServerClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
	  cookies: {
		getAll: () => event.cookies.getAll(),
		setAll: (cookiesToSet) => {
		  cookiesToSet.forEach(({ name, value, options }) => {
			event.cookies.set(name, value, { ...options, path: '/' })
		  })
		},
	  },
	})
  
	event.locals.safeGetSession = async () => {
	  const {
		data: { session },
	  } = await event.locals.supabase.auth.getSession()
	  if (!session) {
		return { session: null, user: null }
	  }
  
	  const {
		data: { user },
		error,
	  } = await event.locals.supabase.auth.getUser()
	  if (error) {
		return { session: null, user: null }
	  }
  
	  return { session, user }
	}
  
	return resolve(event, {
	  filterSerializedResponseHeaders(name) {
		/**
		 * Supabase libraries use the `content-range` and `x-supabase-api-version`
		 * headers, so we need to tell SvelteKit to pass it through.
		 */
		return name === 'content-range' || name === 'x-supabase-api-version'
	  },
	})
  }
  
  const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession()
	event.locals.session = session
	event.locals.user = user
  
	// List of public routes that don't require authentication
	const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
	const isPublicRoute = publicRoutes.some(route => event.url.pathname.startsWith(route))
  
	// Redirect to login if not authenticated and trying to access protected route
	if (!session && !isPublicRoute) {
	  throw redirect(303, '/login')
	}
  
	// Redirect to home if authenticated and trying to access login/register pages
	if (session && isPublicRoute) {
	  throw redirect(303, '/')
	}
  
	return resolve(event)
  }
  
  export const handle: Handle = sequence(supabase, authGuard, handleParaglide)
