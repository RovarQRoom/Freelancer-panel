<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import { User, Bell, Shield, Archive } from 'lucide-svelte';
	import ProfileTab from './ProfileTab.svelte';
	import NotificationsTab from './NotificationsTab.svelte';
	import SecurityTab from './SecurityTab.svelte';
	import * as m from '$lib/paraglide/messages';
	import RolesTab from './RolesTab.svelte';
	import { authStore } from '$lib/Store/Auth';
	import { checkPremission } from '$lib/Utils/CheckPremission';

	let activeTab = $state('profile');

	const tabs = [
		{ id: 'profile', label: m.profile_settings(), icon: User },
		{ id: 'notifications', label: m.notification_preferences(), icon: Bell },
		{ id: 'security', label: m.security_settings(), icon: Shield },
		{ id: 'roles', label: m.roles(), icon: Archive }
	];
</script>

<div class="min-h-screen p-4 sm:p-6 lg:p-8">
	<div class="mx-auto w-full">
		<!-- Header -->
		<div class="mb-6 sm:mb-8">
			<h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{m.settings()}</h1>
			<p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">{m.manage_account()}</p>
		</div>

		<!-- Settings Container -->
		<div class="grid gap-4 sm:gap-6 lg:grid-cols-[250px,1fr]">
			<!-- Tabs Navigation -->
			<div class="w-full overflow-x-auto lg:overflow-visible">
				<div class="flex flex-row lg:flex-col gap-2 min-w-max lg:min-w-0">
					{#each checkPremission($authStore!, undefined, $authStore?.role?.name) ? tabs : tabs.filter((tab) => tab.id !== 'roles' && tab.id !== 'notifications') as tab}
						<button
							class="flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-left transition-colors
                            whitespace-nowrap w-full
                            {activeTab === tab.id
								? 'bg-blue-600 text-white'
								: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}"
							onclick={() => (activeTab = tab.id)}
						>
							<tab.icon size={18} class="shrink-0" />
							<span class="font-medium text-sm sm:text-base">{tab.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Content Area -->
			<Card class="h-fit w-full max-w-full overflow-hidden bg-white dark:bg-gray-800">
				<div class="overflow-x-auto w-full">
					{#if activeTab === 'profile'}
						<ProfileTab />
					{:else if activeTab === 'notifications'}
						<NotificationsTab />
					{:else if activeTab === 'security'}
						<SecurityTab />
					{:else if activeTab === 'roles'}
						<RolesTab />
					{/if}
				</div>
			</Card>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar styles */
	::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}

	::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.hide-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
