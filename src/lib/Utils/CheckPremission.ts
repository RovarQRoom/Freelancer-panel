import type { PolicyEntity } from '$lib/Model/Entity/Policy';
import type { UserEntity } from '$lib/Model/Entity/User';
import { Role } from '$lib/Model/Enum/Role';

export function checkPremission(
	auth: UserEntity,
	policies?: { policy: PolicyEntity }[],
	role?: string
): boolean {
	if (auth.isAdmin) return true;
	if (role === Role.Superadmin || role === Role.Admin) return true;
	if (!policies) return false;
	return policies.some(
		(p) => p.policy.id === auth.role?.policies?.find((p) => p.policy.id === p.policy.id)?.policy.id
	);
}

export function checkPremissionOnRoute(auth: UserEntity, policies?: number[], role?: string) {
	if (auth.isAdmin) return true;
	if (role === Role.Superadmin || role === Role.Admin) return true;
	if (!policies) return true;
	if (!auth.role?.policies) return false;

	return policies.some((policy) =>
		auth.role!.policies!.some((userPolicy) => userPolicy.policy.id === policy)
	);
}

export function filterNavItemsByPermission(
	auth: UserEntity,
	navItems: Array<{ href: string; label: string; policies?: number[] }>
): Array<{ href: string; label: string; policies?: number[] }> {
	if (!auth) return [];
	if (auth.isAdmin) return navItems;
	return navItems.filter((item) => {
		if (!item.policies) return true;
		return checkPremissionOnRoute(auth, item.policies, auth.role?.name);
	});
}
