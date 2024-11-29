<script lang="ts">
	import { UpdateUserPassword } from '$lib/Model/Request/User';
	import * as m from '$lib/paraglide/messages';
	import { authStore } from '$lib/Store/Auth';
	let updatePassword = $state({ ...new UpdateUserPassword(), id: $authStore?.auth ?? '' });
	let isLoading = $state(false);

	const updatePasswordHandler = async () => {
		isLoading = true;
		try {
			await authStore.putPassword(updatePassword);
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
			updatePassword = { ...new UpdateUserPassword(), id: $authStore?.auth ?? '' };
		}
	};
</script>

<div class="space-y-6">
	<h2 class="text-xl font-bold text-gray-800 dark:text-white">{m.security_settings()}</h2>

	<div class="space-y-4">
		<div class="rounded-lg border p-4 dark:border-gray-700">
			<h3 class="mb-3 font-medium text-gray-800 dark:text-white">{m.change_password()}</h3>
			<div class="space-y-3">
				<input
					type="password"
					placeholder={m.current_password()}
					class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
					bind:value={updatePassword.currentPassword}
				/>
				<input
					type="password"
					placeholder={m.new_password()}
					class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
					bind:value={updatePassword.newPassword}
				/>
				<input
					type="password"
					placeholder={m.confirm_password()}
					class="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
					bind:value={updatePassword.confirmPassword}
				/>
				<button
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					disabled={isLoading}
					onclick={updatePasswordHandler}
				>
					{m.update_password()}
				</button>
			</div>
		</div>

		<!-- <div class="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
			<div>
				<h3 class="font-medium text-gray-800 dark:text-white">{m.two_factor_auth()}</h3>
				<p class="text-sm text-gray-500">{m.two_factor_auth_desc()}</p>
			</div>
			<button
				class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
			>
				{m.enable()}
			</button>
		</div> -->
	</div>
</div>
