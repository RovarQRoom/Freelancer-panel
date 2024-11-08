import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase) {
		throw redirect(302, '/login');
	}
	// You can fetch any dashboard data here
	return {
		stats: {
			users: 1234,
			revenue: 45600,
			orders: 789,
			conversion: 1.2
		}
	};
};
