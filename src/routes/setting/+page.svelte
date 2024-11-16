<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import { User, Bell, Shield, Archive } from 'lucide-svelte';
    import ProfileTab from './ProfileTab.svelte';
    import NotificationsTab from './NotificationsTab.svelte';
    import SecurityTab from './SecurityTab.svelte';
    import * as m from '$lib/paraglide/messages';
	import RolesTab from './RolesTab.svelte';

    let activeTab = $state('profile');
    
    const tabs = [
        { id: 'profile', label: m.profile_settings(), icon: User },
        { id: 'notifications', label: m.notification_preferences(), icon: Bell },
        { id: 'security', label: m.security_settings(), icon: Shield },
        { id: 'roles', label: m.roles(), icon: Archive },
    ];
</script>

<div class="min-h-screen bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 lg:p-8">
    <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">{m.settings()}</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{m.manage_account()}</p>
        </div>

        <!-- Settings Container -->
        <div class="grid gap-6 lg:grid-cols-[280px,1fr]">
            <!-- Tabs Navigation -->
            <div class="overflow-x-auto lg:overflow-visible">
                <div class="flex gap-2 lg:flex-col lg:gap-1">
                    {#each tabs as tab}
                        <button
                            class="flex min-w-[140px] items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors
                                {activeTab === tab.id ? 
                                'bg-blue-600 text-white' : 
                                'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}"
                            onclick={() => activeTab = tab.id}
                        >
                            <tab.icon size={20} />
                            <span class="font-medium">{tab.label}</span>
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Content Area -->
            <Card class="h-fit">
                {#if activeTab === 'profile'}
                    <ProfileTab />
                {:else if activeTab === 'notifications'}
                    <NotificationsTab />
                {:else if activeTab === 'security'}
                    <SecurityTab />
                {:else if activeTab === 'roles'}
                    <RolesTab />
                {/if}
            </Card>
        </div>
    </div>
</div>

<style>
    /* Custom scrollbar */
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
</style>