<script lang="ts">
	import { Button, Card, Label, Input } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { toastStore } from '$lib/Store/Toast';
	import { authStore } from '$lib/Store/Auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let loading = $state(false);	
	let userData = $state<{email: string, password: string}>({email: '', password: ''});

	onMount(async () => {
		await checkAuth();
	});

	async function handleSubmit() {
		loading = true;
		try {
			await authStore.login(userData.email, userData.password);
			checkAuth();
		} catch (error) {
			if (error instanceof Error) {
				toastStore.error(error.message);
			} else {
				toastStore.error(m.failed_to_login());
			}
			goto('/login');
		} finally {
			loading = false;
			userData = {email: '', password: ''};
		}
	}

	async function checkAuth() {
		const response = await authStore.fetch();
		if (response) {
			goto('/');
		} else {
			goto('/login');
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-main-light-100 dark:bg-main-dark-100">
	<div class="w-full max-w-md p-4">
		<Card class="shadow-lg">
			<form 
				class="flex flex-col space-y-6" 
				onsubmit={handleSubmit} 
			>
				<h3 class="text-center text-2xl font-bold text-main-light-900 dark:text-main-dark-900">
					{m.login()}
				</h3>

				<div>
					<Label for="email" class="mb-2">{m.email()}</Label>
					<Input
						id="email"
						name="email"
						type="email"
						bind:value={userData.email}
						placeholder="name@company.com"
						required
						class="focus:border-primary-light-500 focus:ring-primary-light-500 dark:focus:border-primary-dark-500 dark:focus:ring-primary-dark-500"
					/>
				</div>

				<div>
					<Label for="password" class="mb-2">{m.password()}</Label>
					<Input
						id="password"
						name="password"
						type="password"
						bind:value={userData.password}
						placeholder="••••••••"
						required
						class="focus:border-primary-light-500 focus:ring-primary-light-500 dark:focus:border-primary-dark-500 dark:focus:ring-primary-dark-500"
					/>
				</div>

				<Button type="submit" class="w-full" color="blue" disabled={loading} >
					{#if loading}
						<svg
							class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						{m.loading()}
					{:else}
						{m.sign_in()}
					{/if}
				</Button>
			</form>
		</Card>
	</div>
</div>
