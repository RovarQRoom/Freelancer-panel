import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth')

  const supabase = isBrowser()
    ? createBrowserClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return data.cookies
          },
        },
      })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { session, supabase, user }
}